const express = require('express');
const { getRecommendationsController, setFinishedSportPlanController, updateElapsedTimeController } = require('../controllers/sportplan.controller');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/plan', authenticate, getRecommendationsController);
router.post('/finished', authenticate, setFinishedSportPlanController);
router.post('/elapsed', authenticate, updateElapsedTimeController);

module.exports = router;
