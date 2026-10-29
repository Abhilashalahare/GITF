import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import AdminUser from "../models/AdminUser.js";

export const protectAdmin = async (req, res, next) => {
  res.set("Cache-Control", "no-store");

  try {
    const token = req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        success: false,
        message: "Authentication service is unavailable.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "bivv-admin",
      audience: "bivv-admin-panel",
    });

    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "string" ||
      !mongoose.isValidObjectId(decoded.id)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    const admin = await AdminUser.findById(decoded.id).select("_id email");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account no longer exists. Please log in again.",
      });
    }

    req.admin = admin;

    return next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Your session is invalid or expired. Please log in again.",
      });
    }

    console.error("Admin Authentication Error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};