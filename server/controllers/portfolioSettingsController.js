import PortfolioSettings from '../models/PortfolioSettings.js';

const normalizeInstagramReelUrl = (value) => {
  if (typeof value !== 'string' || value.length > 2048) return null;

  const trimmedValue = value.trim();
  if (!trimmedValue) return '';

  try {
    const url = new URL(trimmedValue);
    if (
      url.protocol !== 'https:' ||
      !['instagram.com', 'www.instagram.com'].includes(url.hostname.toLowerCase())
    ) {
      return null;
    }

    const match = url.pathname.match(/^\/reel\/([A-Za-z0-9_-]+)\/?$/);
    if (!match) return null;

    return `https://www.instagram.com/reel/${match[1]}/`;
  } catch {
    return null;
  }
};

export const getPortfolioSettings = async (_req, res, next) => {
  try {
    const settings = await PortfolioSettings.findOne({ key: 'portfolio' }).lean();
    res.status(200).json({
      success: true,
      data: { instagramReelUrl: settings?.instagramReelUrl || '' },
    });
  } catch (error) {
    next(error);
  }
};

export const updateInstagramReel = async (req, res, next) => {
  try {
    const instagramReelUrl = normalizeInstagramReelUrl(req.body?.instagramReelUrl);
    if (instagramReelUrl === null) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid Instagram Reel URL, or leave it blank to remove the Reel.',
      });
    }

    const settings = await PortfolioSettings.findOneAndUpdate(
      { key: 'portfolio' },
      { $set: { instagramReelUrl } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Instagram Reel updated successfully.',
      data: { instagramReelUrl: settings.instagramReelUrl },
    });
  } catch (error) {
    next(error);
  }
};
