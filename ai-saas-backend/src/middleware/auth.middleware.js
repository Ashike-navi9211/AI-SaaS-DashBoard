const User = require('../models/User.model');
const { verifyToken } = require('../utils/jwt.utils');

const protect = async (req, res, next) => {
  try {
    // 1. Read token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token — throws if expired or tampered
    const decoded = verifyToken(token);

    // 3. Check user still exists in DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    // 4. Attach user to request — available in all controllers
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = { protect };
