import express from 'express';
import {
  loginUser,
  getUserProfile,
  setupAdmin,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/login', authRateLimiter, loginUser);
router.get('/me', protect, getUserProfile);
router.post('/setup-admin', setupAdmin);

export default router;
