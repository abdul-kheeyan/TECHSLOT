import express from 'express';
import {
  getPortfolioSettings,
  updateInstagramReel,
} from '../controllers/portfolioSettingsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPortfolioSettings);
router.put('/instagram-reel', protect, adminOnly, updateInstagramReel);

export default router;
