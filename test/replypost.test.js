const ReplyPostModel = require('../models/replypost.model');
const request = require('supertest');
const app = require('../app'); // Adjust the path to your app
const { firestore } = require('../config/firebaseAdmin');
const { mockUserId } = require('../config/testConfig'); // Import the mock user ID



describe('ReplyPostModel', () => {
  // Test createReplyPost method
  describe('createReplyPost', () => {
    it('should create a new reply post', async () => {
      const newReplyPostData = {
        postId: 'postId123',
        content: 'Test reply content',
        author: 'Test Author'
      };
      const createdReplyPost = await ReplyPostModel.replyPosts(newReplyPostData);
      expect(createdReplyPost).toHaveProperty('id');
      expect(createdReplyPost).toHaveProperty('postId', newReplyPostData.postId);
      expect(createdReplyPost).toHaveProperty('content', newReplyPostData.content);
      expect(createdReplyPost).toHaveProperty('author', newReplyPostData.author);
    });
  });

  // Test getReplyPostById
  describe('getReplyPostById', () => {
    it('should return the reply post with the specified ID', async () => {
      const replyPostId = '1XAlwEo3ZFTz9ryHXWDV';
      const replyPosts = await ReplyPostModel.getReplyPostById(replyPostId);
      expect(replyPosts).not.toBeNull();
      expect(replyPosts).toHaveProperty('id', replyPostId);
    });

    it('should return null if the reply post with the specified ID does not exist', async () => {
      const replyPostId = 'nonExistingReplyPostId';
      const replyPosts = await ReplyPostModel.getReplyPostById(replyPostId);
      expect(replyPosts).toBeNull();
    });
  });
});
