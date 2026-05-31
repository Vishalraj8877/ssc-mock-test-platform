import express from 'express';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';
import {
  register,
  login,
  refreshToken,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout,
} from '../controllers/authController.js';
import { authValidationRules, handleValidationErrors } from '../middleware/validationMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';
import { asyncHandler } from '../utils/errors.js';

const router = express.Router();

/**
 * Public Routes
 */
router.post(
  '/register',
  authLimiter,
  authValidationRules(),
  handleValidationErrors,
  asyncHandler(register)
);

router.post(
  '/login',
  authLimiter,
  asyncHandler(login)
);

router.post('/refresh-token', asyncHandler(refreshToken));

/**
 * Protected Routes
 */
router.get('/me', authMiddleware, asyncHandler(getCurrentUser));

router.put('/profile', authMiddleware, asyncHandler(updateProfile));

router.put('/change-password', authMiddleware, asyncHandler(changePassword));

router.post('/logout', authMiddleware, asyncHandler(logout));

export default router;
