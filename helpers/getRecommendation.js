const SportPlanModel = require('../models/sportplan.model');

async function getRecommendations(preferences) {
  try {
    const recommendations = await SportPlanModel.getSportPlanRecommendations(preferences);
    return recommendations;
  } catch (error) {
    throw new Error(`Error getting recommendations: ${error.message}`);
  }
}

module.exports = getRecommendations;