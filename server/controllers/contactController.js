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

    // --------------------------------------------------
    // STEP 1: Save inquiry to MongoDB
    // --------------------------------------------------
    // MongoDB is the source of truth.
    // If this succeeds, the inquiry is considered successful.
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

    console.log(
      `[Contact] Inquiry saved successfully. ID: ${contact._id}`
    );

    // --------------------------------------------------
    // STEP 2: Send email notification (OPTIONAL)
    // --------------------------------------------------
    // Email failure must NEVER make the contact submission fail.
    try {
      await sendInquiryNotification(contact);

      console.log(
        `[Mailer] Inquiry notification sent successfully. ID: ${contact._id}`
      );
    } catch (mailError) {
      console.error(
        `[Mailer] Email notification failed for inquiry ${contact._id}:`,
        mailError.message
      );

      // IMPORTANT:
      // Do NOT return an error here.
      // The inquiry is already safely stored in MongoDB.
    }

    // --------------------------------------------------
    // STEP 3: Always return success after DB save
    // --------------------------------------------------
    return res.status(201).json({
      success: true,
      message:
        'Thank you! Your project inquiry has been received. I will review it and get back to you within 24 hours.',
      data: contact,
    });
  } catch (error) {
    // If MongoDB save itself fails,
    // then the inquiry was NOT successfully submitted.
    console.error(
      '[Contact] Failed to save inquiry:',
      error.message
    );

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

    const inquiries = await Contact.find(query).sort({
      createdAt: -1,
    });

    return res.status(200).json({
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

    // Validate status
    if (!['new', 'contacted', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'Status must be one of: new, contacted, completed.',
      });
    }

    const inquiry = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Contact inquiry not found.',
      });
    }

    return res.status(200).json({
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

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};