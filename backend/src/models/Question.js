import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    optionA: {
      type: String,
      required: [true, 'Option A is required'],
      trim: true,
    },
    optionB: {
      type: String,
      required: [true, 'Option B is required'],
      trim: true,
    },
    optionC: {
      type: String,
      required: [true, 'Option C is required'],
      trim: true,
    },
    optionD: {
      type: String,
      required: [true, 'Option D is required'],
      trim: true,
    },
    correctAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: [true, 'Correct answer is required'],
    },
    explanation: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: [
        'Quantitative Aptitude',
        'Reasoning',
        'English',
        'General Awareness',
      ],
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
    },
    subtopic: {
      type: String,
      default: null,
    },
    difficultyLevel: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    language: {
      type: String,
      enum: ['English', 'Hindi', 'Mixed'],
      default: 'English',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    timesAttempted: {
      type: Number,
      default: 0,
    },
    timesCorrect: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    averageTimeSpent: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    imageDescription: {
      type: String,
      default: null,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    sourceTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      default: null,
    },
    sourceYear: {
      type: Number,
      default: null,
    },
    searchText: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Indexes
questionSchema.index({ subject: 1, topic: 1 });
questionSchema.index({ difficultyLevel: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ searchText: 'text' });
questionSchema.index({ isPublished: 1 });

const Question = mongoose.model('Question', questionSchema);
export default Question;