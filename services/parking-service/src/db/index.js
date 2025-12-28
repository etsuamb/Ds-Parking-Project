import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: "parking-db",              // works with -p 5433:5432 mapping
  port: 5432,                     // your Docker port mapping
  user: "postgres",
  password: "pgforcss",     // ← THIS MUST MATCH your Docker command
  database: "parking_db"
});

pool.on("connect", () => {
  console.log("🅿️ Parking DB connected successfully");
});

pool.on("error", (err) => {
  console.error("Parking DB pool error:", err);
});