import express from 'express';

import {
  uploadGalleryItem,
  getGalleryItems,
  deleteGalleryItem,
} from '../controllers/galleryController.js';

import { protectAdmin } from '../middlewares/authMiddleware.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getGalleryItems);

router.post(
  '/upload',
  protectAdmin,
  uploadMiddleware.single('file'),
  uploadGalleryItem
);

router.delete(
  '/:id',
  protectAdmin,
  deleteGalleryItem
);

export default router;