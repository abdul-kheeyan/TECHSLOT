import Contact from '../models/Contact.js';
import { sendInquiryNotification } from '../utils/mailer.js';

// @desc    Submit a project inquiry
// @route   POST /api/contact
// @access  Public
export const createContactInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, projectType, budget, timeline, message } = req.body;

    if (!name || !email || !projectType || !budget || !timeline || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Project Type, Budget, Timeline, Message).',
      });
    }

    const contact = await Contact.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      projectType,
      budget,
      timeline,
      message,
      status: 'new',
    });

    try {
      await sendInquiryNotification(contact);
    } catch (mailError) {
      // Keep the inquiry even if the mail provider has a temporary issue.
      console.error(`[Mailer] Unable to send inquiry notification: ${mailError.message}`);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your project inquiry has been received. I will review it and get back to you within 24 hours.',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/contact
// @access  Private/Admin
export const getContactInquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const inquiries = await Contact.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
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

    if (!['new', 'contacted', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: new, contacted, completed.',
      });
    }

    const inquiry = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Contact inquiry not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Inquiry status updated to ${status}.`,
      data: inquiry,
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
    const inquiry = await Contact.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Contact inquiry not found to delete.',
      });
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
