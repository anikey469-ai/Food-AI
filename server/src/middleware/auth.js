const jwt = require('jsonwebtoken');
module.exports = function auth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'Sign in to continue.' });
  try { req.userId = jwt.verify(token, process.env.JWT_SECRET).sub; next(); }
  catch { return res.status(401).json({ message: 'Session expired. Please sign in again.' }); }
};
