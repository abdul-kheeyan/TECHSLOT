import express from 'express';
import { answerChatbotQuery, getUnansweredChatQueries } from '../controllers/chatbotController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { chatbotRateLimiter, chatbotLeadRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.get('/unanswered', protect, adminOnly, getUnansweredChatQueries);
router.post('/', chatbotRateLimiter, chatbotLeadRateLimiter, answerChatbotQuery);

export default router;
