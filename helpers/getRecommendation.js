const axios = require('axios');
const SportPlanModel = require('../models/sportplan.model');

async function getRecommendations(preferences) {
  try {
    console.log('Sending preferences to recommendation API:', preferences);
    
    const response = await axios.post('https://aktivio-recsyst-xvcqyzplqq-et.a.run.app/predict', preferences);
     // Log the response received from the external API
     console.log('Received response from recommendation API:', response.data);

    const recommendedSports = response.data.sportsRecommendations.slice(0, 3);

    let sportPlans = [];
    for (const sport of recommendedSports) {
      const sportPlan = await SportPlanModel.getSportPlanRecommendations(sport);
      sportPlans.push(...sportPlan);
    }

    return {
      sportsRecommendations: recommendedSports,
      timeRecommendations: response.data.timeRecommendations,
      weeklyRecommendations: response.data.weeklyRecommendations,
      plans: sportPlans
    };
  } catch (error) {
    console.error('Error getting recommendations from external API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw new Error(`Error getting recommendations: ${error.message}`);
  }
}

module.exports = {
  getRecommendations,
};