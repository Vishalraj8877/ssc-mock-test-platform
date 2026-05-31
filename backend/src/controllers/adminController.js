import User from '../models/User.js';
import Question from '../models/Question.js';
import Test from '../models/Test.js';
import Result from '../models/Result.js';
import { asyncHandler } from '../utils/errors.js';
import { getPaginationParams, paginationResponse } from '../utils/helpers.js';
import logger from '../utils/logger.js';

/**
 * Get Admin Dashboard Statistics
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalAdmins = await User.countDocuments({ role: { $in: ['Admin', 'SuperAdmin'] } });
  const totalStudents = await User.countDocuments({ role: 'Student' });
  const totalQuestions = await Question.countDocuments({ isDeleted: false });
  const totalTests = await Test.countDocuments({ isDeleted: false });
  const totalResults = await Result.countDocuments();

  const recentResults = await Result.find()
    .limit(10)
    .sort({ submittedAt: -1 })
    .populate('userId', 'firstName lastName email')
    .populate('testId', 'title');

  res.json({
    success: true,
    message: 'Dashboard statistics fetched successfully',
    data: {
      totalUsers,
      totalAdmins,
      totalStudents,
      totalQuestions,
      totalTests,
      totalResults,
      recentResults,
    },
  });
});

/**
 * Get All Users (Admin Only)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);
  const { role } = req.query;

  const filter = {};
  if (role) filter.role = role;

  const users = await User.find(filter)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    message: 'Users fetched successfully',
    data: paginationResponse(users, page, limit, total),
  });
});

/**
 * Update User Role (SuperAdmin Only)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['Student', 'Admin', 'SuperAdmin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role',
    });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  logger.info(`User role updated: ${user.email} -> ${role}`);

  res.json({
    success: true,
    message: 'User role updated successfully',
    data: user,
  });
});

/**
 * Ban/Unban User (SuperAdmin Only)
 */
export const toggleUserBan = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  user.isBanned = !user.isBanned;
  await user.save();

  logger.info(`User banned status changed: ${user.email} -> ${user.isBanned}`);

  res.json({
    success: true,
    message: user.isBanned ? 'User banned' : 'User unbanned',
    data: user,
  });
});

/**
 * Get Platform Analytics
 */
export const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const totalResults = await Result.countDocuments();
  const totalTests = await Test.countDocuments({ isDeleted: false });
  const totalQuestions = await Question.countDocuments({ isDeleted: false });

  // Get average test score
  const avgScoreData = await Result.aggregate([
    {
      $group: {
        _id: null,
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
      },
    },
  ]);

  const averageScore = avgScoreData.length > 0 ? avgScoreData[0].averageScore : 0;
  const averageAccuracy = avgScoreData.length > 0 ? avgScoreData[0].averageAccuracy : 0;

  // Get questions by subject
  const questionsBySubject = await Question.aggregate([
    {
      $group: {
        _id: '$subject',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get tests by type
  const testsByType = await Test.aggregate([
    {
      $group: {
        _id: '$testType',
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    success: true,
    message: 'Platform analytics fetched successfully',
    data: {
      totalResults,
      totalTests,
      totalQuestions,
      averageScore: averageScore.toFixed(2),
      averageAccuracy: averageAccuracy.toFixed(2),
      questionsBySubject,
      testsByType,
    },
  });
});

export default {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserBan,
  getPlatformAnalytics,
};
