const express = require('express');
const { searchCommunities } = require('../controllers/search.controller');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.get('/', authenticate, searchCommunities);

module.exports = { routes: router};
