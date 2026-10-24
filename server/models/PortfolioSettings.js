import mongoose from 'mongoose';

const portfolioSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'portfolio',
      unique: true,
    },
    instagramReelUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const PortfolioSettings = mongoose.model('PortfolioSettings', portfolioSettingsSchema);
export default PortfolioSettings;
