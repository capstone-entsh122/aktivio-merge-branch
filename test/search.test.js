/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app'); // Adjust the path to your Express app
const UserModel = require('../models/user.model');
const algoliaIndex = require('../config/algoliaConfig');

// Mock the authenticate middleware
jest.mock('../middlewares/authenticate', () => (req, res, next) => {
  req.user = { uid: 'zVhJr9EYmkUdOv4A35ZX5VD81bq2' }; // Mock authenticated user
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
    // Ensure the user has a location set
    await UserModel.saveLocation('zVhJr9EYmkUdOv4A35ZX5VD81bq2', { latitude: 89.7758, longitude: 120.4193 });
  });

  it('should return search results with geolocation', async () => {
    const response = await request(app)
      .get('/api/search')
      .query({ q: 'Test', radius: '5000' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      message: 'Success',
      data: expect.any(Array),
    }));
    console.log(response.body.data);
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
      data: null,
    }));

    // Restore the original search function
    algoliaIndex.search = originalSearch;
  });
});
