import AdminUser from '../models/AdminUser.js';
import jwt from 'jsonwebtoken';

/**
 * Generate JWT
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    { id: id.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );
};

/**
 * Cookie options
 */
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
};

/**
 * POST /api/auth/login
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    /*
     * Password has select:false in AdminUser.js,
     * therefore we explicitly select it here.
     */
    const admin = await AdminUser.findOne({
      email: normalizedEmail,
    }).select('+password');

    // Don't reveal whether email exists
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = generateToken(admin._id);

    // Store JWT in HTTP-only cookie
    res.cookie('adminToken', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Admin Login Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * POST /api/auth/logout
 */
export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production'
          ? 'none'
          : 'lax',
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong during logout',
    });
  }
};

// controllers/authController.js

export const getCurrentAdmin = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id,
        email: req.admin.email,
      },
    });
  } catch (error) {
    console.error('Get Current Admin Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to get admin information.',
    });
  }
};