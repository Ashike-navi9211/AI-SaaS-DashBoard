const Usage = require('../models/Usage.model');

const checkDailyLimit = async (req, res, next) => {
  try {
    const DAILY_LIMIT = parseInt(process.env.DAILY_TOKEN_LIMIT) || 10000;
    const today = new Date().toISOString().split('T')[0]; // "2025-06-13"

    const usage = await Usage.findOne({
      userId: req.user._id,
      date: today,
    });

    const tokensToday = usage ? usage.tokensUsed : 0;

    if (tokensToday >= DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        message: `Daily limit of ${DAILY_LIMIT} tokens reached. Resets tomorrow.`,
        tokensUsed: tokensToday,
        limit: DAILY_LIMIT,
      });
    }

    // Attach for use in controller
    req.tokensToday = tokensToday;
    req.dailyLimit = DAILY_LIMIT;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { checkDailyLimit };
