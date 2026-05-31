import mongoose from 'mongoose';

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Test title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      required: [true, 'Test duration is required'],
      min: 1,
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Total questions is required'],
      min: 1,
    },
    testType: {
      type: String,
      enum: ['Random', 'TopicWise', 'SubjectWise', 'FullLength', 'PreviousYear'],
      required: true,
    },
    subject: {
      type: String,
      enum: [
        'Quantitative Aptitude',
        'Reasoning',
        'English',
        'General Awareness',
        null,
      ],
      default: null,
    },
    topic: {
      type: String,
      default: null,
    },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    }],
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
      default: 'Mixed',
    },
    passingScore: {
      type: Number,
      default: 40,
      min: 0,
      max: 100,
    },
    negativeMark: {
      type: Number,
      default: -0.25,
    },
    positiveMarks: {
      type: Number,
      default: 1,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    totalAttempts: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    averageAccuracy: {
      type: Number,
      default: 0,
    },
    averageTimeSpent: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    instructions: {
      type: String,
      default: '',
    },
    instructions_hindi: {
      type: String,
      default: '',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    year: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes
testSchema.index({ title: 1 });
testSchema.index({ testType: 1 });
testSchema.index({ createdAt: -1 });
testSchema.index({ subject: 1, topic: 1 });
testSchema.index({ isPublished: 1 });

const Test = mongoose.model('Test', testSchema);
export default Test;