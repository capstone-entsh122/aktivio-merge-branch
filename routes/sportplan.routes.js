const express = require('express');
const { getRecommendationsController, setFinishedSportPlanController, updateElapsedTimeController, getUserSportPlan } = require('../controllers/sportplan.controller');

const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/plan', authenticate, getUserSportPlan);
router.post('/plan', authenticate, getRecommendationsController);
router.post('/finished', authenticate, setFinishedSportPlanController);
router.post('/elapsed', authenticate, updateElapsedTimeController);


module.exports = router;
