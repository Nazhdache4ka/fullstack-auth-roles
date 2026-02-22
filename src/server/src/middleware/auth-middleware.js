const tokenService = require('../token/token-service');

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const accessToken = authorizationHeader.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const tokenData = tokenService.validateAccessToken(accessToken);

    if (!tokenData) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = tokenData;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};
