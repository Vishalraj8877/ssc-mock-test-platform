import express from 'express';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';
import {
  getAllQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  searchQuestions,
  getQuestionsBySubject,
  getQuestionsByTopic,
} from '../controllers/questionController.js';
import { questionValidationRules, handleValidationErrors } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../utils/errors.js';

const router = express.Router();

/**
 * Public Routes
 */
router.get('/', asyncHandler(getAllQuestions));
router.get('/search', asyncHandler(searchQuestions));
router.get('/subject/:subject', asyncHandler(getQuestionsBySubject));
router.get('/subject/:subject/topic/:topic', asyncHandler(getQuestionsByTopic));
router.get('/:id', asyncHandler(getQuestion));

/**
 * Admin Routes
 */
router.post(
  '/',
  authMiddleware,
  authorize('Admin', 'SuperAdmin'),
  questionValidationRules(),
  handleValidationErrors,
  asyncHandler(createQuestion)
);

router.put(
  '/:id',
  authMiddleware,
  authorize('Admin', 'SuperAdmin'),
  asyncHandler(updateQuestion)
);

router.delete(
  '/:id',
  authMiddleware,
  authorize('Admin', 'SuperAdmin'),
  asyncHandler(deleteQuestion)
);

export default router;
