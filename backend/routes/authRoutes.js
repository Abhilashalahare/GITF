
import express from 'express';

import {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
} from '../controllers/authController.js';

import { protectAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get(
  '/me',
  (req, res, next) => {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0',
    });

    next();
  },
  protectAdmin,
  getCurrentAdmin
);

export default router;
