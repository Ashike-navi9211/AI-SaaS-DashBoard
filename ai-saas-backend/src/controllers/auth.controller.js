const User = require('../models/User.model');
const { signToken } = require('../utils/jwt.utils');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    return res.status(201).json({
      success: true,
      data: { token, user: { id: user._id, name: user.name, email: user.email, plan: user.plan } },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    return res.status(200).json({
      success: true,
      data: { token, user: { id: user._id, name: user.name, email: user.email, plan: user.plan } },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: { user: { id: req.user._id, name: req.user.name, email: req.user.email, plan: req.user.plan } },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getMe };
