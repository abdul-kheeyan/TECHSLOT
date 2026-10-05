import { answerChatbotQuestion } from '../data/chatbotFaq.js';

export const answerChatbotQuery = (req, res) => {
  const { message } = req.body;

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a question.',
    });
  }

  if (message.length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Questions must be 500 characters or fewer.',
    });
  }

  return res.status(200).json({
    success: true,
    data: answerChatbotQuestion(message.trim()),
  });
};
