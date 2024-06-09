/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app'); // Adjust the path to your Express app
const UserModel = require('../models/user.model');
const formatResponse = require('../helpers/responseFormatter');
const { GeoPoint } = require('../config/firebaseAdmin');// Ensure GeoPoint is correctly imported

// jest.mock('../middlewares/authenticate', () => (req, res, next) => {
//   req.user = { uid: 'mockUserId' }; // Mock authenticated user
//   next();
// });

describe('User API', () => {
  let server;
  
  beforeAll((done) => {
    server = app.listen(done);
  });

  afterAll(async(done) => {
    server.close(done);
  });

  describe('POST /api/users/signup', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/users/signup')
        .send({
          email: 'muhammadzaky@mail.com',
          password: 'testPassword',
          displayName: 'Test User'
        });

      expect(response.status).toBe(200);
      console.log(response.body);
      // expect(response.body).toEqual(formatResponse('Success'));
    });
  });

  
    it('should log in a user', async () => {
      // Create a mock user in the database
      // const mockUser = {
      //   email: 'test@example.com',
      //   password: 'testPassword',
      //   displayName: 'Test User'
      // };
      // await UserModel.createUser('mockUserId', mockUser);

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'muhammadzaky@mail.com',
          password: 'testPassword'
        });

      expect(response.status).toBe(200);
      console.log(response.body);
      // expect(response.body).toEqual(formatResponse('Success', null, {
      //   user: {
      //     email: 'muhammadzaky@mail.com',
      //     displayName: 'Test User'
      //   },
      //   token: expect.any(String)
      // }));
    });

  

  describe('GET /api/users/profile', () => {
    it('should get user details', async () => {
    //   await UserModel.createUser('mockUserId', {
    //     email: 'test@example.com',
    //     displayName: 'Test User 2'
    //   });

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer testToken');

      expect(response.status).toBe(200);
      console.log(response.body);
    //   expect(response.body).toEqual(formatResponse('Success', null, {
    //     email: 'test@example.com',
    //     displayName: 'Test User 2'
    //   }));
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user details', async () => {
    //   await UserModel.createUser('mockUserId', {
    //     email: 'test@example.com',
    //     displayName: 'Test User'
    //   });

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', 'Bearer testToken')
        .send({ displayName: 'Updated User' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(formatResponse('Success'));

      const updatedUser = await UserModel.getUserById('mockUserId');
      expect(updatedUser.displayName).toBe('Updated User');
    });
  });

  describe('DELETE /api/users/delete', () => {
    it('should delete user account', async () => {
      await UserModel.createUser('mockUserId', {
        email: 'test@example.com',
        displayName: 'Test User'
      });

      const response = await request(app)
        .delete('/api/users/delete')
        .set('Authorization', 'Bearer testToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(formatResponse('Success'));

      const deletedUser = await UserModel.getUserById('mockUserId');
      expect(deletedUser).toBeNull();
    });
  });

  describe('POST /api/users/join-community', () => {
    it('should join a community', async () => {
      // Create mock community
     const communityId = 'U5YXQ29j80iqYOjE0pLG';

    //   await UserModel.createUser('mockUserId', {
    //     email: 'test@example.com',
    //     displayName: 'Test User'
    //   });

      const response = await request(app)
        .put(`/api/users/memberships/${communityId}`)
        .set('Authorization', 'Bearer testToken')
        

      expect(response.status).toBe(200);
      expect(response.body).toEqual(formatResponse('Success'));

      const user = await UserModel.getUserById('mockUserId');
      expect(user.joinedCommunities).toContain(communityId);
    });
  });

  describe('DELETE /api/users/memberships/:communityId', () => {
    it('should leave a community', async () => {
      // Create mock community

    //   await UserModel.createUser('mockUserId', {
    //     email: 'test@example.com',
    //     displayName: 'Test User',
    //     joinedCommunities: ['22dcxVzKMdN4TAtpgqrR']
    //   });
        const communityId = 'U5YXQ29j80iqYOjE0pLG';

      const response = await request(app)
        .delete(`/api/users/memberships/${communityId}`)
        .set('Authorization', 'Bearer testToken');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(formatResponse('Success'));

      const user = await UserModel.getUserById('mockUserId');
      expect(user.joinedCommunities).not.toContain(communityId);
    });
  });

  describe('GET /api/users/memberships', () => {
    it('should list communities joined by the user', async () => {

    //   await UserModel.createUser('mockUserId', {
    //     email: 'test@example.com',
    //     displayName: 'Test User',
    //     joinedCommunities: ['22dcxVzKMdN4TAtpgqrR']
    //   });

      const response = await request(app)
        .get('/api/users/memberships')
        .set('Authorization', 'Bearer testToken');

      expect(response.status).toBe(200);
      // expect(response.body).toEqual(formatResponse('Success', null, [
      //   { id: '22dcxVzKMdN4TAtpgqrR', name: 'Mock Community', description: 'Mock Description' }
      // ]));
      console.log(response.body);
    });
  });

  describe('POST /api/users/location', () => {
    it.only('should save user location', async () => {
    //   await UserModel.createUser('mockUserId', {
    //     email: 'test@example.com',
    //     displayName: 'Test User'
    //   });

      const response = await request(app)
        .post('/api/users/location')
        .set('Authorization', 'Bearer testToken')
        .send({ latitude: 37.7749, longitude: -122.4194 });

      expect(response.status).toBe(200);
      // expect(response.body).toEqual(formatResponse('Location saved successfully'));

      const user = await UserModel.getUserById('mockUserId');
      expect(user.location).toEqual(new GeoPoint(37.7749, -122.4194));
      console.log(response.body);
    });
  });

//   // Continue with other tests...
});


// app.post('/api/users/location', async (req, res) => {
//   try {
//     const { latitude, longitude } = req.body;
//     console.log('Received location:', latitude, longitude);

//     if (latitude == null || longitude == null) {
//       throw new Error('Invalid location data');
//     }

//     const user = await UserModel.getUserById(req.user.uid);
//     console.log('User found:', user);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     user.location = new GeoPoint(latitude, longitude);
//     await UserModel.updateUser(user);
//     console.log('Location updated:', user.location);

//     res.status(200).json(formatResponse('Location saved successfully'));
//   } catch (error) {
//     console.error('Error saving location:', error);
//     res.status(500).json(formatResponse('Internal Server Error', error.message));
//   }
// });

// module.exports = app;
