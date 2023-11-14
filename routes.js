const express = require('express');
const router = express.Router();
const weatherController = require('./controller');

router.post('/getCurrentWeather', weatherController.getCurrentWeather);

module.exports = router;
