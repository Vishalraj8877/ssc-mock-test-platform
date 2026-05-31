import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getBookmarks,
  createBookmark,
  removeBookmark,
  getBookmarkStats,
} from '../controllers/bookmarkController.js';
import { asyncHandler } from '../utils/errors.js';

const router = express.Router();

/**
 * Protected Routes
 */
router.get('/', authMiddleware, asyncHandler(getBookmarks));

router.post('/', authMiddleware, asyncHandler(createBookmark));

router.delete('/:bookmarkId', authMiddleware, asyncHandler(removeBookmark));

router.get('/stats', authMiddleware, asyncHandler(getBookmarkStats));

export default router;
