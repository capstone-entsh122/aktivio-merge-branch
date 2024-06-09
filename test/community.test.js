// /* eslint-disable no-undef */
// const request = require('supertest');
// const app = require('../app'); // Adjust the path to your Express app
// const CommunityModel = require('../models/community.model');

// describe('Community API', () => {
//   let server;

//   beforeAll((done) => {
//     server = app.listen(done);
//   });

//   afterAll((done) => {
//     server.close(done);
//   });
//   const communityId = '2EkWuBaAnBdK2PrcxEAi';

//   it.only('should create a new community and index it in Algolia', async () => {
//     const response = await request(app)
//       .post('/api/communities')
//       .send({
//         name: 'Test Community New 3',
//         description: 'A community for testing',
//         latitude: 37.7749,
//         longitude: -122.4194,
//       });

//     expect(response.status).toBe(201);
//     console.log(response.body);
//   });

//   it('should get the created community by ID', async () => {
//     const response = await request(app)
//       .get(`/api/communities/${communityId}`);

//     expect(response.status).toBe(200);
//     expect(response.body.data).toHaveProperty('id', communityId);
//   });

//   it('should update the community by ID', async () => {
//     const response = await request(app)
//       .put(`/api/communities/${communityId}`)
//       .send({
//         name: 'Updated Community',
//         description: 'Updated description',
//       });

//     expect(response.status).toBe(200);
//     const updatedCommunity = await CommunityModel.getCommunityById(communityId);
//     expect(updatedCommunity.name).toBe('Updated Community');
//     expect(updatedCommunity.description).toBe('Updated description');
//   });

//   it('should list all communities', async () => {
//     const response = await request(app)
//       .get('/api/communities/')
//       .set('Authorization', 'Bearer mockToken');

//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body.data)).toBe(true);
//     expect(response.body.data.length).toBeGreaterThan(0);
//     console.log(response.body);
//   });

//   it('should list members of the community', async () => {
//     const response = await request(app)
//       .get(`/api/communities/${communityId}/members`)
//       .set('Authorization', 'Bearer mockToken');

//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body.data)).toBe(true);
//     expect(response.body.data.length).toBeGreaterThan(0);
//     console.log(response.body);
//   });

//   it('should delete the community by ID', async () => {
//     const response = await request(app)
//       .delete(`/api/communities/${communityId}`)
//       .set('Authorization', 'Bearer mockToken');

//     expect(response.status).toBe(200);
//     const deletedCommunity = await CommunityModel.getCommunityById(communityId);
//     expect(deletedCommunity).toBeNull();
//   });

//   it('should list members of the community', async () => {
//     // Ensure the community has members
//     await CommunityModel.addMember(communityId, 'mockUserId2');

//     const response = await request(app)
//       .get(`/api/communities/${communityId}/members`)
//       .set('Authorization', 'Bearer mockToken');

//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body.data)).toBe(true);
//     expect(response.body.data.length).toBeGreaterThan(0);
//     expect(response.body.data).toContainEqual(expect.objectContaining({
//       id: 'mockUserId',
//       displayName: expect.any(String),
//     }));
//   });
// });
