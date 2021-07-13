const jwt = require('jsonwebtoken');
const { isPlainObject } = require('lodash');

const signToken = (payload, options = {}) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
    ...options,
  });

const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (isPlainObject(payload)) {
      return payload;
    }
  } catch {
    return null;
  }
};

module.exports = { signToken, verifyToken };
