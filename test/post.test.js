// /* eslint-disable no-undef */
// const request = require('supertest');
// const app = require('../app'); // Adjust the path to your Express app
// const PostModel = require('../models/post.model');
// const CommunityModel = require('../models/community.model');
// const UserModel = require('../models/user.model');
// const formatResponse = require('../helpers/responseFormatter');
// const path = require('path');


// jest.mock('../middlewares/authenticate', () => (req, res, next) => {
//   req.user = { uid: 'mockUserId' }; // Mock authenticated user
//   next();
// });

// describe('Post API', () => {
//   let server;

//   beforeAll((done) => {
//     server = app.listen(done);
//   });

//   afterAll((done) => {
//     server.close(done);
//   });

// //   beforeEach(async () => {
// //     // Clear the mock data before each test
// //     await PostModel.deletePostById('testPostId');
// //     await CommunityModel.deleteCommunityById('testCommunityId');
// //     await UserModel.deleteUserById('mockUserId');
// //   });

// describe('POST /api/communities/:communityId/posts', () => {
//     const communityId = 'a9pFT5ZDw5nq5YHkPb3v';

//     const imagePath = path.join(__dirname, './assets/images.jpeg');

//     it('should create a new post', async () => {
//       const response = await request(app)
//         .post(`/api/communities/${communityId}/posts`)
//         .field('content','This is a test post')
//         .attach('image', imagePath);

//       expect(response.status).toBe(201);
//       console.log(response.body);
//     //   expect(response.body).toEqual(formatResponse('Post created successfully', null, {
//     //     id: expect.any(String),
//     //     communityId: communityId,
//     //     content: 'This is a test post',
//     //     author: 'mockUserId', // Expect the user ID to be the author
//     //     imagePaths: [],
//     //     createdAt: expect.any(Object),
//     //     updatedAt: expect.any(Object)
//     //   }));
//     });
//   });

//   describe('GET /api/communities/:communityId/posts/:postId', () => {
//     it('should get post details', async () => {
//     //   await CommunityModel.createCommunity({
//     //     id: communityId,
//     //     name: 'Test Community',
//     //     description: 'A community for testing'
//     //   });

//     //   const newPost = await PostModel.createPost({
//     //     communityId: 'testCommunityId',
//     //     title: 'Test Post',
//     //     content: 'This is a test post'
//     //   });

//       const response = await request(app)
//         .get(`/api/communities/a9pFT5ZDw5nq5YHkPb3v/posts/`);

//       expect(response.status).toBe(200);
//     //   expect(response.body).toEqual(formatResponse('Success', null, {
//     //     id: newPost.id,
//     //     communityId: 'testCommunityId',
//     //     title: 'Test Post',
//     //     imagePaths: expect.any(Array),
//     //     content: 'This is a test post'
//     //   }));
//     console.log(response.body);
//     });
//   });

 

 
//   describe('GET /api/communities/:communityId/posts', () => {
//     it.only('should list posts by community', async () => {

//       const response = await request(app)
//         .get(`/api/communities/a9pFT5ZDw5nq5YHkPb3v/posts`);

//       expect(response.status).toBe(200);
//     //  expect(response.body).toBeInstanceOf(Array);
//     console.log(response.body);
//     });
//   });
// });
