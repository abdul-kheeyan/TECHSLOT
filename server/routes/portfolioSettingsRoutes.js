import express from 'express';
import {
  getPortfolioSettings,
  updateInstagramReel,
  updateInstagramReels,
} from '../controllers/portfolioSettingsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPortfolioSettings);
router.put('/instagram-reels', protect, adminOnly, updateInstagramReels);
router.put('/instagram-reel', protect, adminOnly, updateInstagramReel);

export default router;
