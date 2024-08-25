const jwt = require('jsonwebtoken');
const { verifyToken } = require('../constants/utils');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = verifyToken(token)
    req.user = verified;
    next();
  } catch (err) {
    res.redirect('/login');
    res.status(400).send('Invalid Token');
  }
};

module.exports = authMiddleware;
