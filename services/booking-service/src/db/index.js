import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: "booking-db",  // Change to "host.docker.internal" if connection fails on Windows
  port: 5432,
  user: "postgres",
  password: "pgforcss",  // Match what you set in Docker
  database: "parking_booking_db"
});