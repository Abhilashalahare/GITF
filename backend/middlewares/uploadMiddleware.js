import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: 'GITF-Gallery',

    allowed_formats: [
      'jpg',
      'jpeg',
      'png',
      'webp',
      'mp4',
      'mov',
      'webm',
    ],

    resource_type: 'auto',
  },
});

/*
 * Only allow image and video files.
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',

    'video/mp4',
    'video/quicktime',
    'video/webm',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
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

/*
 * Multer configuration
 */
export const uploadMiddleware = multer({
  storage,

  fileFilter,

  limits: {
    // Maximum size: 100 MB
    fileSize: 100 * 1024 * 1024,

    // Maximum number of files in one request
    files: 10,
  },
});