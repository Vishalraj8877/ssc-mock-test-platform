import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    answers: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
      userAnswer: {
        type: String,
        enum: ['A', 'B', 'C', 'D', null],
        default: null,
      },
      isCorrect: {
        type: Boolean,
        default: false,
      },
      marksObtained: {
        type: Number,
        default: 0,
      },
      timeSpent: {
        type: Number,
        default: 0,
      },
      isMarkedForReview: {
        type: Boolean,
        default: false,
      },
    }],
    totalMarks: {
      type: Number,
      default: 0,
    },
    marksObtained: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalAttempted: {
      type: Number,
      default: 0,
    },
    totalCorrect: {
      type: Number,
      default: 0,
    },
    totalIncorrect: {
      type: Number,
      default: 0,
    },
    totalUnattempted: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    rank: {
      type: Number,
      default: null,
    },
    percentile: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    subjectAnalysis: [{
      subject: String,
      totalQuestions: Number,
      attempted: Number,
      correct: Number,
      accuracy: Number,
      marksObtained: Number,
    }],
    topicAnalysis: [{
      topic: String,
      totalQuestions: Number,
      attempted: Number,
      correct: Number,
      accuracy: Number,
    }],
    feedback: {
      type: String,
      default: '',
    },
    isReviewPending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes
resultSchema.index({ userId: 1 });
resultSchema.index({ testId: 1 });
resultSchema.index({ userId: 1, createdAt: -1 });
resultSchema.index({ submittedAt: -1 });

const Result = mongoose.model('Result', resultSchema);
export default Result;