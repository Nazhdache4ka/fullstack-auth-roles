const postService = require('./post-service');

class PostController {
  async createPost(req, res) {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' });
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      return res.status(400).json({ message: 'title and content cannot be empty' });
    }

    try {
      const post = await postService.createPost(req.body);
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create post', message: err.message });
    }
  }

  async getAllPosts(req, res) {
    try {
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset) || 0;
      const rows = await postService.getAllPosts(limit, offset);

      if (rows.length === 0) return res.status(404).json({ error: 'No posts available' });

      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get posts', message: err.message });
    }
  }

  async getPostById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }
    try {
      const post = await postService.getPostById(id);

      if (!post) return res.status(404).json({ error: 'Post not found' });

      res.json(post);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get post', message: err.message });
    }
  }

  async updatePost(req, res) {
    const post = req.body;
    try {
      const updatedPost = await postService.updatePost(post.id, post);
      res.json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update post', message: err.message });
    }
  }

  async deletePost(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }
    try {
      const deletedPost = await postService.deletePost(id);

      if (!deletedPost) return res.status(404).json({ error: 'Post not found' });

      res.json(deletedPost);
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete post', message: err.message });
    }
  }
}

module.exports = new PostController();
