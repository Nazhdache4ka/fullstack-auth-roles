const { pool } = require('../../db');
const jwt = require('jsonwebtoken');

const MAX_USER_AGENT_LENGTH = 255;

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId, refreshToken, ipAddress, userAgent) {
    let conn;

    const ua =
      typeof userAgent === 'string' && userAgent.length > MAX_USER_AGENT_LENGTH
        ? userAgent.slice(0, MAX_USER_AGENT_LENGTH)
        : (userAgent ?? '');

    try {
      conn = await pool.getConnection();
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const existingToken = await conn.query(
        'SELECT * FROM refresh_token WHERE user_id = ? AND ip = ? AND user_agent = ?',
        [userId, ipAddress, ua]
      );

      if (existingToken.length > 0) {
        const createdAt = new Date(Date.now());
        await conn.query(
          'UPDATE refresh_token SET token = ?, expires_at = ?, created_at = ? WHERE user_id = ? AND ip = ? AND user_agent = ?',
          [refreshToken, expires, createdAt, userId, ipAddress, ua]
        );
        return;
      }

      await conn.query(
        'INSERT INTO refresh_token (user_id, token, ip, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
        [userId, refreshToken, ipAddress, ua, expires]
      );
    } catch (err) {
      throw new Error(`Failed to save refresh token: ${err.message}`);
    } finally {
      if (conn) conn.release();
    }
  }

  async removeRefreshToken(refreshToken) {
    let conn;

    try {
      conn = await pool.getConnection();
      await conn.query('DELETE FROM refresh_token WHERE token = ?', [refreshToken]);
      return true;
    } catch (err) {
      throw new Error(`Failed to remove refresh token: ${err.message}`);
    } finally {
      if (conn) conn.release();
    }
  }

  validateAccessToken(accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return decoded;
    } catch {
      return null;
    }
  }

  async validateRefreshToken(refreshToken) {
    let conn;
    try {
      conn = await pool.getConnection();

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const refreshTokenData = await conn.query('SELECT * FROM refresh_token WHERE token = ?', [refreshToken]);
      if (refreshTokenData.length === 0) {
        return null;
      }
      const isExpired = new Date() > new Date(refreshTokenData[0].expires_at);
      if (isExpired) {
        return null;
      }

      return decoded;
    } catch {
      return null;
    } finally {
      if (conn) conn.release();
    }
  }

  async findRefreshToken(refreshToken) {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM refresh_token WHERE token = ?', [refreshToken]);
      if (result.length === 0) {
        return null;
      }
      return result[0];
    } catch (err) {
      throw new Error(`Failed to find refresh token: ${err.message}`);
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = new TokenService();
