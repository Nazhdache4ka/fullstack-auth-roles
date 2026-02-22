const { pool } = require('../../db');

class PostService {
  async createPost(post) {
    if (!post) {
      throw new Error('post is required');
    }

    let conn;

    try {
      conn = await pool.getConnection();
      const result = await conn.query('INSERT INTO post (author, title, content) VALUES (?, ?, ?)', [
        post.author,
        post.title,
        post.content,
      ]);
      const createdPost = await conn.query('SELECT * FROM post WHERE id = ?', [result.insertId]);
      return createdPost[0];
    } catch (err) {
      throw new Error(`Failed to create post: ${err.message}`);
    } finally {
      if (conn) conn.release();
    }
  }

  async getAllPosts(limit, offset) {
    let conn;

    try {
      conn = await pool.getConnection();
      const posts = await conn.query('SELECT * FROM post ORDER BY id LIMIT ? OFFSET ?', [limit, offset]);
      if (posts.length === 0) return [];
      return posts;
    } catch (err) {
      throw new Error(`Failed to get all posts: ${err.message}`);
    } finally {
      if (conn) conn.release();
    }
  }

  async getPostById(id) {
    if (!id) {
      throw new Error('id is required');
    }

    let conn;

    try {
      conn = await pool.getConnection();
      const post = await conn.query('SELECT * FROM post WHERE id = ?', [id]);

      if (post.length === 0) return null;

      return post[0];
    } catch (err) {
      throw new Error(`Failed to get post by id: ${err.message}`);
    } finally {
      if (conn) conn.release();
    }
  }

  async updatePost(id, post) {
    if (!id || !post) {
      throw new Error('id and post are required');
    }

    let conn;

    try {
      conn = await pool.getConnection();
      const existingPosts = await conn.query('SELECT * FROM post WHERE id = ?', [id]);
      if (existingPosts.length === 0) {
        throw new Error('Post not found');
      }
      await conn.query('update post set author = ?, title = ?, content = ? where id = ?', [
        post.author,
        post.title,
        post.content,
        id,
      ]);
      const updatedPost = await conn.query('SELECT * FROM post WHERE id = ?', [id]);
      return updatedPost[0];
    } catch (err) {
      throw new Error(`Failed to update post: ${err.message}`);
    } finally {
      if (conn) conn.release();
    }
  }

  async deletePost(id) {
    if (!id) {
      throw new Error('id is required');
    }

    let conn;

    try {
      conn = await pool.getConnection();
      const existingPost = await conn.query('SELECT * FROM post WHERE id = ?', [id]);
      if (existingPost.length === 0) {
        throw new Error('Post not found');
      }
      await conn.query('DELETE FROM post WHERE id = ?', [id]);
      return existingPost[0];
    } catch (err) {
      throw new Error(`Failed to delete post: ${err.message}`);
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = new PostService();
