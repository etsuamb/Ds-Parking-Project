import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { subscribe } from "./messaging/eventSubscriber.js";
import { handleSpotReserved } from "./handlers/spotReserved.handler.js";

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store the io instance for handlers to use
global.io = io;

io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Subscribe to Redis events and emit via socket.io
subscribe("parking.spot.reserved", handleSpotReserved);
subscribe("booking.created", (event) => {
  console.log("📧 Booking created event:", event);
  io.emit("notification", {
    type: "booking.created",
    message: `Booking ${event.payload?.bookingId || 'created'} confirmed!`,
    data: event.payload
  });
});

subscribe("booking.cancelled", (event) => {
  console.log("📧 Booking cancelled event:", event);
  io.emit("notification", {
    type: "booking.cancelled",
    message: `Booking ${event.payload?.bookingId || ''} cancelled.`,
    data: event.payload
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🔔 Notification Service (Socket.io) running on port ${PORT}`);
});
