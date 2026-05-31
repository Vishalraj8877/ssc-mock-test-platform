import Result from '../models/Result.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/errors.js';
import logger from '../utils/logger.js';

/**
 * Get User Performance Analytics
 */
export const getUserPerformance = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const results = await Result.find({ userId }).sort({ submittedAt: -1 });

  if (results.length === 0) {
    return res.json({
      success: true,
      message: 'No test results found',
      data: null,
    });
  }

  const totalTests = results.length;
  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalTests;
  const averageAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests;
  const averagePercentile = results.reduce((sum, r) => sum + r.percentile, 0) / totalTests;

  const bestScore = Math.max(...results.map(r => r.score));
  const worstScore = Math.min(...results.map(r => r.score));

  res.json({
    success: true,
    message: 'Performance analytics fetched successfully',
    data: {
      totalTests,
      averageScore: averageScore.toFixed(2),
      averageAccuracy: averageAccuracy.toFixed(2),
      averagePercentile: averagePercentile.toFixed(2),
      bestScore: bestScore.toFixed(2),
      worstScore: worstScore.toFixed(2),
    },
  });
});

/**
 * Get Accuracy Trend
 */
export const getAccuracyTrend = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { days = 30 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const results = await Result.find({
    userId,
    submittedAt: { $gte: startDate },
  }).sort({ submittedAt: 1 });

  const trendData = results.map(r => ({
    date: r.submittedAt.toISOString().split('T')[0],
    accuracy: r.accuracy,
    score: r.score,
  }));

  res.json({
    success: true,
    message: 'Accuracy trend fetched successfully',
    data: trendData,
  });
});

/**
 * Get Subject Performance
 */
export const getSubjectPerformance = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const results = await Result.find({ userId });

  const subjectPerformance = {};

  results.forEach(result => {
    result.subjectAnalysis.forEach(subject => {
      if (!subjectPerformance[subject.subject]) {
        subjectPerformance[subject.subject] = {
          subject: subject.subject,
          totalQuestions: 0,
          attempted: 0,
          correct: 0,
          accuracy: 0,
          totalTests: 0,
        };
      }

      subjectPerformance[subject.subject].totalQuestions += subject.totalQuestions;
      subjectPerformance[subject.subject].attempted += subject.attempted;
      subjectPerformance[subject.subject].correct += subject.correct;
      subjectPerformance[subject.subject].totalTests += 1;
    });
  });

  // Calculate average accuracy
  Object.values(subjectPerformance).forEach(subject => {
    if (subject.attempted > 0) {
      subject.accuracy = (subject.correct / subject.attempted) * 100;
    }
  });

  res.json({
    success: true,
    message: 'Subject performance fetched successfully',
    data: Object.values(subjectPerformance),
  });
});

/**
 * Get Topic Weakness
 */
export const getTopicWeakness = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const results = await Result.find({ userId });

  const topicPerformance = {};

  results.forEach(result => {
    result.topicAnalysis.forEach(topic => {
      if (!topicPerformance[topic.topic]) {
        topicPerformance[topic.topic] = {
          topic: topic.topic,
          totalQuestions: 0,
          attempted: 0,
          correct: 0,
          accuracy: 0,
        };
      }

      topicPerformance[topic.topic].totalQuestions += topic.totalQuestions;
      topicPerformance[topic.topic].attempted += topic.attempted;
      topicPerformance[topic.topic].correct += topic.correct;
    });
  });

  // Calculate accuracy and sort by weakness
  Object.values(topicPerformance).forEach(topic => {
    if (topic.attempted > 0) {
      topic.accuracy = (topic.correct / topic.attempted) * 100;
    }
  });

  const weakTopics = Object.values(topicPerformance)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 10);

  res.json({
    success: true,
    message: 'Topic weakness fetched successfully',
    data: weakTopics,
  });
});

/**
 * Get Monthly Progress
 */
export const getMonthlyProgress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { months = 6 } = req.query;

  const monthlyData = {};

  for (let i = parseInt(months) - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[yearMonth] = {
      totalTests: 0,
      averageScore: 0,
      averageAccuracy: 0,
    };
  }

  const results = await Result.find({ userId }).sort({ submittedAt: 1 });

  results.forEach(result => {
    const date = result.submittedAt;
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (monthlyData[yearMonth]) {
      monthlyData[yearMonth].totalTests += 1;
      monthlyData[yearMonth].averageScore += result.score;
      monthlyData[yearMonth].averageAccuracy += result.accuracy;
    }
  });

  // Calculate averages
  Object.values(monthlyData).forEach(data => {
    if (data.totalTests > 0) {
      data.averageScore = (data.averageScore / data.totalTests).toFixed(2);
      data.averageAccuracy = (data.averageAccuracy / data.totalTests).toFixed(2);
    }
  });

  res.json({
    success: true,
    message: 'Monthly progress fetched successfully',
    data: monthlyData,
  });
});

/**
 * Get Test History
 */
export const getTestHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const results = await Result.find({ userId })
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ submittedAt: -1 })
    .populate('testId', 'title duration');

  const total = await Result.countDocuments({ userId });

  res.json({
    success: true,
    message: 'Test history fetched successfully',
    data: {
      results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

export default {
  getUserPerformance,
  getAccuracyTrend,
  getSubjectPerformance,
  getTopicWeakness,
  getMonthlyProgress,
  getTestHistory,
};
