const formatResponse = require('../helpers/responseFormatter');
const SportPlanModel = require('../models/sportplan.model');

exports.createSportPlan = async (req, res) => {
  try {
    const sportPlan = await SportPlanModel.createSportPlan(req.body);
    res.status(201).json(formatResponse('Sport plan created successfully', null, sportPlan));
  } catch (error) {
    console.error('Error creating sport plan:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

exports.getSportPlanById = async (req, res) => {
  try {
    const sportPlan = await SportPlanModel.getSportPlanById(req.params.id);
    if (!sportPlan) {
      return res.status(404).json(formatResponse('Sport plan not found'));
    }
    res.status(200).json(sportPlan);
  } catch (error) {
    console.error('Error fetching sport plan by ID:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

exports.updateSportPlanById = async (req, res) => {
  try {
    const updatedSportPlan = await SportPlanModel.updateSportPlanById(req.params.id, req.body);
    res.status(200).json(formatResponse('Sport plan updated successfully', null, updatedSportPlan));
  } catch (error) {
    console.error('Error updating sport plan:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

exports.deleteSportPlanById = async (req, res) => {
  try {
    await SportPlanModel.deleteSportPlanById(req.params.id);
    res.status(200).json(formatResponse('Sport plan deleted successfully'));
  } catch (error) {
     console.error('Error deleting sport plan:', error);
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

exports.listsport_plans = async (req, res) => {
  try {
    const sport_plans = await SportPlanModel.listsport_plans();
    res.status(200).json(formatResponse('Success', null, sport_plans));
  } catch (error) {
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};

exports.getSportPlanRecommendations = async (req, res) => {
  try {
    const recommendations = await SportPlanModel.getSportPlanRecommendations(req.body);
    if (recommendations.length === 0) {
      return res.status(404).json(formatResponse('No sport plan recommendations found'));
    }
    res.status(200).json(formatResponse('Success', null, recommendations));
  } catch (error) {
    res.status(500).json(formatResponse('Internal Server Error', error.message));
  }
};
