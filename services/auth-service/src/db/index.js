// auth-service/db/index.js
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",              // your DB user
  host: "auth-db",             // usually localhost
  database: "auth_db",           // your database
  password: "pgforcss", // the password you use in pgAdmin
  port: 5432,
  connectionTimeoutMillis: 5000, // fail fast if DB not reachable
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL (Auth Service)");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL connection error:", err);
});
