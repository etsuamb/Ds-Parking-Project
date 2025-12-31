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

  // Regular users can only register as USER role
  const role = 'USER';

  try {
    const hash = await bcrypt.hash(password, 4);

    await pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)",
      [username, email, hash, role]
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

export async function registerAdmin(req, res) {
  const { username, email, password, adminSecret } = req.body;

  // Basic input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  // Check admin secret key
  const requiredSecret = process.env.ADMIN_SECRET_KEY || 'admin-secret-key-change-in-production';
  if (!adminSecret || adminSecret !== requiredSecret) {
    return res.status(403).json({ message: "Invalid admin secret key" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const hash = await bcrypt.hash(password, 4);

    await pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)",
      [username, email, hash, 'ADMIN']
    );

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    if (err.code === "23505") { // PostgreSQL unique violation code
      if (err.constraint && err.constraint.includes('email')) {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res.status(409).json({ message: "Username already exists" });
    }
    console.error("Admin registration error:", err);
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

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUsers(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}