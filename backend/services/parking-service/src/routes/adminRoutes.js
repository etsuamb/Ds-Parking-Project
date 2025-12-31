import express from "express";
import authenticate from "../middleware/authenticate.js";
import isAdmin from "../middleware/isAdmin.js";
import { pool } from "../db/index.js";

const router = express.Router();

// GET /admin/parking/lots - List all parking lots with details
router.get('/parking/lots', authenticate, isAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT lot_id AS id,
             COUNT(*) AS "totalSpots",
             COUNT(*) FILTER (WHERE is_reserved = false) AS "availableSpots",
             COUNT(*) FILTER (WHERE is_reserved = true) AS "reservedSpots"
      FROM parking_spots
      GROUP BY lot_id
      ORDER BY lot_id
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching parking lots:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/parking/lots - Create a new parking lot
router.post('/parking/lots', authenticate, isAdmin, async (req, res) => {
  const { lotId, name, spotNumbers } = req.body;

  if (!lotId) {
    return res.status(400).json({ error: "lotId is required" });
  }

  if (!spotNumbers || !Array.isArray(spotNumbers) || spotNumbers.length === 0) {
    return res.status(400).json({ error: "spotNumbers array is required" });
  }

  try {
    // Check if lot already exists
    const existing = await pool.query(
      "SELECT COUNT(*) FROM parking_spots WHERE lot_id = $1",
      [lotId]
    );

    if (parseInt(existing.rows[0].count) > 0) {
      return res.status(409).json({ error: "Parking lot already exists" });
    }

    // Insert all spots for this lot
    for (const spotNumber of spotNumbers) {
      await pool.query(
        "INSERT INTO parking_spots (lot_id, spot_number) VALUES ($1, $2)",
        [lotId, spotNumber]
      );
    }

    res.status(201).json({ 
      message: "Parking lot created successfully",
      lotId,
      totalSpots: spotNumbers.length
    });
  } catch (err) {
    console.error("Error creating parking lot:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /admin/parking/spots - Add parking spots to an existing lot
router.post('/parking/spots', authenticate, isAdmin, async (req, res) => {
  const { lotId, spotNumbers } = req.body;

  if (!lotId || !spotNumbers || !Array.isArray(spotNumbers) || spotNumbers.length === 0) {
    return res.status(400).json({ error: "lotId and spotNumbers array are required" });
  }

  try {
    // Check if lot exists
    const lotCheck = await pool.query(
      "SELECT COUNT(*) FROM parking_spots WHERE lot_id = $1",
      [lotId]
    );

    if (parseInt(lotCheck.rows[0].count) === 0) {
      return res.status(404).json({ error: "Parking lot not found" });
    }

    // Insert new spots
    for (const spotNumber of spotNumbers) {
      await pool.query(
        "INSERT INTO parking_spots (lot_id, spot_number) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [lotId, spotNumber]
      );
    }

    res.status(201).json({ 
      message: "Parking spots added successfully",
      lotId,
      spotsAdded: spotNumbers.length
    });
  } catch (err) {
    console.error("Error adding parking spots:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /admin/parking/lots/:id - Update parking lot (currently just returns info, can be extended)
router.put('/parking/lots/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body; // For future extension if we add a lots table

  try {
    // Check if lot exists
    const lotCheck = await pool.query(
      "SELECT COUNT(*) FROM parking_spots WHERE lot_id = $1",
      [id]
    );

    if (parseInt(lotCheck.rows[0].count) === 0) {
      return res.status(404).json({ error: "Parking lot not found" });
    }

    // For now, just return success (can be extended when lots table is added)
    res.json({ 
      message: "Parking lot updated successfully",
      lotId: id
    });
  } catch (err) {
    console.error("Error updating parking lot:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /admin/parking/lots/:id - Delete parking lot (deletes all spots)
router.delete('/parking/lots/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if lot exists
    const lotCheck = await pool.query(
      "SELECT COUNT(*) FROM parking_spots WHERE lot_id = $1",
      [id]
    );

    if (parseInt(lotCheck.rows[0].count) === 0) {
      return res.status(404).json({ error: "Parking lot not found" });
    }

    // Check if any spots are reserved
    const reservedCheck = await pool.query(
      "SELECT COUNT(*) FROM parking_spots WHERE lot_id = $1 AND is_reserved = true",
      [id]
    );

    if (parseInt(reservedCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: "Cannot delete parking lot with reserved spots. Cancel bookings first." 
      });
    }

    // Delete all spots for this lot
    await pool.query(
      "DELETE FROM parking_spots WHERE lot_id = $1",
      [id]
    );

    res.json({ message: "Parking lot deleted successfully" });
  } catch (err) {
    console.error("Error deleting parking lot:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;