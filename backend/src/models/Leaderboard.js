import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    dailyScore: {
      type: Number,
      default: 0,
    },
    weeklyScore: {
      type: Number,
      default: 0,
    },
    monthlyScore: {
      type: Number,
      default: 0,
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    dailyRank: {
      type: Number,
      default: null,
    },
    weeklyRank: {
      type: Number,
      default: null,
    },
    monthlyRank: {
      type: Number,
      default: null,
    },
    overallRank: {
      type: Number,
      default: null,
    },
    totalTestsAttempted: {
      type: Number,
      default: 0,
    },
    averageAccuracy: {
      type: Number,
      default: 0,
    },
    averagePercentile: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes
leaderboardSchema.index({ userId: 1 });
leaderboardSchema.index({ dailyRank: 1 });
leaderboardSchema.index({ weeklyRank: 1 });
leaderboardSchema.index({ monthlyRank: 1 });
leaderboardSchema.index({ overallRank: 1 });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
export default Leaderboard;