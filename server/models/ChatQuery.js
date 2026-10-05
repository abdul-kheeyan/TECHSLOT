import mongoose from 'mongoose';

const chatQuerySchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true,
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

chatQuerySchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const ChatQuery = mongoose.model('ChatQuery', chatQuerySchema);
export default ChatQuery;
