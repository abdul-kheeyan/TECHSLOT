import Contact from '../models/Contact.js';
import ChatQuery from '../models/ChatQuery.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import { processChatMessage } from '../chatbot/engine.js';
import { sendInquiryNotification } from '../utils/mailer.js';

const contactOptions = Object.fromEntries(
  ['projectType', 'budget', 'timeline'].map((field) => [
    field,
    Contact.schema.path(field).enumValues,
  ])
);

export const answerChatbotQuery = async (req, res, next) => {
  try {
    const { message, context } = req.body || {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter a question.' });
    }
    if (message.length > 500) {
      return res.status(400).json({ success: false, message: 'Questions must be 500 characters or fewer.' });
    }

    const result = await processChatMessage(message, context, {
      contactOptions,
      getProjects: async () => {
        const projects = await Project.find({}).sort({ createdAt: -1 }).limit(8)
          .select('title slug shortDescription liveUrl');
        return projects.map(({ title, slug, shortDescription, liveUrl }) => ({
          title,
          shortDescription,
          slug,
          liveUrl,
        }));
      },
      getServices: async () => Service.find({}).sort({ createdAt: 1 })
        .select('title description'),
      saveLead: async (lead) => {
        const validatedLead = {
          name: lead.name.trim(),
          email: lead.email.toLowerCase().trim(),
          phone: '',
          projectType: lead.projectType,
          budget: lead.budget,
          timeline: lead.timeline,
          message: lead.message.trim(),
          status: 'new',
        };
        const contact = await Contact.create(validatedLead);
        if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
          sendInquiryNotification(contact)
            .then(() => console.log('[Mailer] Inquiry notification sent successfully.'))
            .catch((mailError) => console.error('[Mailer] Email notification failed:', mailError.message));
        } else {
          console.log('[Mailer] Email notifications disabled. Inquiry saved successfully.');
        }
        return contact;
      },
    });

    if (result.unanswered) {
      await ChatQuery.create({
        message: message.trim().slice(0, 300),
        language: result.context.language,
      });
    }
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

export const getUnansweredChatQueries = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 50, 1), 100);
    const [queries, total] = await Promise.all([
      ChatQuery.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      ChatQuery.countDocuments({}),
    ]);
    return res.status(200).json({
      success: true,
      data: queries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return next(error);
  }
};
