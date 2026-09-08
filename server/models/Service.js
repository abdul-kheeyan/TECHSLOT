import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    icon: {
      type: String,
      required: [true, 'Icon identifier is required'],
      default: 'Code',
    },
    features: {
      type: [String],
      required: [true, 'At least one feature is required'],
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
