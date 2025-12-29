// src/middleware/isAdmin.js

const isAdmin = (req, res, next) => {
  // Check if user exists and has ADMIN role
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Admin access required' 
    });
  }
  next();
};

export default isAdmin;  // ← ES MODULE EXPORT (this fixes the error)