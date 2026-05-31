import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getDailyLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getOverallLeaderboard,
  getUserRank,
} from '../controllers/leaderboardController.js';
import { asyncHandler } from '../utils/errors.js';

const router = express.Router();

/**
 * Public Routes
 */
router.get('/daily', asyncHandler(getDailyLeaderboard));

router.get('/weekly', asyncHandler(getWeeklyLeaderboard));

router.get('/monthly', asyncHandler(getMonthlyLeaderboard));

router.get('/overall', asyncHandler(getOverallLeaderboard));

/**
 * Protected Routes
 */
router.get('/my-rank', authMiddleware, asyncHandler(getUserRank));

export default router;
