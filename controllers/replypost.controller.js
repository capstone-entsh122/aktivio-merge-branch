// controllers/replypost.controller.js
const formatResponse = require('../helpers/responseFormatter');
const ReplyPostModel = require('../models/replyPostModel');

class ReplyPostController {
  // Create a new reply post
  async createReplyPost(req, res) {
    try {
      const replyPosts = await ReplyPostModel.replyPost(req.body);
      res.status(201).json(formatResponse('Reply post created successfully', null, replyPosts));
    } catch (error) {
      res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
  }

  // Get a reply post by ID
  async getReplyPostById(req, res) {
    try {
      const replyPosts = await ReplyPostModel.getReplyPostById(req.params.id);
      if (!replyPosts) {
        return res.status(404).send(formatResponse('Reply post not found'));
      }
      res.status(200).json(formatResponse('Success', null, replyPosts));
    } catch (error) {
      res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
  }

  // Update a reply post by ID
  async updateReplyPostById(req, res) {
    try {
      await ReplyPostModel.updateReplyPostById(req.params.id, req.body);
      res.status(200).json(formatResponse('Reply post updated successfully'));
    } catch (error) {
      res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
  }

  // Delete a reply post by ID
  async deleteReplyPostById(req, res) {
    try {
      await ReplyPostModel.deleteReplyPostById(req.params.id);
      res.status(200).json(formatResponse('Reply post deleted successfully'));
    } catch (error) {
      res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
  }

  // List all reply posts for a specific post
  async listReplyPostsByPost(req, res) {
    try {
      const replyPosts = await ReplyPostModel.listReplyPostsByPost(req.params.postId);
      res.status(200).json(formatResponse('Success', null, replyPosts));
    } catch (error) {
      res.status(500).json(formatResponse('Internal Server Error', error.message));
    }
  }
}

module.exports = new ReplyPostController();
