import express from 'express';
import { answerChatbotQuery } from '../controllers/chatbotController.js';
import { chatbotRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/', chatbotRateLimiter, answerChatbotQuery);

export default router;
