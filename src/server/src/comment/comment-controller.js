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

  async editComment(req, res) {
    const { commentId, content } = req.body;
    const userId = req.user?.id;

    if (!commentId || !content || content.trim().length === 0) {
      return res.status(400).json({ error: 'commentId and content are required' });
    }

    try {
      const updatedComment = await commentService.editComment(commentId, content, userId);
      res.status(200).json(updatedComment);
    } catch (err) {
      if (err.message === 'Forbidden') {
        return res.status(403).json({ message: 'You can only edit your own comment' });
      }
      if (err.message === 'Comment not found') {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ error: 'Failed to edit comment', message: err.message });
    }
  }

  async deleteComment(req, res) {
    const { postId, commentId } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!commentId || !userId || !postId) {
      return res.status(400).json({ message: 'commentId is required' });
    }

    try {
      await commentService.deleteComment(commentId, userId, isAdmin);
      res.status(200).json({ message: 'Comment deleted' });
    } catch (err) {
      if (err.message === 'Forbidden') {
        return res.status(403).json({ message: 'You can only delete your own comment' });
      }
      if (err.message === 'Comment not found') {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ error: 'Failed to delete comment', message: err.message });
    }
  }
}

module.exports = new CommentController();
