import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project full description is required'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Project short summary is required'],
      maxlength: 220,
    },
    image: {
      type: String,
      required: [true, 'Primary display image URL is required'],
    },
    screenshots: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Web Development', 'Full Stack', 'Frontend', 'Backend', 'Business', 'SaaS'],
    },
    features: {
      type: [String],
      default: [],
    },
    challenges: {
      type: [String],
      default: [],
    },
    solutions: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      default: '',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
