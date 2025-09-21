const express = require('express');
const router = express.Router();
const {
  getWeatherByCoordinates,
  getWeatherByCity,
  getWeatherHistory
} = require('../controllers/weatherController');

// GET /api/weather/coordinates?lat=12.9716&lon=77.5946
router.get('/coordinates', getWeatherByCoordinates);

// GET /api/weather/city?city=Bangalore
router.get('/city', getWeatherByCity);

// GET /api/weather/history?lat=12.9716&lon=77.5946&days=7
router.get('/history', getWeatherHistory);

module.exports = router;
