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
    const instagramReels = settings?.instagramReels?.length
      ? settings.instagramReels
      : settings?.instagramReelUrl
        ? [settings.instagramReelUrl]
        : [];
    res.status(200).json({
      success: true,
      data: {
        instagramReels,
        instagramReelUrl: instagramReels[0] || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

const normalizeInstagramReels = (values) => {
  if (!Array.isArray(values)) return null;

  const reels = [];
  for (const value of values) {
    const normalizedUrl = normalizeInstagramReelUrl(value);
    if (!normalizedUrl) return null;
    if (!reels.includes(normalizedUrl)) reels.push(normalizedUrl);
  }
  return reels;
};

const saveInstagramReels = async (reels, res) => {
  const settings = await PortfolioSettings.findOneAndUpdate(
    { key: 'portfolio' },
    {
      $set: {
        instagramReels: reels,
        instagramReelUrl: reels[0] || '',
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json({
    success: true,
    message: 'Instagram Reels updated successfully.',
    data: {
      instagramReels: settings.instagramReels,
      instagramReelUrl: settings.instagramReels[0] || '',
    },
  });
};

export const updateInstagramReels = async (req, res, next) => {
  try {
    const instagramReels = normalizeInstagramReels(req.body?.instagramReels);
    if (instagramReels === null) {
      return res.status(400).json({
        success: false,
        message: 'Enter valid Instagram Reel URLs. Duplicates are removed automatically.',
      });
    }

    return await saveInstagramReels(instagramReels, res);
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

    return await saveInstagramReels(instagramReelUrl ? [instagramReelUrl] : [], res);
  } catch (error) {
    next(error);
  }
};
