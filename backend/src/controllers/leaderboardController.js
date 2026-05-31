import Leaderboard from '../models/Leaderboard.js';
import Result from '../models/Result.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/errors.js';
import { getPaginationParams, paginationResponse } from '../utils/helpers.js';
import logger from '../utils/logger.js';

/**
 * Get Daily Leaderboard
 */
export const getDailyLeaderboard = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const leaderboard = await Result.aggregate([
    {
      $match: {
        submittedAt: { $gte: today },
      },
    },
    {
      $group: {
        _id: '$userId',
        totalScore: { $sum: '$score' },
        testCount: { $sum: 1 },
      },
    },
    {
      $sort: { totalScore: -1 },
    },
    {
      $limit: limit,
    },
    {
      $skip: skip,
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $unwind: '$userDetails',
    },
    {
      $project: {
        userId: '$_id',
        firstName: '$userDetails.firstName',
        lastName: '$userDetails.lastName',
        email: '$userDetails.email',
        totalScore: 1,
        testCount: 1,
        _id: 0,
      },
    },
  ]);

  const total = await Result.aggregate([
    {
      $match: {
        submittedAt: { $gte: today },
      },
    },
    {
      $group: {
        _id: '$userId',
      },
    },
    {
      $count: 'total',
    },
  ]);

  const totalCount = total.length > 0 ? total[0].total : 0;

  // Add rank
  const leaderboardWithRank = leaderboard.map((item, index) => ({
    ...item,
    rank: skip + index + 1,
  }));

  res.json({
    success: true,
    message: 'Daily leaderboard fetched successfully',
    data: paginationResponse(leaderboardWithRank, parseInt(req.query.page) || 1, limit, totalCount),
  });
});

/**
 * Get Weekly Leaderboard
 */
export const getWeeklyLeaderboard = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const leaderboard = await Result.aggregate([
    {
      $match: {
        submittedAt: { $gte: weekAgo },
      },
    },
    {
      $group: {
        _id: '$userId',
        totalScore: { $sum: '$score' },
        testCount: { $sum: 1 },
      },
    },
    {
      $sort: { totalScore: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $unwind: '$userDetails',
    },
    {
      $project: {
        userId: '$_id',
        firstName: '$userDetails.firstName',
        lastName: '$userDetails.lastName',
        email: '$userDetails.email',
        totalScore: 1,
        testCount: 1,
        _id: 0,
      },
    },
  ]);

  const total = await Result.aggregate([
    {
      $match: {
        submittedAt: { $gte: weekAgo },
      },
    },
    {
      $group: {
        _id: '$userId',
      },
    },
    {
      $count: 'total',
    },
  ]);

  const totalCount = total.length > 0 ? total[0].total : 0;

  const leaderboardWithRank = leaderboard.map((item, index) => ({
    ...item,
    rank: skip + index + 1,
  }));

  res.json({
    success: true,
    message: 'Weekly leaderboard fetched successfully',
    data: paginationResponse(leaderboardWithRank, parseInt(req.query.page) || 1, limit, totalCount),
  });
});

/**
 * Get Monthly Leaderboard
 */
export const getMonthlyLeaderboard = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);

  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const leaderboard = await Result.aggregate([
    {
      $match: {
        submittedAt: { $gte: monthAgo },
      },
    },
    {
      $group: {
        _id: '$userId',
        totalScore: { $sum: '$score' },
        testCount: { $sum: 1 },
      },
    },
    {
      $sort: { totalScore: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $unwind: '$userDetails',
    },
    {
      $project: {
        userId: '$_id',
        firstName: '$userDetails.firstName',
        lastName: '$userDetails.lastName',
        email: '$userDetails.email',
        totalScore: 1,
        testCount: 1,
        _id: 0,
      },
    },
  ]);

  const total = await Result.aggregate([
    {
      $match: {
        submittedAt: { $gte: monthAgo },
      },
    },
    {
      $group: {
        _id: '$userId',
      },
    },
    {
      $count: 'total',
    },
  ]);

  const totalCount = total.length > 0 ? total[0].total : 0;

  const leaderboardWithRank = leaderboard.map((item, index) => ({
    ...item,
    rank: skip + index + 1,
  }));

  res.json({
    success: true,
    message: 'Monthly leaderboard fetched successfully',
    data: paginationResponse(leaderboardWithRank, parseInt(req.query.page) || 1, limit, totalCount),
  });
});

/**
 * Get Overall Leaderboard
 */
export const getOverallLeaderboard = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);

  const leaderboard = await Result.aggregate([
    {
      $group: {
        _id: '$userId',
        totalScore: { $sum: '$score' },
        testCount: { $sum: 1 },
        averageScore: { $avg: '$score' },
      },
    },
    {
      $sort: { totalScore: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $unwind: '$userDetails',
    },
    {
      $project: {
        userId: '$_id',
        firstName: '$userDetails.firstName',
        lastName: '$userDetails.lastName',
        email: '$userDetails.email',
        totalScore: 1,
        testCount: 1,
        averageScore: { $round: ['$averageScore', 2] },
        _id: 0,
      },
    },
  ]);

  const total = await Result.aggregate([
    {
      $group: {
        _id: '$userId',
      },
    },
    {
      $count: 'total',
    },
  ]);

  const totalCount = total.length > 0 ? total[0].total : 0;

  const leaderboardWithRank = leaderboard.map((item, index) => ({
    ...item,
    rank: skip + index + 1,
  }));

  res.json({
    success: true,
    message: 'Overall leaderboard fetched successfully',
    data: paginationResponse(leaderboardWithRank, parseInt(req.query.page) || 1, limit, totalCount),
  });
});

/**
 * Get User's Rank
 */
export const getUserRank = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const userResults = await Result.aggregate([
    {
      $group: {
        _id: userId,
        totalScore: { $sum: '$score' },
      },
    },
  ]);

  if (userResults.length === 0) {
    return res.json({
      success: true,
      message: 'User has not taken any test',
      data: null,
    });
  }

  const userScore = userResults[0].totalScore;

  const betterScores = await Result.aggregate([
    {
      $group: {
        _id: '$userId',
        totalScore: { $sum: '$score' },
      },
    },
    {
      $match: {
        totalScore: { $gt: userScore },
      },
    },
    {
      $count: 'count',
    },
  ]);

  const rank = betterScores.length > 0 ? betterScores[0].count + 1 : 1;

  res.json({
    success: true,
    message: 'User rank fetched successfully',
    data: {
      rank,
      totalScore: userScore,
    },
  });
});

export default {
  getDailyLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getOverallLeaderboard,
  getUserRank,
};
