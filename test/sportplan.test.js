const firestore = require('../config/firebaseAdmin');
const SportPlanModel = require('../models/sportplan.model');

jest.mock('../config/firebaseAdmin');

describe('SportPlanModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch sport plan recommendations', async () => {
    const mockData = {
      docs: [
        { id: '1', data: () => ({ sport: 'basketball', plan: 'Plan A' }) },
        { id: '2', data: () => ({ sport: 'basketball', plan: 'Plan B' }) }
      ],
      empty: false
    };

    firestore.collection.mockReturnValue({
      where: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockData)
      })
    });

    const sportPlans = await SportPlanModel.getSportPlanRecommendations('basketball');
    expect(sportPlans).toEqual([
      { id: '1', sport: 'basketball', plan: 'Plan A' },
      { id: '2', sport: 'basketball', plan: 'Plan B' }
    ]);
  });

  test('should return empty array if no sport plans found', async () => {
    const mockData = {
      docs: [],
      empty: true
    };

    firestore.collection.mockReturnValue({
      where: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockData)
      })
    });

    const sportPlans = await SportPlanModel.getSportPlanRecommendations('nonexistent');
    expect(sportPlans).toEqual([]);
  });

  test('should throw an error if fetching sport plans fails', async () => {
    firestore.collection.mockReturnValue({
      where: jest.fn().mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('Firestore error'))
      })
    });

    await expect(SportPlanModel.getSportPlanRecommendations('basketball')).rejects.toThrow('Error getting sport plan recommendations: Firestore error');
  });
});
