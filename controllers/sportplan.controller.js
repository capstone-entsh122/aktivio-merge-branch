const { getRecommendations } = require('../helpers/getRecommendation');
const { firestore } = require('../config/firebaseAdmin');
const formatResponse = require('../helpers/responseFormatter.js');

const getRecommendationsController = async (req, res) => {
  const { preferences, userId } = req.body;

  try {
    const recommendations = await getRecommendations(preferences);

    const userRef = firestore.collection('users').doc(userId);
    await userRef.set({ sportPlan: recommendations }, { merge: true });

    res.status(200).json(formatResponse('Success', null, recommendations));
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

module.exports = {
  getRecommendationsController
};
