import express from "express";
import { pool } from "../db/index.js";

const router = express.Router();

router.get("/lots", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT lot_id AS id,
             COUNT(*) AS "totalSpots",
             COUNT(*) FILTER (WHERE is_reserved = false) AS "availableSpots"
      FROM parking_spots
      GROUP BY lot_id
      ORDER BY lot_id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/lots/:lotId", async (req, res) => {
  const { lotId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        id,
        lot_id AS "lotId",
        spot_number AS "spotNumber",
        CASE 
          WHEN is_reserved = true THEN 'reserved'
          ELSE 'available'
        END AS status
      FROM parking_spots 
      WHERE lot_id = $1
      ORDER BY spot_number`,
      [lotId]
    );
    
    // Return both the lot info and spots
    const lotInfo = {
      id: lotId,
      spots: result.rows
    };
    
    res.json(lotInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
