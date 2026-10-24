import express from 'express';
import {
  loginUser,
  getUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/login', authRateLimiter, loginUser);
router.get('/me', protect, getUserProfile);

export default router;
