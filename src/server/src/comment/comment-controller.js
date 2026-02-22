const commentService = require('./comment-service');

class CommentController {
  async createComment(req, res) {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!postId || !userId || !content) {
      return res.status(400).json({ message: 'postId, userId and content are required' });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ message: 'content cannot be empty' });
    }

    try {
      const comment = await commentService.createComment(postId, userId, content);
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create comment', message: err.message });
    }
  }

  async fetchCommentsByPostId(req, res) {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ error: 'postId is required' });
    }

    try {
      const comments = await commentService.fetchCommentsByPostId(postId);
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch comments by postId', message: err.message });
    }
  }
}

module.exports = new CommentController();
