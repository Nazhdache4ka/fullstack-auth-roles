const express = require('express');
const postController = require('./post-controller');
const commentController = require('../comment/comment-controller');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

router.get('/posts', authMiddleware, postController.getAllPosts);

router.get('/posts/:id', authMiddleware, postController.getPostById);

router.post('/posts', authMiddleware, postController.createPost);

router.put('/posts', authMiddleware, postController.updatePost);

router.delete('/posts/:id', authMiddleware, postController.deletePost);

router.post('/posts/:postId/comment', authMiddleware, commentController.createComment);

router.get('/posts/:postId/comments', authMiddleware, commentController.fetchCommentsByPostId);

router.put('/posts/:postId/comments', authMiddleware, commentController.editComment);

router.delete('/posts/:postId/comments/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;
