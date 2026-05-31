import Question from '../models/Question.js';
import { asyncHandler } from '../utils/errors.js';
import { getPaginationParams, paginationResponse } from '../utils/helpers.js';
import logger from '../utils/logger.js';

/**
 * Get All Questions
 */
export const getAllQuestions = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);
  const { subject, topic, difficulty, language } = req.query;

  const filter = { isPublished: true, isDeleted: false };

  if (subject) filter.subject = subject;
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficultyLevel = difficulty;
  if (language) filter.language = language;

  const questions = await Question.find(filter)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Question.countDocuments(filter);

  res.json({
    success: true,
    message: 'Questions fetched successfully',
    data: paginationResponse(questions, page, limit, total),
  });
});

/**
 * Get Single Question
 */
export const getQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found',
    });
  }

  res.json({
    success: true,
    message: 'Question fetched successfully',
    data: question,
  });
});

/**
 * Create Question (Admin Only)
 */
export const createQuestion = asyncHandler(async (req, res) => {
  const { questionText, optionA, optionB, optionC, optionD, correctAnswer, explanation, subject, topic, difficultyLevel, language, tags } = req.body;

  const question = new Question({
    questionText,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    explanation,
    subject,
    topic,
    difficultyLevel,
    language,
    tags,
    createdBy: req.user.id,
  });

  await question.save();

  logger.info(`Question created: ${question._id}`);

  res.status(201).json({
    success: true,
    message: 'Question created successfully',
    data: question,
  });
});

/**
 * Update Question (Admin Only)
 */
export const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found',
    });
  }

  logger.info(`Question updated: ${question._id}`);

  res.json({
    success: true,
    message: 'Question updated successfully',
    data: question,
  });
});

/**
 * Delete Question (Admin Only)
 */
export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found',
    });
  }

  logger.info(`Question deleted: ${question._id}`);

  res.json({
    success: true,
    message: 'Question deleted successfully',
  });
});

/**
 * Search Questions
 */
export const searchQuestions = asyncHandler(async (req, res) => {
  const { q, subject, topic, difficulty } = req.query;
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);

  const filter = { isPublished: true, isDeleted: false };

  if (q) {
    filter.$text = { $search: q };
  }
  if (subject) filter.subject = subject;
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficultyLevel = difficulty;

  const questions = await Question.find(filter)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Question.countDocuments(filter);

  res.json({
    success: true,
    message: 'Questions fetched successfully',
    data: paginationResponse(questions, page, limit, total),
  });
});

/**
 * Get Questions by Subject
 */
export const getQuestionsBySubject = asyncHandler(async (req, res) => {
  const { subject } = req.params;
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);

  const questions = await Question.find({
    subject,
    isPublished: true,
    isDeleted: false,
  })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Question.countDocuments({
    subject,
    isPublished: true,
    isDeleted: false,
  });

  res.json({
    success: true,
    message: 'Questions fetched successfully',
    data: paginationResponse(questions, page, limit, total),
  });
});

/**
 * Get Questions by Topic
 */
export const getQuestionsByTopic = asyncHandler(async (req, res) => {
  const { subject, topic } = req.params;
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);

  const questions = await Question.find({
    subject,
    topic,
    isPublished: true,
    isDeleted: false,
  })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Question.countDocuments({
    subject,
    topic,
    isPublished: true,
    isDeleted: false,
  });

  res.json({
    success: true,
    message: 'Questions fetched successfully',
    data: paginationResponse(questions, page, limit, total),
  });
});

export default {
  getAllQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  searchQuestions,
  getQuestionsBySubject,
  getQuestionsByTopic,
};
