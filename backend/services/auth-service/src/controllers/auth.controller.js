import bcrypt from "bcrypt";
import { pool } from "../db/index.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { username, email, password } = req.body;

  // Basic input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const hash = await bcrypt.hash(password, 4);

    await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)",
      [username, email, hash]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === "23505") { // PostgreSQL unique violation code
      if (err.constraint && err.constraint.includes('email')) {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res.status(409).json({ message: "Username already exists" });
    }
    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
   const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role  // Crucial: Include role for admin checks
    // Remove username if not needed; keep minimal data
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }  // Good practice: short expiry
);

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}