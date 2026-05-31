import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getUserPerformance,
  getAccuracyTrend,
  getSubjectPerformance,
  getTopicWeakness,
  getMonthlyProgress,
  getTestHistory,
} from '../controllers/analyticsController.js';
import { asyncHandler } from '../utils/errors.js';

const router = express.Router();

/**
 * Protected Routes
 */
router.get('/performance', authMiddleware, asyncHandler(getUserPerformance));

router.get('/accuracy-trend', authMiddleware, asyncHandler(getAccuracyTrend));

router.get('/subject-performance', authMiddleware, asyncHandler(getSubjectPerformance));

router.get('/topic-weakness', authMiddleware, asyncHandler(getTopicWeakness));

router.get('/monthly-progress', authMiddleware, asyncHandler(getMonthlyProgress));

router.get('/test-history', authMiddleware, asyncHandler(getTestHistory));

export default router;
