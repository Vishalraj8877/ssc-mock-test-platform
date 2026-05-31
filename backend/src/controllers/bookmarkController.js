import Bookmark from '../models/Bookmark.js';
import Question from '../models/Question.js';
import { asyncHandler } from '../utils/errors.js';
import { getPaginationParams, paginationResponse } from '../utils/helpers.js';
import logger from '../utils/logger.js';

/**
 * Get User's Bookmarks
 */
export const getBookmarks = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);
  const { collectionId } = req.query;

  const filter = { userId: req.user.id, isBookmarked: true };
  if (collectionId) filter.collectionId = collectionId;

  const bookmarks = await Bookmark.find(filter)
    .limit(limit)
    .skip(skip)
    .populate('questionId')
    .sort({ createdAt: -1 });

  const total = await Bookmark.countDocuments(filter);

  res.json({
    success: true,
    message: 'Bookmarks fetched successfully',
    data: paginationResponse(bookmarks, page, limit, total),
  });
});

/**
 * Create Bookmark
 */
export const createBookmark = asyncHandler(async (req, res) => {
  const { questionId, collectionId } = req.body;

  // Check if question exists
  const question = await Question.findById(questionId);
  if (!question) {
    return res.status(404).json({
      success: false,
      message: 'Question not found',
    });
  }

  // Check if already bookmarked
  const existingBookmark = await Bookmark.findOne({
    userId: req.user.id,
    questionId,
  });

  if (existingBookmark) {
    return res.status(409).json({
      success: false,
      message: 'Question already bookmarked',
    });
  }

  const bookmark = new Bookmark({
    userId: req.user.id,
    questionId,
    collectionId,
  });

  await bookmark.save();

  logger.info(`Bookmark created: User=${req.user.id}, Question=${questionId}`);

  res.status(201).json({
    success: true,
    message: 'Question bookmarked successfully',
    data: bookmark,
  });
});

/**
 * Remove Bookmark
 */
export const removeBookmark = asyncHandler(async (req, res) => {
  const { bookmarkId } = req.params;

  const bookmark = await Bookmark.findOneAndUpdate(
    {
      _id: bookmarkId,
      userId: req.user.id,
    },
    { isBookmarked: false },
    { new: true }
  );

  if (!bookmark) {
    return res.status(404).json({
      success: false,
      message: 'Bookmark not found',
    });
  }

  logger.info(`Bookmark removed: ${bookmarkId}`);

  res.json({
    success: true,
    message: 'Bookmark removed successfully',
  });
});

/**
 * Get Bookmark Statistics
 */
export const getBookmarkStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const totalBookmarks = await Bookmark.countDocuments({
    userId,
    isBookmarked: true,
  });

  const bookmarksByDifficulty = await Bookmark.aggregate([
    {
      $match: {
        userId: req.user.id,
        isBookmarked: true,
      },
    },
    {
      $lookup: {
        from: 'questions',
        localField: 'questionId',
        foreignField: '_id',
        as: 'question',
      },
    },
    {
      $unwind: '$question',
    },
    {
      $group: {
        _id: '$question.difficultyLevel',
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    success: true,
    message: 'Bookmark statistics fetched successfully',
    data: {
      totalBookmarks,
      byDifficulty: bookmarksByDifficulty,
    },
  });
});

export default {
  getBookmarks,
  createBookmark,
  removeBookmark,
  getBookmarkStats,
};
