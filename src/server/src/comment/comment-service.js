const { pool } = require('../../db');

class CommentService {
  async createComment(postId, userId, content) {
    if (!postId || !userId || !content) {
      throw new Error('postId, userId and content are required');
    }

    let conn;

    try {
      conn = await pool.getConnection();
      const result = await conn.query('INSERT INTO comment (post_id, user_id, content) VALUES (?, ?, ?)', [
        postId,
        userId,
        content,
      ]);
      const createdComment = await conn.query('SELECT * FROM comment WHERE id = ?', [result.insertId]);
      return createdComment[0];
    } catch (err) {
      throw new Error(`Failed to create comment: ${err.message}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async fetchCommentsByPostId(postId) {
    if (!postId) {
      throw new Error('postId is required');
    }

    let conn;

    try {
      conn = await pool.getConnection();
      const comments = await conn.query(
        'SELECT comment.id, comment.post_id, comment.user_id, user.username, comment.content, comment.is_edited FROM comment JOIN user ON comment.user_id = user.id WHERE comment.post_id = ?',
        [postId]
      );
      return comments;
    } catch (err) {
      throw new Error(`Failed to fetch comments by postId: ${err.message}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

module.exports = new CommentService();
