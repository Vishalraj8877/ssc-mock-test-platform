import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    collectionName: {
      type: String,
      default: 'Default',
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      default: null,
    },
    isBookmarked: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: '',
    },
    preferredDifficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', null],
      default: null,
    },
    lastReviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Unique constraint
bookmarkSchema.index({ userId: 1, questionId: 1 }, { unique: true });
bookmarkSchema.index({ userId: 1, collectionId: 1 });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export default Bookmark;