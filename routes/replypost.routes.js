const express = require('express');
const ReplyPostController = require('../controllers/replypost.controller');
const router = express.Router();

// Create a new reply post
router.post('/', ReplyPostController.createReplyPost);

// Get a reply post by ID
router.get('/:id', ReplyPostController.getReplyPostById);

// Update a reply post by ID
router.put('/:id', ReplyPostController.updateReplyPostById);

// Delete a reply post by ID
router.delete('/:id', ReplyPostController.deleteReplyPostById);

// List all reply posts for a specific post
router.get('/posts/:postId', ReplyPostController.listReplyPostsByPost);

module.exports = router;
