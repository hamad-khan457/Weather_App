const express = require('express');
const router = express.Router();
const WeatherController = require('../controller/WeatherController');

router.get('/current', WeatherController.getCurrentWeather)
router.get('/forecast', WeatherController.getForecast)
router.get('/history', WeatherController.getSearchHistory);
router.delete('/history/:id', WeatherController.deleteHistory);

module.exports = router;
