/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// tests/event.test.js

const request = require('supertest');
const app = require('../app');
// eslint-disable-next-line no-unused-vars
const EventModel = require('../models/event.model');
const UserModel = require('../models/user.model');
const { firestore } = require('../config/firebaseAdmin');

describe('Event Controller', () => {
    let communityId;
    let eventId;
    let token;
    let userId;

    beforeAll(async () => {
      // Create a test community
      const communityRef = await firestore.collection('communities').add({
        name: 'Test Community',
        description: 'A community for testing',
        members: [], // Initialize an empty members array
      });
      communityId = communityRef.id;
    
      // Set the mock user ID
      userId = 'mockUserId';
    
      // Add the mock user to the community's members array
      await communityRef.update({
        members: [userId],
      });

      // Assuming you have a function to get a valid token for authentication
      token = await getUserToken(userId);
    });
  
    afterAll(async () => {
      // Clean up test data
      await firestore.collection('communities').doc(communityId).delete();
      if (eventId) {
        await firestore.collection('events').doc(eventId).delete();
      }
      await firestore.collection('users').where('email', '==', 'test@example.com').get()
        .then((snapshot) => {
          snapshot.forEach((doc) => doc.ref.delete());
        });
    });

  it('should create an event', async () => {
    const eventData = {
      name: 'Test Event',
      description: 'An event for testing',
      creator: 'Test User',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000),
      points: 10,
    };

    const response = await request(app)
      .post(`/api/communities/${communityId}/events/`)
      .set('Authorization', `Bearer ${token}`)
      .send(eventData);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe(eventData.name);
    eventId = response.body.data.id;
  });

  it('should get an event by ID', async () => {
    const response = await request(app)
      .get(`/api/communities/${communityId}/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(eventId);
  });

  it('should update an event', async () => {
    const updateData = {
      name: 'Updated Event Name',
      description: 'Updated event description',
    };

    const response = await request(app)
      .put(`/api/communities/${communityId}/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(updateData.name);
    expect(response.body.data.description).toBe(updateData.description);
  });

  it('should join an event', async () => {
    const response = await request(app)
      .post(`/api/communities/${communityId}/events/${eventId}/join`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.participants).toContainEqual(userId);
  });

  it('should leave an event', async () => {
    const response = await request(app)
      .post(`/api/communities/${communityId}/events/${eventId}/leave`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.participants).not.toContain(userId);
  });

  it('should delete an event', async () => {
    const response = await request(app)
      .delete(`/api/communities/${communityId}/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});

// Helper function to get user token for authentication
async function getUserToken(userId) {
  // Implement logic to generate and return a valid user token
  // This can be done using Firebase Authentication or any other authentication mechanism
  // Return the generated token
}
