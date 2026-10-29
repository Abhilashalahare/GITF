import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

export const protectAdmin = async (req, res, next) => {
  try {
    // Get JWT from HTTP-only cookie
    const token = req.cookies?.adminToken;

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.',
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find admin
    const admin = await AdminUser.findById(decoded.id).select(
      '-password'
    );

    // Admin no longer exists
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account no longer exists.',
      });
    }

    // Attach admin to request
    req.admin = admin;

    next();
  } catch (error) {
    console.error('Admin Authentication Error:', error.message);

    // JWT expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.',
      });
    }

    // Invalid/tampered JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};