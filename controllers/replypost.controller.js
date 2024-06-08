// controllers/replypost.controller.js
const ReplyPostModel = require('../models/replyPostModel');

class ReplyPostController {
  // Create a new reply post
  async createReplyPost(req, res) {
    try {
      const replyPosts = await ReplyPostModel.replyPost(req.body);
      res.status(201).send(replyPosts);
    } catch (error) {
      res.status(500).send({ error: 'Failed to create reply post' });
    }
  }

  // Get a reply post by ID
  async getReplyPostById(req, res) {
    try {
      const replyPosts = await ReplyPostModel.getReplyPostById(req.params.id);
      if (!replyPosts) {
        return res.status(404).send({ error: 'Reply post not found' });
      }
      res.status(200).send(replyPosts);
    } catch (error) {
      res.status(500).send({ error: 'Failed to get reply post' });
    }
  }

  // Update a reply post by ID
  async updateReplyPostById(req, res) {
    try {
      await ReplyPostModel.updateReplyPostById(req.params.id, req.body);
      res.status(200).send({ message: 'Reply post updated successfully' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to update reply post' });
    }
  }

  // Delete a reply post by ID
  async deleteReplyPostById(req, res) {
    try {
      await ReplyPostModel.deleteReplyPostById(req.params.id);
      res.status(200).send({ message: 'Reply post deleted successfully' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete reply post' });
    }
  }

  // List all reply posts for a specific post
  async listReplyPostsByPost(req, res) {
    try {
      const replyPosts = await ReplyPostModel.listReplyPostsByPost(req.params.postId);
      res.status(200).send(replyPosts);
    } catch (error) {
      res.status(500).send({ error: 'Failed to list reply posts' });
    }
  }
}

module.exports = new ReplyPostController();
