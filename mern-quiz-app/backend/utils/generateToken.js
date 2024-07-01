// backend/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ user: { id: user._id, email: user.email } }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

module.exports = generateToken;
