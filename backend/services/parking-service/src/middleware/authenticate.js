// src/middleware/authenticate.js

import jwt from 'jsonwebtoken';

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
    req.user = decoded;  // Makes userId, email, role available in routes
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ 
      error: 'Invalid or expired token' 
    });
  }
};

export default authenticate;  // ← ES MODULE EXPORT
