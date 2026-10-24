import Project from '../models/Project.js';
import mongoose from 'mongoose';

// Helper to make URL-friendly slug
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const toStringArray = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  return [];
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get all projects (with filtering)
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);
    if (!Number.isSafeInteger(page) || page < 1) {
      return res.status(400).json({ success: false, message: 'Page must be a positive integer.' });
    }
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({ success: false, message: 'Limit must be an integer between 1 and 100.' });
    }
    if (!Number.isSafeInteger((page - 1) * limit)) {
      return res.status(400).json({ success: false, message: 'Requested page is too large.' });
    }
    if (search !== undefined && (typeof search !== 'string' || search.length > 100)) {
      return res.status(400).json({ success: false, message: 'Search must be 100 characters or fewer.' });
    }

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search?.trim()) {
      const escapedSearch = escapeRegex(search.trim());
      query.$or = [
        { title: { $regex: escapedSearch, $options: 'i' } },
        { shortDescription: { $regex: escapedSearch, $options: 'i' } },
        { technologies: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Project.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID or Slug
// @route   GET /api/projects/:id
// @access  Public
export const getProjectByIdOrSlug = async (req, res, next) => {
  try {
    const { id } = req.params;
    let project = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id);
    }

    if (!project) {
      project = await Project.findOne({ slug: id.toLowerCase() });
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found with the specified identifier.',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      shortDescription,
      image,
      screenshots,
      technologies,
      category,
      features,
      challenges,
      solutions,
      githubUrl,
      liveUrl,
      featured,
    } = req.body;

    const finalSlug = slug ? generateSlug(slug) : generateSlug(title);

    // Check slug uniqueness
    const existingProject = await Project.findOne({ slug: finalSlug });
    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: `A project with the slug '${finalSlug}' already exists.`,
      });
    }

    const project = await Project.create({
      title,
      slug: finalSlug,
      description,
      shortDescription,
      image,
      screenshots: Array.isArray(screenshots) ? screenshots : [],
      technologies: toStringArray(technologies),
      category,
      features: toStringArray(features),
      challenges: toStringArray(challenges),
      solutions: toStringArray(solutions),
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      featured: featured === true || featured === 'true',
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    let project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found to update.',
      });
    }

    // Process array formats if passed as comma strings
    const updateData = { ...req.body };
    for (const field of ['technologies', 'features', 'challenges', 'solutions']) {
      if (typeof updateData[field] === 'string') updateData[field] = toStringArray(updateData[field]);
    }
    if (updateData.slug || updateData.title) {
      updateData.slug = generateSlug(updateData.slug || updateData.title);
      const slugOwner = await Project.findOne({ slug: updateData.slug, _id: { $ne: id } });
      if (slugOwner) {
        return res.status(409).json({
          success: false,
          message: `A project with the slug '${updateData.slug}' already exists.`,
        });
      }
    }
    if (typeof updateData.featured === 'string') {
      updateData.featured = updateData.featured === 'true';
    }

    project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found to delete.',
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
