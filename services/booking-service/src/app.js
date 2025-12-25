import express from "express";
import bookingsRoutes from "./routes/bookings.routes.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Booking Service is running" });
});

app.use("/bookings", bookingsRoutes);

export default app;
