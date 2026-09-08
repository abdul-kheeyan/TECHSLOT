import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    projectType: {
      type: String,
      required: [true, 'Project type is required'],
      enum: [
        'Website',
        'Web Application',
        'MERN Application',
        'Frontend',
        'Backend/API',
        'Other',
      ],
    },
    budget: {
      type: String,
      required: [true, 'Budget estimate is required'],
      enum: [
        'Under ₹10,000',
        '₹10,000 - ₹25,000',
        '₹25,000 - ₹50,000',
        '₹50,000+',
        'Custom',
      ],
    },
    timeline: {
      type: String,
      required: [true, 'Timeline expectation is required'],
      enum: ['1-2 Weeks', '2-4 Weeks', '1-2 Months', 'Flexible'],
    },
    message: {
      type: String,
      required: [true, 'Project overview message is required'],
      minlength: [10, 'Message must be at least 10 characters long'],
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'completed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
