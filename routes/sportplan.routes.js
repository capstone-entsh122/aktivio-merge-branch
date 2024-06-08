const express = require('express');
const router = express.Router();
const sportPlanController = require('../controllers/sportplan.controller');

router.post('/sport_plans', sportPlanController.createSportPlan);
router.get('/sport_plans/:id', sportPlanController.getSportPlanById);
router.put('/sport_plans/:id', sportPlanController.updateSportPlanById);
router.delete('/sport_plans/:id', sportPlanController.deleteSportPlanById);
router.get('/sport_plans', sportPlanController.listsport_plans);
router.post('/sport_plans/recommendations', sportPlanController.getSportPlanRecommendations);

module.exports = router;
