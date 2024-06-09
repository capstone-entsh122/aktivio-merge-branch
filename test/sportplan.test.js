// const request = require('supertest');
// const app = require('../app'); 

// describe('Sport Plan API', () => {
//   let createdSportPlanId;

//   beforeAll(async () => {
//     const res = await request(app)
//       .post('/api/sport_plans')
//       .send({
//         sportType: 'running_beginner',
//         difficultyLevel: 'Easy',
//         recommendedDuration: 30,
//         description: 'A test sport plan',
//         steps: [
//           { instruction: 'Start with a warm-up', order: 1 },
//           { instruction: 'Run for 10 minutes', order: 2 },
//           { instruction: 'Cool down and stretch', order: 3 }
//         ]
//       });

//     createdSportPlanId = res.body.id;
//     console.log('Created Sport Plan ID:', createdSportPlanId);
//   });

//   it('should create a sport plan', async () => {
//     const res = await request(app)
//       .post('/api/sport_plans')
//       .send({
//         sportType: 'running_beginner',
//         difficultyLevel: 'Easy',
//         recommendedDuration: 30,
//         description: 'A test sport plan',
//         steps: [
//           { order: 1, instruction: 'Start with a warm-up' },
//           { order: 2, instruction: 'Run for 10 minutes' },
//           { order: 3, instruction: 'Cool down and stretch' },
//         ],
//       });

//       console.log('Created Sport Plan ID:', res.body.id);
//       expect(res.statusCode).toBe(201);
//       expect(res.body).toHaveProperty('id');
//     });

//   it('should get a sport plan by ID', async () => {
//     const res = await request(app).get(`/api/sport_plans/${createdSportPlanId}`);
//     console.log('Get Sport Plan by ID Response:', res.body);
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty('id', createdSportPlanId);
//   });

//   it('should update a sport plan by ID', async () => {
//     const res = await request(app)
//       .put(`/api/sport_plans/${createdSportPlanId}`)
//       .send({
//         name: 'Updated Sport Plan',
//         difficultyLevel: 'Medium',
//         recommendedDuration: 45,
//         steps: [
//           { order: 1, instruction: 'Start with a light jog' },
//           { order: 2, instruction: 'Run for 20 minutes' },
//           { order: 3, instruction: 'Cool down and stretch' },
//         ],
//       });

//     console.log('Update Sport Plan Response:', res.body);
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty('message', 'Sport plan updated successfully');
//   });

//   it('should delete a sport plan by ID', async () => {
//     const res = await request(app).delete(`/api/sport_plans/${createdSportPlanId}`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty('message', 'Sport plan deleted successfully');
//   });

//   it('should list all sport plans', async () => {
//     const res = await request(app).get('/api/sport_plans');
//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('should get sport plan recommendations based on user preferences', async () => {
//     const res = await request(app).post('/api/sport_plans/recommendations').send({
//       sportType: 'running_beginner',
//       difficultyLevel: 'Easy',
//     });
//     console.log('Sport Plan Recommendations Response:', res.body);
//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//     expect(res.body.length).toBeGreaterThan(0);
//   });
// });
