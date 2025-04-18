// backend/utils/tokens.js
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = { generateToken };