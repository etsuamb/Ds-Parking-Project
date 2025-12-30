import express from "express";
import { subscribe } from "./messaging/eventSubscriber.js";
import { handleBookingCreated } from "./events/bookingCreated.handler.js";
import { handleBookingCancelled } from "./events/bookingCancelled.handler.js";
import parkingRouter from "./routes/parking.routes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// ADD THIS - FOR ANY FUTURE JSON ROUTES
app.use(express.json());

// Event subscriptions
subscribe("booking.created", handleBookingCreated);
subscribe("booking.cancelled", handleBookingCancelled);

// Routes
app.use("/parking", parkingRouter);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🅿️ Parking Service running on port ${PORT}`);
});