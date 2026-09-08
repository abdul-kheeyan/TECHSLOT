import express from 'express';
import {
  createContactInquiry,
  getContactInquiries,
  updateContactStatus,
  deleteContactInquiry,
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { contactRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.route('/')
  .post(contactRateLimiter, createContactInquiry)
  .get(protect, adminOnly, getContactInquiries);

router.route('/:id')
  .put(protect, adminOnly, updateContactStatus)
  .delete(protect, adminOnly, deleteContactInquiry);

export default router;
