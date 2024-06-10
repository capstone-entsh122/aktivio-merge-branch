// /* eslint-disable no-undef */
// const request = require('supertest');
// const app = require('../app');
// const UserModel = require('../models/user.model');
// const formatResponse = require('../helpers/responseFormatter');
// const { GeoPoint } = require('../config/firebaseAdmin');

// let server;
// let userId = '5fGSZQPaH3W8uaefTTUG4j9RCZB3';
// let communityId ='54cYn7Kedhyy3ESjpmCl';

// beforeAll((done) => {
//   server = app.listen(done);
// });

// afterAll((done) => {
 
//   server.close(done);
// });

// describe('User API', () => {
// //   describe('POST /api/users/signup', () => {
// //     it.only('should create a new user', async () => {
// //       const response = await request(app)
// //         .post('/api/users/signup')
// //         .send({
// //           email: `testuser23rrr3221e22222weww2@example.com`,
// //           password: 'testPassword',
// //           displayName: 'Test User'
// //         });

// //       expect(response.status).toBe(200);
// //       expect(response.body.data.user).toBeDefined();
// //       expect(response.body.data.token).toBeDefined();

// //       userId = response.body.data.user.id;
// //       token = response.body.data.token;
// //     });
// //   });

//   describe('GET /api/users/profile', () => {
//     it('should get user details', async () => {
//       const response = await request(app)
//         .get('/api/users/profile')
//         .set('Authorization', `Bearer token`);

//       expect(response.status).toBe(200);
//       // expect(response.body.data.email).toBe('testuser22@example.com');
//       // expect(response.body.data.displayName).toBe('Test User');
//     });
//   });

//   describe('PUT /api/users/profile', () => {
//     it('should update user details', async () => {
//       const response = await request(app)
//         .put('/api/users/profile')
//         .set('Authorization', `Bearer token`)
//         .send({ displayName: 'Updated User' });

//       expect(response.status).toBe(200);
//       // expect(response.body).toEqual(formatResponse('Success'));

//       const updatedUser = await UserModel.getUserById(userId);
//       expect(updatedUser.displayName).toBe('Updated User');
//     });
//   });

//   describe('POST /api/users/join-community', () => {
//     it('should join a community', async () => {
      

//       const response = await request(app)
//         .put(`/api/users/memberships/${communityId}`)
//         .set('Authorization', `Bearer token`);

//       expect(response.status).toBe(200);
//       // expect(response.body).toEqual(formatResponse('Success'));

//       const user = await UserModel.getUserById(userId);
//       expect(user.joinedCommunities).toContain(communityId);
//     });
//   });

//   describe('GET /api/users/memberships', () => {
//     it('should list communities joined by the user', async () => {
//       const response = await request(app)
//         .get('/api/users/memberships')
//         .set('Authorization', `Bearer token`);

//       expect(response.status).toBe(200);
//     //   expect(response.body.data).toContainEqual({ id: 'mJl9YRvYZTLU88gPUYaF' });
//     });
//   });

//   describe('POST /api/users/location', () => {
//     it('should save user location', async () => {
//       const response = await request(app)
//         .post('/api/users/location')
//         .set('Authorization', `Bearer token`)
//         .send({ latitude: 37.7749, longitude: -122.4194 });

//       expect(response.status).toBe(200);
//     //   expect(response.body).toEqual(formatResponse('Location saved successfully'));

//       const user = await UserModel.getUserById(userId);
//       expect(user.location).toEqual(new GeoPoint(37.7749, -122.4194));
//     });
//   });

//   describe('DELETE /api/users/memberships/:communityId', () => {
//     it('should leave a community', async () => {

//       const response = await request(app)
//         .delete(`/api/users/memberships/${communityId}`)
//         .set('Authorization', `Bearer token`);

//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(formatResponse('Success'));

//       const user = await UserModel.getUserById(userId);
//       expect(user.joinedCommunities).not.toContain(communityId);
//     });
//   });

//   // ... (previous test cases)

// describe('PUT /api/users/preference', () => {
//     it('should update user preferences', async () => {
//       const preferences = {
//         gender: 'male',
//         age: 30,
//         equipment: ['dumbbells', 'resistance bands'],
//         motivation: 'improve fitness',
//         availableTime: 60,
//         fitnessLevel: 'intermediate',
//         placePreference: 'gym',
//         socialPreference: 'group',
//         diseaseHistory: []
//       };
  
//       const response = await request(app)
//         .put('/api/users/preference')
//         .set('Authorization', `Bearer token`)
//         .send(preferences);
  
//       expect(response.status).toBe(200);
//     //   expect(response.body).toEqual(formatResponse('Success'));
  
//       const updatedUser = await UserModel.getUserById(userId);
//       expect(updatedUser.preferences).toEqual(preferences);
//     });
//   });
  
//   describe('DELETE /api/users/delete', () => {
//     it('should delete the user account', async () => {
//       const response = await request(app)
//         .delete('/api/users/delete')
//         .set('Authorization', `Bearer token`);
  
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(formatResponse('Success'));
  
//       const deletedUser = await UserModel.getUserById(userId);
//       expect(deletedUser).toBeNull();
//     });
//   });

//   // Continue with other tests...
// });