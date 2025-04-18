const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Extract token from header
    token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, invalid token format' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database, excluding password
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token expired' });
    }
    res.status(401).json({ message: 'Not authorized, token verification failed' });
  }
};

module.exports = { protect };