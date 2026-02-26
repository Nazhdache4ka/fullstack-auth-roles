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
        `SELECT comment.id, comment.post_id, comment.user_id, user.username, comment.content, comment.is_edited, role.role_name AS role 
        FROM comment 
        JOIN user ON comment.user_id = user.id 
        JOIN role ON user.role_id = role.id
        WHERE comment.post_id = ?
        GROUP BY comment.id`,
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

  async editComment(commentId, content, userId) {
    if (!commentId || !content || !userId) {
      throw new Error('commentId, content and userId are required');
    }

    let conn;

    try {
      conn = await pool.getConnection();
      const existingComment = await conn.query('SELECT * FROM comment WHERE id = ?', [commentId]);
      if (existingComment.length === 0) {
        throw new Error('Comment not found');
      }
      if (existingComment[0].user_id !== userId) {
        throw new Error('Forbidden');
      }
      await conn.query('UPDATE comment SET content = ?, is_edited = 1 WHERE id = ?', [content, commentId]);
      const updatedComment = await conn.query('SELECT * FROM comment WHERE id = ?', [commentId]);
      return updatedComment[0];
    } catch (err) {
      throw new Error(`Failed to edit comment: ${err.message}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }

  async deleteComment(commentId, userId, isAdmin) {
    if (!commentId || !userId) {
      throw new Error('commentId and userId are required');
    }

    let conn;

    try {
      conn = await pool.getConnection();
      const existingComment = await conn.query('SELECT * FROM comment WHERE id = ?', [commentId]);
      if (existingComment.length === 0) {
        throw new Error('Comment not found');
      }
      const isAuthor = existingComment[0].user_id === userId;
      if (!isAuthor && !isAdmin) {
        throw new Error('Forbidden');
      }
      await conn.query('DELETE FROM comment WHERE id = ?', [commentId]);
      return true;
    } catch (err) {
      throw new Error(`Failed to delete comment: ${err.message}`);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
}

module.exports = new CommentService();
