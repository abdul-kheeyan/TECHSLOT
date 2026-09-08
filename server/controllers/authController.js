import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Seed or Register Initial Admin
// @route   POST /api/auth/setup-admin
// @access  Public (only works if zero users exist)
export const setupAdmin = async (req, res, next) => {
  try {
    // Production admins are provisioned with the seed script. Keeping this
    // bootstrap route out of production prevents an anonymous first request
    // from claiming the administrator role on an empty database.
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({
        success: false,
        message: 'Route not found.',
      });
    }

    const userCount = await User.countDocuments({});
    if (userCount > 0) {
      return res.status(403).json({
        success: false,
        message: 'Admin account is already initialized. Use /api/auth/login.',
      });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password for admin account.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};
