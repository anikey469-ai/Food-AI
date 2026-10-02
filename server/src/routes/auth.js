const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const makeToken = user => jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    if (await User.exists({ email: email.toLowerCase().trim() })) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name: name.trim(), email, passwordHash: await bcrypt.hash(password, 12) });
    return res.status(201).json({ token: makeToken(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});
router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: String(req.body.email || '').toLowerCase().trim() });
    if (!user || !await bcrypt.compare(String(req.body.password || ''), user.passwordHash)) return res.status(401).json({ message: 'Email or password is incorrect.' });
    return res.json({ token: makeToken(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});
module.exports = router;
