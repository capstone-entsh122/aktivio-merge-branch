const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const authenticate = require('../middlewares/authenticate');
const {classify, setCalories} = require('../controllers/classify.controller');

router.post('/', upload.single('image'), classify);
router.post('/set', authenticate, setCalories);

module.exports = { routes: router };