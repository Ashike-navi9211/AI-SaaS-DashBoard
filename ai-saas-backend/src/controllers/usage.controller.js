const Usage = require('../models/Usage.model');
const Prompt = require('../models/Prompt.model');
const { sendSuccess } = require('../utils/response.utils');

// Today's usage summary
const getTodayUsage = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const usage = await Usage.findOne({ userId: req.user._id, date: today });

    sendSuccess(res, {
      date: today,
      tokensUsed: usage ? usage.tokensUsed : 0,
      requestCount: usage ? usage.requestCount : 0,
      dailyLimit: parseInt(process.env.DAILY_TOKEN_LIMIT) || 10000,
    });
  } catch (err) {
    next(err);
  }
};

// Last 7 days usage for analytics chart
const getWeeklyUsage = async (req, res, next) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    const records = await Usage.find({
      userId: req.user._id,
      date: { $in: days },
    });

    const data = days.map((day) => {
      const record = records.find((r) => r.date === day);
      return {
        date: day,
        tokensUsed: record ? record.tokensUsed : 0,
        requestCount: record ? record.requestCount : 0,
      };
    });

    sendSuccess(res, { weekly: data });
  } catch (err) {
    next(err);
  }
};

// Prompt history with pagination
const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [prompts, total] = await Promise.all([
      Prompt.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Prompt.countDocuments({ userId: req.user._id }),
    ]);

    sendSuccess(res, {
      prompts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTodayUsage, getWeeklyUsage, getHistory };
