const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // faster queries by user
    },
    tool: {
      type: String,
      enum: ['generate', 'summarize', 'explain'],
      required: true,
    },
    prompt: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    response: {
      type: String,
      required: true,
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prompt', promptSchema);
