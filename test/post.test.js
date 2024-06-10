/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app'); // Adjust the path to your Express app
const path = require('path');

describe('Post API', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(done);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/communities/:communityId/posts', () => {
    const communityId = '54cYn7Kedhyy3ESjpmCl';
    const imagePath = path.join(__dirname, './assets/images.jpeg');

    it('should create a new post', async () => {
      const response = await request(app)
        .post(`/api/communities/${communityId}/posts`)
        .field('title', 'Test Post') // Ensure title is provided
        .field('content', 'This is a test post')
        .attach('image', imagePath);

      expect(response.status).toBe(201);
      console.log(response.body);
    });
  });

  describe('GET /api/communities/:communityId/posts/:postId', () => {
    it('should get post details', async () => {
      const postId = 'hBK3EomLgS7wR6ls57h2'; 
      const response = await request(app)
        .get(`/api/communities/54cYn7Kedhyy3ESjpmCl/posts/${postId}`);

      expect(response.status).toBe(200);
      console.log(response.body);
    });
  });

  describe('GET /api/communities/:communityId/posts', () => {
    it('should list posts by community', async () => {
      const response = await request(app)
        .get(`/api/communities/54cYn7Kedhyy3ESjpmCl/posts`);

      expect(response.status).toBe(200);
      console.log(response.body);
    });
  });
});
