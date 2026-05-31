import User from '../models/User.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils.js';
import { asyncHandler } from '../utils/errors.js';
import logger from '../utils/logger.js';

/**
 * Register User
 */
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User already exists with this email',
    });
  }

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });

  await user.save();

  const accessToken = generateToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  logger.info(`User registered: ${user.email}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

/**
 * Login User
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  // Find user and select password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Compare passwords
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = generateToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  logger.info(`User logged in: ${user.email}`);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

/**
 * Refresh Token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required',
    });
  }

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    const accessToken = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken },
    });
  } catch (error) {
    logger.error(`Token refresh error: ${error.message}`);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
});

/**
 * Get Current User
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    message: 'User fetched successfully',
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profilePicture: user.profilePicture,
      city: user.city,
      state: user.state,
      country: user.country,
      preferredLanguage: user.preferredLanguage,
      darkMode: user.darkMode,
      totalTestsAttempted: user.totalTestsAttempted,
      accuracy: user.accuracy,
    },
  });
});

/**
 * Update User Profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, city, state, country, preferredLanguage, darkMode } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName,
      lastName,
      phone,
      city,
      state,
      country,
      preferredLanguage,
      darkMode,
    },
    { new: true, runValidators: true }
  );

  logger.info(`User profile updated: ${user.email}`);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

/**
 * Change Password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Verify current password
  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.info(`Password changed: ${user.email}`);

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * Logout
 */
export const logout = asyncHandler(async (req, res) => {
  logger.info(`User logged out: ${req.user.id}`);

  res.json({
    success: true,
    message: 'Logout successful',
  });
});

export default {
  register,
  login,
  refreshToken,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout,
};
