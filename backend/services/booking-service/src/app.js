import express from "express";
import bookingsRouter from "./routes/bookings.routes.js";
import adminRoutes from "./routes/adminRoutes.js";  // ← Proper ES module import

const app = express();

// CRITICAL: Parse JSON bodies — must be before routes
app.use(express.json());

// Mount the routes
app.use("/bookings", bookingsRouter);
app.use("/admin", adminRoutes);  // ← Now using the imported ES module version

export default app;