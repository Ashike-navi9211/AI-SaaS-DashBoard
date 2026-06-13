const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // stored as "2025-06-13"
      required: true,
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    requestCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index: one record per user per day
usageSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Usage', usageSchema);
