const { pool } = require('../../db');
const bcrypt = require('bcrypt');
const tokenService = require('../token/token-service');
const UserDto = require('../user/user-dto');

class AuthService {
  async register(username, password, ipAddress, userAgent) {
    let conn;

    try {
      conn = await pool.getConnection();
      const candidate = await conn.query('SELECT * FROM user WHERE username = ?', [username]);

      if (candidate.length > 0) {
        throw new Error('User already exists');
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const result = await conn.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, hashPassword]);
      const newUser = await conn.query(
        'SELECT username, user.id, role_name AS role FROM user JOIN role ON user.role_id = role.id WHERE user.id = ? GROUP BY user.id',
        [result.insertId]
      );
      const userDto = new UserDto(newUser[0]);
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken, ipAddress, userAgent);
      return { ...tokens, user: userDto };
    } catch (err) {
      throw new Error(`Failed to register: ${err.message}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async login(username, password, ipAddress, userAgent) {
    let conn;

    try {
      conn = await pool.getConnection();
      const user = await conn.query(
        'SELECT username, user.id, password, role_name AS role FROM user JOIN role ON user.role_id = role.id WHERE user.username = ? GROUP BY user.id',
        [username]
      );
      if (user.length === 0) {
        throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user[0].password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      const userDto = new UserDto(user[0]);
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken, ipAddress, userAgent);
      return { ...tokens, user: userDto };
    } catch (err) {
      throw new Error(`Failed to login: ${err.message}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async logout(refreshToken) {
    try {
      const result = await tokenService.removeRefreshToken(refreshToken);
      if (!result) {
        throw new Error('Failed to remove refresh token');
      }
      return result;
    } catch (err) {
      throw new Error(`Failed to logout: ${err.message}`);
    }
  }

  async refresh(refreshToken, ipAddress, userAgent) {
    let conn;
    try {
      conn = await pool.getConnection();
      if (!refreshToken) {
        throw new Error('Unauthorized');
      }
      const tokenData = await tokenService.validateRefreshToken(refreshToken);
      const refreshTokenData = await tokenService.findRefreshToken(refreshToken);
      if (!tokenData || !refreshTokenData) {
        throw new Error('Unauthorized');
      }

      const user = await conn.query(
        'SELECT username, user.id, role_name AS role FROM user JOIN role ON user.role_id = role.id WHERE user.id = ? GROUP BY user.id',
        [refreshTokenData.user_id]
      );
      if (user.length === 0) {
        throw new Error('User not found');
      }
      const userDto = new UserDto(user[0]);
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken, ipAddress, userAgent);
      return { ...tokens, user: userDto };
    } catch (err) {
      throw new Error(`Failed to refresh: ${err.message}`);
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = new AuthService();
