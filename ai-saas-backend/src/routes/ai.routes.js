const express = require('express');
const router = express.Router();
const { handleAI } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkDailyLimit } = require('../middleware/rateLimit.middleware');

// Both middlewares run before handleAI
router.post('/generate', protect, checkDailyLimit, handleAI);

module.exports = router;
