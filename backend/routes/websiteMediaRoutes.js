
import express from 'express';

import {
  getWebsiteMedia,
  getAllWebsiteMedia,
  uploadWebsiteMedia,
  updateWebsiteMediaStatus,
  deleteWebsiteMedia,
} from '../controllers/websiteMediaController.js';

import { protectAdmin } from '../middlewares/authMiddleware.js';

import {
  websiteMediaUploadMiddleware,
} from '../middlewares/websiteMediaUploadMiddleware.js';

const router = express.Router();

// Public route: fetch active website media
router.get('/', getWebsiteMedia);

// Admin route: fetch all media, including inactive items
router.get('/admin', protectAdmin, getAllWebsiteMedia);

// Admin route: upload new media or replace an existing placement
router.post(
  '/upload',
  protectAdmin,
  websiteMediaUploadMiddleware.single('file'),
  uploadWebsiteMedia
);

// Admin route: activate or deactivate media
router.patch(
  '/:id/status',
  protectAdmin,
  updateWebsiteMediaStatus
);

// Admin route: delete media
router.delete(
  '/:id',
  protectAdmin,
  deleteWebsiteMedia
);

export default router;
