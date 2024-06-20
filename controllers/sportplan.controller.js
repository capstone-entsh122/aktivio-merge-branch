const { getRecommendations } = require('../helpers/getRecommendation');
const { firestore } = require('../config/firebaseAdmin');
const formatResponse = require('../helpers/responseFormatter.js');
const SportPlanModel = require('../models/sportplan.model.js');

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

const setFinishedSportPlanController = async (req, res) => {
  const {  planId, isCompleted = true } = req.body;
  const userId = req.user.uid;

  try {
    const updatedPlans = await SportPlanModel.setFinishedSportPlan(userId, planId, isCompleted);
    res.status(200).json(formatResponse('Success', null, updatedPlans));
  } catch (error) {
    console.error('Error setting sport plan completion status:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }

}

const updateElapsedTimeController = async (req, res) => {
  const { planId, stepOrder, elapsedTime } = req.body;
  const userId = req.user.uid;

  if (!planId || stepOrder === undefined || elapsedTime === undefined) {
    return res.status(400).json(formatResponse('Bad Request', 'Missing planId, stepOrder, or elapsedTime'));
  }

  try {
    const updatedPlan = await SportPlanModel.updateElapsedTime(userId, planId, stepOrder, elapsedTime);
    
    if (!updatedPlan) {
      return res.status(404).json(formatResponse('Not Found', 'Plan not found'));
    }

    res.status(200).json(formatResponse('Success', null, { updatedPlan }));
  } catch (error) {
    console.error('Error updating elapsed time:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

module.exports = {
  getRecommendationsController,
  setFinishedSportPlanController,
  updateElapsedTimeController
};
