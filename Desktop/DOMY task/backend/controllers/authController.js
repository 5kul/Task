const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function signToken(id){
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
}
function userSafe(u){
  return { id: u._id, username: u.username, email: u.email, bookmarks: u.bookmarks || [] };
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    if (typeof password !== 'string' || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email' });
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) return res.status(400).json({ message: 'User exists' });
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ username, email, password: hashed });
    const token = signToken(user._id);
    res.json({ token, user: userSafe(user) });
  } catch (err) {
    console.error('register error:', err);
    const message = err?.code === 11000 ? 'User already exists' : (err?.message || 'Registration failed');
    const status = err?.code === 11000 ? 400 : 500;
    res.status(status).json({ message });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] }).populate('bookmarks');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken(user._id);
    res.json({ token, user: userSafe(user) });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: err?.message || 'Login failed' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(userSafe(user));
  } catch (err) {
    console.error('me error:', err);
    res.status(500).json({ message: err?.message || 'Failed to load profile' });
  }
};
