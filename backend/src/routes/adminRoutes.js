import express from 'express';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserBan,
  getPlatformAnalytics,
} from '../controllers/adminController.js';
import { asyncHandler } from '../utils/errors.js';

const router = express.Router();

/**
 * Admin Only Routes
 */
router.get(
  '/dashboard/stats',
  authMiddleware,
  authorize('Admin', 'SuperAdmin'),
  asyncHandler(getDashboardStats)
);

router.get(
  '/users',
  authMiddleware,
  authorize('Admin', 'SuperAdmin'),
  asyncHandler(getAllUsers)
);

router.put(
  '/users/:userId/role',
  authMiddleware,
  authorize('SuperAdmin'),
  asyncHandler(updateUserRole)
);

router.put(
  '/users/:userId/ban',
  authMiddleware,
  authorize('SuperAdmin'),
  asyncHandler(toggleUserBan)
);

router.get(
  '/analytics',
  authMiddleware,
  authorize('Admin', 'SuperAdmin'),
  asyncHandler(getPlatformAnalytics)
);

export default router;
