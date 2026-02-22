const authService = require('./auth-service');
const { validationResult } = require('express-validator');

const MAX_AGE = 30 * 24 * 60 * 60 * 1000;

class AuthController {
  async register(req, res) {
    const { username, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation error', errors: errors.array() });
    }

    try {
      const userData = await authService.register(username, password, ipAddress, userAgent);

      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: MAX_AGE,
      });

      return res.json(userData);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    try {
      const userData = await authService.login(username, password, ipAddress, userAgent);

      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: MAX_AGE,
      });

      return res.json(userData);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async logout(req, res) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await authService.logout(refreshToken);

    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out' });
  }

  async refresh(req, res) {
    const { refreshToken } = req.cookies;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const userData = await authService.refresh(refreshToken, ipAddress, userAgent);

      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: MAX_AGE,
      });

      return res.json(userData);
    } catch (err) {
      return res.status(401).json({ message: err.message || 'Unauthorized' });
    }
  }
}

module.exports = new AuthController();
