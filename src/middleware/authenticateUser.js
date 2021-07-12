const { verifyToken } = require('../utils/authToken');

const authenticateUser = (req) => {
  const token = getAuthTokenFromRequest(req);

  return token ? verifyToken(token) : null;
};

const getAuthTokenFromRequest = (req) => {
  const header = req.get('Authorization');

  if (header) {
    const [bearer, token] = header.split(' ');
    return bearer === 'Bearer' && token ? token : null;
  } else {
    return null;
  }
};

module.exports = { authenticateUser };
