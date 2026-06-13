const express = require('express');
const router = express.Router();
const { getTodayUsage, getWeeklyUsage, getHistory } = require('../controllers/usage.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/today', protect, getTodayUsage);
router.get('/weekly', protect, getWeeklyUsage);
router.get('/history', protect, getHistory);

module.exports = router;
