const { pool } = require('../../db');

class UserService {
  async fetchAllUsers(limit, offset) {
    let conn;
    try {
      conn = await pool.getConnection();
      const users = await conn.query('SELECT username, id FROM user ORDER BY id LIMIT ? OFFSET ?', [limit, offset]);
      return users;
    } catch (err) {
      throw new Error(`Failed to fetch all users: ${err.message}`);
    } finally {
      if (conn) conn.release();
    }
  }

  async fetchUsersInfoForAdmin() {
    let conn;

    try {
      conn = await pool.getConnection();
      const users = await conn.query(
        `SELECT u.username, u.id, r.role_name AS role, rt.ip AS ipAddress, rt.user_agent AS userAgent, MAX(rt.created_at) AS lastLoginAt
         FROM user u
         JOIN role r ON u.role_id = r.id
         LEFT JOIN refresh_token rt ON u.id = rt.user_id
         GROUP BY u.id, u.username, r.role_name`
      );
      return users;
    } catch (err) {
      throw new Error(`Failed to fetch users info for admin: ${err.message}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async setUserRole(userId, roleId) {
    let conn;

    try {
      conn = await pool.getConnection();
      const user = await conn.query('SELECT * FROM user WHERE id = ?', [userId]);
      if (user.length === 0) {
        throw new Error('User not found');
      }
      await conn.query('UPDATE user SET role_id = ? WHERE id = ?', [roleId, userId]);
      return;
    } catch (err) {
      throw new Error(`Failed to set user role: ${err.message}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

module.exports = new UserService();
