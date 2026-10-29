import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Save Gallery files in backend/uploads/gallery
const uploadDir = path.resolve(__dirname, '../uploads/gallery');

// Create the directory if it doesn't exist
fs.mkdirSync(uploadDir, { recursive: true });

// Configure local disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    cb(null, uniqueName);
  },
});

// Supported image and video formats
const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm',
]);

// Validate uploaded files
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only JPG, JPEG, PNG, WEBP, MP4, MOV and WEBM files are allowed.'
      ),
      false
    );
  }
};

// Export middleware for Gallery uploads
export const uploadMiddleware = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB per file
    files: 10, // Maximum 10 files per request
  },
});