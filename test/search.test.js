/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app'); // Adjust the path to your Express app
const UserModel = require('../models/user.model');
const algoliaIndex = require('../config/algoliaConfig');
const { firestore, GeoPoint } = require('../config/firebaseAdmin');

// Mock the authenticate middleware
jest.mock('../middlewares/authenticate', () => (req, res, next) => {
  req.user = { uid: 'mockUserId' }; // Mock authenticated user
  next();
});

describe('Search API with Geolocation', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(done);
    done();
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(async () => {
    const userRef = firestore.collection('users').doc('mockUserId');
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log('Creating new user document for mockUserId');
      await userRef.set({
        displayName: 'Test User',
        email: 'test@example.com',
        location: new GeoPoint(0, 0), // Initialize with a default location
        age: 25,
        gender: 'male',
        equipment: 'none',
        joinedCommunities: [],
      });
    } else {
      console.log('User document already exists for mockUserId');
    }

    console.log('Updating location for mockUserId');
    await UserModel.saveLocation('mockUserId', { latitude: 89.7758, longitude: 120.4193 });

    // Verify the location was set correctly
    const updatedUserDoc = await userRef.get();
    console.log('Updated user document:', updatedUserDoc.data());
  });

  it.only('should return search results with geolocation', async () => {
    const response = await request(app)
      .get('/api/search')
      .query({ q: 'Test', radius: '5000' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Success',
      data: expect.any(Array),
    }));
  });

  it('should return 400 if user location not found', async () => {
    // Simulate user without location
    jest.spyOn(UserModel, 'getUserById').mockResolvedValueOnce({});

    const response = await request(app)
      .get('/api/search')
      .query({ q: 'community', radius: '5000' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'User location not found',
    }));
  });

  it('should return 500 on internal server error', async () => {
    // Temporarily change the search function to throw an error
    const originalSearch = algoliaIndex.search;
    algoliaIndex.search = jest.fn().mockRejectedValue(new Error('Algolia error'));

    const response = await request(app)
      .get('/api/search')
      .query({ q: 'community', radius: '5000' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Internal Server Error',
      error: 'Algolia error',
    }));

    // Restore the original search function
    algoliaIndex.search = originalSearch;
  });

  it('should return 500 if search result format is unexpected', async () => {
    // Temporarily change the search function to return an unexpected format
    const originalSearch = algoliaIndex.search;
    algoliaIndex.search = jest.fn().mockResolvedValue({});

    const response = await request(app)
      .get('/api/search')
      .query({ q: 'community', radius: '5000' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Unexpected search result format',
    }));

    // Restore the original search function
    algoliaIndex.search = originalSearch;
  });
});
