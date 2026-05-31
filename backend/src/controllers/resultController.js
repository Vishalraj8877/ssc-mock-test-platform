import Result from '../models/Result.js';
import Test from '../models/Test.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/errors.js';
import { getPaginationParams, paginationResponse } from '../utils/helpers.js';
import { calculateResults, calculatePercentile, calculateRank } from '../utils/testCalculations.js';
import logger from '../utils/logger.js';

/**
 * Submit Test Result
 */
export const submitTestResult = asyncHandler(async (req, res) => {
  const { testId, answers, totalTimeSpent } = req.body;

  // Get test details
  const test = await Test.findById(testId).populate('questions');
  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found',
    });
  }

  // Calculate results
  const calculatedResults = calculateResults(answers, test);

  // Create result document
  const result = new Result({
    userId: req.user.id,
    testId,
    answers,
    totalMarks: calculatedResults.totalMarks,
    marksObtained: calculatedResults.marksObtained,
    score: calculatedResults.score,
    totalAttempted: calculatedResults.totalAttempted,
    totalCorrect: calculatedResults.totalCorrect,
    totalIncorrect: calculatedResults.totalIncorrect,
    totalUnattempted: calculatedResults.totalUnattempted,
    accuracy: calculatedResults.accuracy,
    totalTimeSpent,
    submittedAt: new Date(),
    subjectAnalysis: calculatedResults.subjectAnalysis,
    topicAnalysis: calculatedResults.topicAnalysis,
  });

  await result.save();

  // Calculate rank and percentile
  const percentile = await calculatePercentile(calculatedResults.score, testId, Result);
  const rank = await calculateRank(calculatedResults.score, testId, Result);

  result.percentile = percentile;
  result.rank = rank;
  await result.save();

  // Update test statistics
  test.totalAttempts += 1;
  test.averageScore = (test.averageScore * (test.totalAttempts - 1) + calculatedResults.score) / test.totalAttempts;
  test.averageAccuracy = (test.averageAccuracy * (test.totalAttempts - 1) + calculatedResults.accuracy) / test.totalAttempts;
  test.averageTimeSpent = (test.averageTimeSpent * (test.totalAttempts - 1) + totalTimeSpent) / test.totalAttempts;
  await test.save();

  // Update user statistics
  const user = await User.findById(req.user.id);
  user.totalTestsAttempted += 1;
  user.totalQuestionsAttempted += calculatedResults.totalAttempted;
  user.accuracy = (user.accuracy * (user.totalTestsAttempted - 1) + calculatedResults.accuracy) / user.totalTestsAttempted;
  await user.save();

  logger.info(`Test submitted: User=${req.user.id}, Test=${testId}, Score=${calculatedResults.score}`);

  res.status(201).json({
    success: true,
    message: 'Test result submitted successfully',
    data: {
      resultId: result._id,
      score: result.score,
      accuracy: result.accuracy,
      rank: result.rank,
      percentile: result.percentile,
      totalMarks: result.totalMarks,
      marksObtained: result.marksObtained,
      subjectAnalysis: result.subjectAnalysis,
      topicAnalysis: result.topicAnalysis,
    },
  });
});

/**
 * Get User's Results
 */
export const getUserResults = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);

  const results = await Result.find({ userId: req.user.id })
    .limit(limit)
    .skip(skip)
    .sort({ submittedAt: -1 })
    .populate('testId', 'title duration');

  const total = await Result.countDocuments({ userId: req.user.id });

  res.json({
    success: true,
    message: 'Results fetched successfully',
    data: paginationResponse(results, page, limit, total),
  });
});

/**
 * Get Single Result
 */
export const getResult = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.resultId)
    .populate('userId', 'firstName lastName email')
    .populate('testId', 'title duration')
    .populate('answers.questionId');

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Result not found',
    });
  }

  // Verify user owns this result
  if (result.userId._id.toString() !== req.user.id.toString() && req.user.role === 'Student') {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }

  res.json({
    success: true,
    message: 'Result fetched successfully',
    data: result,
  });
});

/**
 * Get Test Results (Admin Only)
 */
export const getTestResults = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);

  const results = await Result.find({ testId })
    .limit(limit)
    .skip(skip)
    .sort({ submittedAt: -1 })
    .populate('userId', 'firstName lastName email');

  const total = await Result.countDocuments({ testId });

  res.json({
    success: true,
    message: 'Results fetched successfully',
    data: paginationResponse(results, page, limit, total),
  });
});

/**
 * Get Test Analytics
 */
export const getTestAnalytics = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  const results = await Result.find({ testId });

  if (results.length === 0) {
    return res.json({
      success: true,
      message: 'No results found for this test',
      data: null,
    });
  }

  const totalAttempts = results.length;
  const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalAttempts;
  const averageAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / totalAttempts;
  const averageTimeSpent = results.reduce((sum, r) => sum + r.totalTimeSpent, 0) / totalAttempts;

  const subjectAnalysis = {};
  results.forEach(result => {
    result.subjectAnalysis.forEach(subject => {
      if (!subjectAnalysis[subject.subject]) {
        subjectAnalysis[subject.subject] = {
          subject: subject.subject,
          totalQuestions: 0,
          averageAccuracy: 0,
          totalAttempts: 0,
        };
      }
    });
  });

  res.json({
    success: true,
    message: 'Analytics fetched successfully',
    data: {
      totalAttempts,
      averageScore,
      averageAccuracy,
      averageTimeSpent,
      subjectAnalysis: Object.values(subjectAnalysis),
    },
  });
});

export default {
  submitTestResult,
  getUserResults,
  getResult,
  getTestResults,
  getTestAnalytics,
};
