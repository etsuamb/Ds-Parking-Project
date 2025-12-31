// ./routes/adminRoutes.js

import express from "express";
import authenticate from "../middleware/authenticate.js";
import isAdmin from "../middleware/isAdmin.js";
import { pool } from "../db/index.js";
import { publishEvent } from "../messaging/eventPublisher.js";
import pkg from "pg";
const { Pool: AuthPool } = pkg;

// Connection to auth database for fetching user info
const authPool = new AuthPool({
  host: "auth-db",
  port: 5432,
  user: "postgres",
  password: "pgforcss",
  database: "auth_db"
});

const router = express.Router();

// GET /admin/bookings - List all bookings with user info
router.get("/bookings", authenticate, isAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM bookings ORDER BY created_at DESC"
    );

    // Fetch user info for each booking
    const bookingsWithUsers = await Promise.all(
      rows.map(async (booking) => {
        try {
          const userResult = await authPool.query(
            "SELECT id, username, email FROM users WHERE id = $1",
            [booking.user_id]
          );
          return {
            ...booking,
            user: userResult.rows[0] || { id: booking.user_id, username: null, email: null }
          };
        } catch (err) {
          console.error(`Error fetching user ${booking.user_id}:`, err);
          return {
            ...booking,
            user: { id: booking.user_id, username: null, email: null }
          };
        }
      })
    );

    res.json(bookingsWithUsers);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /admin/bookings/:id - Get booking details with user info
router.get("/bookings/:id", authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query("SELECT * FROM bookings WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = rows[0];

    // Fetch user info
    try {
      const userResult = await authPool.query(
        "SELECT id, username, email FROM users WHERE id = $1",
        [booking.user_id]
      );
      booking.user = userResult.rows[0] || { id: booking.user_id, username: null, email: null };
    } catch (err) {
      console.error(`Error fetching user ${booking.user_id}:`, err);
      booking.user = { id: booking.user_id, username: null, email: null };
    }

    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /admin/bookings/:id/cancel - Force cancel any booking
router.post("/bookings/:id/cancel", authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query("SELECT * FROM bookings WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = rows[0];

    // Update booking status
    await pool.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = $1",
      [id]
    );

    // Publish cancellation event
    await publishEvent("booking.cancelled", {
      bookingId: parseInt(id),
      userId: booking.user_id,
      lotId: booking.lot_id,
      spotId: booking.spot_id,
      timestamp: new Date().toISOString()
    });

    res.json({ message: "Booking cancelled by admin" });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;