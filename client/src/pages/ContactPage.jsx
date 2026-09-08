import Contact from '../models/Contact.js';
import { sendInquiryNotification } from '../utils/mailer.js';

// @desc    Submit a project inquiry
// @route   POST /api/contact
// @access  Public
export const createContactInquiry = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      projectType,
      budget,
      timeline,
      message,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !projectType ||
      !budget ||
      !timeline ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please fill in all required fields (Name, Email, Project Type, Budget, Timeline, Message).',
      });
    }

    // Save inquiry to MongoDB first
    const contact = await Contact.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      projectType,
      budget,
      timeline,
      message: message.trim(),
      status: 'new',
    });

    /*
     * IMPORTANT:
     * Email notification must NOT block the API response.
     *
     * MongoDB save is already successful.
     * We immediately send success response to frontend.
     *
     * Email will be attempted in the background.
     */
    if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
      sendInquiryNotification(contact)
        .then(() => {
          console.log('[Mailer] Inquiry notification sent successfully.');
        })
        .catch((mailError) => {
          console.error(
            `[Mailer] Unable to send inquiry notification: ${mailError.message}`
          );
        });
    } else {
      console.log(
        '[Mailer] Email notifications are disabled. Inquiry saved successfully.'
      );
    }

    // Send success response immediately after DB save
    return res.status(201).json({
      success: true,
      message:
        'Thank you! Your project inquiry has been received. I will review it and get back to you within 24 hours.',
      data: contact,
    });
  } catch (error) {
    console.error('[Contact] Error creating inquiry:', error);
    next(error);
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Private/Admin
export const getContactInquiries = async (req, res, next) => {
  try {
    const {
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Contact.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact inquiry status
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['new', 'read', 'replied', 'archived'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status.',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact inquiry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact status updated successfully.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact inquiry
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactInquiry = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact inquiry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact inquiry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};