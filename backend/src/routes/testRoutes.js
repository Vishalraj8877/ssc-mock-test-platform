import express from 'express';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';
import {
  getAllTests,
  getTest,
  createTest,
  updateTest,
  deleteTest,
  generateRandomTest,
  generateTopicWiseTest,
  getTestsByType,
} from '../controllers/testController.js';
import { testValidationRules, handleValidationErrors } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../utils/errors.js';

const router = express.Router();

/**
 * Public Routes
 */
router.get('/', asyncHandler(getAllTests));
router.get('/:id', asyncHandler(getTest));
router.get('/type/:testType', asyncHandler(getTestsByType));

/**
 * Test Generation Routes
 */
router.post('/generate/random', authMiddleware, asyncHandler(generateRandomTest));
router.post('/generate/topic-wise', authMiddleware, asyncHandler(generateTopicWiseTest));

/**
 * Admin Routes
 */
router.post(
  '/',
  authMiddleware,
  authorize('Admin', 'SuperAdmin'),
  testValidationRules(),
  handleValidationErrors,
  asyncHandler(createTest)
);

router.put(
  '/:id',
  authMiddleware,
  authorize('Admin', 'SuperAdmin'),
  asyncHandler(updateTest)
);

router.delete(
  '/:id',
  authMiddleware,
  authorize('Admin', 'SuperAdmin'),
  asyncHandler(deleteTest)
);

export default router;
