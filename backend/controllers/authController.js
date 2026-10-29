import AdminUser from "../models/AdminUser.js";
import jwt from "jsonwebtoken";

/**
 * Authentication configuration
 */
const TOKEN_EXPIRY = "1d";
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Cookie options
 *
 * Production: HTTPS + cross-origin frontend/backend
 * Development: HTTP localhost
 */
const getCookieOptions = () => ({
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: IS_PRODUCTION ? "none" : "lax",
  maxAge: COOKIE_MAX_AGE,
  path: "/",
});

/**
 * Generate JWT
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    { id: id.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRY,
      issuer: "bivv-admin",
      audience: "bivv-admin-panel",
    }
  );
};

/**
 * POST /api/auth/login
 */
export const loginAdmin = async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password ||
      email.length > 254 ||
      password.length > 1024
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid login credentials.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        success: false,
        message: "Authentication service is unavailable.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const admin = await AdminUser.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(admin._id);

    res.cookie("adminToken", token, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      admin: {
        id: admin._id.toString(),
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again later.",
    });
  }
};

/**
 * POST /api/auth/logout
 */
export const logoutAdmin = async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    // Use the same cookie attributes as login.
    const { maxAge, ...clearOptions } = getCookieOptions();

    res.clearCookie("adminToken", clearOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Admin Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log out. Please try again.",
    });
  }
};

/**
 * GET /api/auth/me
 *
 * Requires authentication middleware.
 */
export const getCurrentAdmin = async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: req.admin._id.toString(),
        email: req.admin.email,
      },
    });
  } catch (error) {
    console.error("Get Current Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve admin information.",
    });
  }
};