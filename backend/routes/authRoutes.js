
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
router.get('/me', protectAdmin, getCurrentAdmin);

export default router;
