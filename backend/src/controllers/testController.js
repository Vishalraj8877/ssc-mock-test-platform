import Test from '../models/Test.js';
import Question from '../models/Question.js';
import { asyncHandler } from '../utils/errors.js';
import { getPaginationParams, paginationResponse } from '../utils/helpers.js';
import logger from '../utils/logger.js';

/**
 * Get All Tests
 */
export const getAllTests = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);
  const { testType, subject, difficulty } = req.query;

  const filter = { isPublished: true, isDeleted: false };

  if (testType) filter.testType = testType;
  if (subject) filter.subject = subject;
  if (difficulty) filter.difficulty = difficulty;

  const tests = await Test.find(filter)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 })
    .populate('createdBy', 'firstName lastName');

  const total = await Test.countDocuments(filter);

  res.json({
    success: true,
    message: 'Tests fetched successfully',
    data: paginationResponse(tests, page, limit, total),
  });
});

/**
 * Get Single Test
 */
export const getTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id)
    .populate('createdBy', 'firstName lastName')
    .populate('questions');

  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found',
    });
  }

  res.json({
    success: true,
    message: 'Test fetched successfully',
    data: test,
  });
});

/**
 * Create Test (Admin Only)
 */
export const createTest = asyncHandler(async (req, res) => {
  const { title, description, duration, totalQuestions, testType, subject, topic, difficulty, passingScore, negativeMark, positiveMarks, questions, instructions } = req.body;

  const test = new Test({
    title,
    description,
    duration,
    totalQuestions,
    testType,
    subject,
    topic,
    difficulty,
    passingScore,
    negativeMark,
    positiveMarks,
    questions,
    instructions,
    createdBy: req.user.id,
  });

  await test.save();

  logger.info(`Test created: ${test._id}`);

  res.status(201).json({
    success: true,
    message: 'Test created successfully',
    data: test,
  });
});

/**
 * Update Test (Admin Only)
 */
export const updateTest = asyncHandler(async (req, res) => {
  const test = await Test.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found',
    });
  }

  logger.info(`Test updated: ${test._id}`);

  res.json({
    success: true,
    message: 'Test updated successfully',
    data: test,
  });
});

/**
 * Delete Test (Admin Only)
 */
export const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found',
    });
  }

  logger.info(`Test deleted: ${test._id}`);

  res.json({
    success: true,
    message: 'Test deleted successfully',
  });
});

/**
 * Generate Random Test
 */
export const generateRandomTest = asyncHandler(async (req, res) => {
  const { totalQuestions, difficulty } = req.body;

  const filter = { isPublished: true, isDeleted: false };
  if (difficulty) filter.difficultyLevel = difficulty;

  const questions = await Question.find(filter)
    .limit(totalQuestions)
    .lean();

  if (questions.length < totalQuestions) {
    return res.status(400).json({
      success: false,
      message: 'Not enough questions available',
    });
  }

  // Shuffle questions
  const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

  res.json({
    success: true,
    message: 'Random test generated successfully',
    data: shuffledQuestions,
  });
});

/**
 * Generate Topic-wise Test
 */
export const generateTopicWiseTest = asyncHandler(async (req, res) => {
  const { subject, topic, totalQuestions } = req.body;

  const questions = await Question.find({
    subject,
    topic,
    isPublished: true,
    isDeleted: false,
  })
    .limit(totalQuestions)
    .lean();

  if (questions.length < totalQuestions) {
    return res.status(400).json({
      success: false,
      message: 'Not enough questions available for this topic',
    });
  }

  res.json({
    success: true,
    message: 'Topic-wise test generated successfully',
    data: questions,
  });
});

/**
 * Get Tests by Type
 */
export const getTestsByType = asyncHandler(async (req, res) => {
  const { testType } = req.params;
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);

  const tests = await Test.find({
    testType,
    isPublished: true,
    isDeleted: false,
  })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Test.countDocuments({
    testType,
    isPublished: true,
    isDeleted: false,
  });

  res.json({
    success: true,
    message: 'Tests fetched successfully',
    data: paginationResponse(tests, page, limit, total),
  });
});

export default {
  getAllTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
  generateRandomTest,
  generateTopicWiseTest,
  getTestsByType,
};
