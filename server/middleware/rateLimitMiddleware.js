import rateLimit from 'express-rate-limit';

// Rate limiter for contact inquiry endpoint to prevent spam/abuse
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many project inquiries submitted from this IP, please try again in 15 minutes.',
  },
});

export const chatbotRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many chatbot requests. Please try again in 15 minutes.',
  },
});

export const chatbotLeadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const context = req.body?.context;
    const message = typeof req.body?.message === 'string' ? req.body.message.trim().toLowerCase() : '';
    const normalizedMessage = message.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
    return context?.pendingAction?.type !== 'lead'
      || context.pendingAction.step !== 'confirm'
      || !['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'haan', 'han', 'ji', 'bilkul', 'theek hai', 'kar do', 'send it'].includes(normalizedMessage);
  },
  message: {
    success: false,
    message: 'You have reached the limit of 3 chat inquiries per hour. Please try again later.',
  },
});

// Rate limiter for authentication login attempts
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 login attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.',
  },
});
