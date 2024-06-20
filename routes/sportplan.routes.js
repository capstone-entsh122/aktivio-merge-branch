const express = require('express');
const { getRecommendationsController } = require('../controllers/sportplan.controller');

const router = express.Router();

router.post('/plan', getRecommendationsController);

module.exports = router;
