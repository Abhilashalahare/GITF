import AdminUser from '../models/AdminUser.js';
import jwt from 'jsonwebtoken';

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
};

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    { id: id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const admin = await AdminUser.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password');

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(admin._id);

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

export const logoutAdmin = async (req, res) => {
  try {
    // Prevent caching of the logout response.
    res.set('Cache-Control', 'no-store');

    // Clear the cookie using the same attributes as login.
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
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
      message: 'Logout failed',
    });
  }
};

export const getCurrentAdmin = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: {
      id: req.admin._id,
      email: req.admin.email,
    },
  });
};