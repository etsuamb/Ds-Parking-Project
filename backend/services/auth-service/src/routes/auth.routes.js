// auth.routes.js
import express from "express";
import { register, login, registerAdmin, getUsers } from "../controllers/auth.controller.js";
import jwt from "jsonwebtoken";

// Middleware to authenticate and check admin role
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'No token provided. Authorization header missing or invalid.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ 
      error: 'Invalid or expired token' 
    });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Admin access required' 
    });
  }
  next();
};

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/register-admin", registerAdmin);
router.get("/users", authenticate, isAdmin, getUsers);

export default router;
