import express from 'express';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';
import {
  submitTestResult,
  getUserResults,
  getResult,
  getTestResults,
  getTestAnalytics,
} from '../controllers/resultController.js';
import { asyncHandler } from '../utils/errors.js';

const router = express.Router();

/**
 * Protected Routes
 */
router.post('/', authMiddleware, asyncHandler(submitTestResult));

router.get('/my-results', authMiddleware, asyncHandler(getUserResults));

router.get('/:resultId', authMiddleware, asyncHandler(getResult));

/**
 * Admin Routes
 */
router.get('/test/:testId/results', authMiddleware, authorize('Admin', 'SuperAdmin'), asyncHandler(getTestResults));

router.get('/test/:testId/analytics', authMiddleware, authorize('Admin', 'SuperAdmin'), asyncHandler(getTestAnalytics));

export default router;
