router.get('/lots', authenticate, isAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT l.id, l.name, l.total_spots, 
             COUNT(s.id) FILTER (WHERE s.status = 'RESERVED') AS reserved_spots
      FROM parking_lots l
      LEFT JOIN parking_spots s ON l.id = s.lot_id
      GROUP BY l.id
    `);
    rows.forEach(row => {
      row.available_spots = row.total_spots - row.reserved_spots;
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});