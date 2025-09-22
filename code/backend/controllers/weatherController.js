const axios = require('axios');
const Weather = require('../models/Weather');

// Get weather data by coordinates
const getWeatherByCoordinates = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Latitude and longitude are required' 
      });
    }

    // Check if we have recent data in database (within 30 minutes)
    // Only check database if MongoDB is connected
    let existingWeather = null;
    try {
      existingWeather = await Weather.findOne({
        'location.lat': parseFloat(lat),
        'location.lon': parseFloat(lon),
        createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
      });
    } catch (dbError) {
      console.log('Database not available, skipping cache check:', dbError.message);
    }

    if (existingWeather) {
      return res.json(existingWeather);
    }

    // Fetch from OpenWeatherMap API
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Weather API key not configured' 
      });
    }


    console.log("Fetching from:", `${API_BASE_URL}/weather/city?city=${currentCity}`);


    // Current weather
    const currentWeatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    console.log(currentWeatherResponse);

    // 5-day forecast
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const currentData = currentWeatherResponse.data;
    const forecastData = forecastResponse.data;

    // Process forecast data (group by day)
    const dailyForecast = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          temperatures: [],
          humidities: [],
          wind_speeds: [],
          descriptions: [],
          icons: []
        };
      }
      dailyForecast[date].temperatures.push(item.main.temp);
      dailyForecast[date].humidities.push(item.main.humidity);
      dailyForecast[date].wind_speeds.push(item.wind.speed);
      dailyForecast[date].descriptions.push(item.weather[0].description);
      dailyForecast[date].icons.push(item.weather[0].icon);
    });

    // Convert to array format
    const forecast = Object.keys(dailyForecast).slice(0, 5).map(date => {
      const dayData = dailyForecast[date];
      return {
        date: new Date(date),
        temperature: {
          min: Math.min(...dayData.temperatures),
          max: Math.max(...dayData.temperatures)
        },
        humidity: Math.round(dayData.humidities.reduce((a, b) => a + b) / dayData.humidities.length),
        wind_speed: Math.round(dayData.wind_speeds.reduce((a, b) => a + b) / dayData.wind_speeds.length),
        description: dayData.descriptions[Math.floor(dayData.descriptions.length / 2)],
        icon: dayData.icons[Math.floor(dayData.icons.length / 2)]
      };
    });

    // Generate farming advice based on weather
    const farmingAdvice = generateFarmingAdvice(currentData, forecast);

    const weatherData = {
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon
      },
      current: {
        temperature: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        pressure: currentData.main.pressure,
        wind_speed: currentData.wind.speed,
        wind_direction: currentData.wind.deg,
        visibility: currentData.visibility / 1000, // Convert to km
        uv_index: 0, // OpenWeatherMap doesn't provide UV index in free tier
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon
      },
      forecast,
      farming_advice: farmingAdvice
    };

    // Save to database (only if MongoDB is connected)
    let savedWeather = weatherData;
    try {
      savedWeather = await Weather.create(weatherData);
    } catch (dbError) {
      console.log('Database not available, skipping save:', dbError.message);
      // Add timestamp to the response for consistency
      savedWeather.createdAt = new Date();
    }

    res.json(savedWeather);
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    });
  }
};

// Get weather data by city name
const getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ 
        error: 'City name is required' 
      });
    }

    // Check if we have recent data in database
    // Only check database if MongoDB is connected
    let existingWeather = null;
    try {
      existingWeather = await Weather.findOne({
        'location.name': new RegExp(city, 'i'),
        createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
      });
    } catch (dbError) {
      console.log('Database not available, skipping cache check:', dbError.message);
    }

    if (existingWeather) {
      return res.json(existingWeather);
    }

    // Fetch coordinates for the city first
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );

    if (geoResponse.data.length === 0) {
      return res.status(404).json({ 
        error: 'City not found' 
      });
    }

    const { lat, lon } = geoResponse.data[0];
    
    // Use the coordinates to get weather data
    req.query.lat = lat;
    req.query.lon = lon;
    return getWeatherByCoordinates(req, res);

  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    });
  }
};

// Get weather history
const getWeatherHistory = async (req, res) => {
  try {
    const { lat, lon, days = 7 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Latitude and longitude are required' 
      });
    }

    const weatherHistory = await Weather.find({
      'location.lat': parseFloat(lat),
      'location.lon': parseFloat(lon),
      createdAt: { 
        $gte: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000) 
      }
    }).sort({ createdAt: -1 });

    res.json(weatherHistory);
  } catch (error) {
    console.error('Weather history error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch weather history',
      message: error.message 
    });
  }
};

// Generate farming advice based on weather data
const generateFarmingAdvice = (currentData, forecast) => {
  const temp = currentData.main.temp;
  const humidity = currentData.main.humidity;
  const windSpeed = currentData.wind.speed;
  const description = currentData.weather[0].description.toLowerCase();

  let cropSuitability = 'Good';
  let irrigationNeeded = false;
  let pestRisk = 'Low';
  let harvestRecommendation = 'Normal conditions';

  // Temperature-based advice
  if (temp < 10) {
    cropSuitability = 'Poor - Too cold for most crops';
    harvestRecommendation = 'Delay harvest until temperature rises';
  } else if (temp > 35) {
    cropSuitability = 'Poor - Too hot for most crops';
    irrigationNeeded = true;
    harvestRecommendation = 'Harvest early morning to avoid heat stress';
  }

  // Humidity-based advice
  if (humidity > 80) {
    pestRisk = 'High - Fungal diseases likely';
    harvestRecommendation = 'Ensure good ventilation and avoid overwatering';
  } else if (humidity < 30) {
    irrigationNeeded = true;
    harvestRecommendation = 'Increase irrigation frequency';
  }

  // Wind-based advice
  if (windSpeed > 15) {
    harvestRecommendation = 'Avoid harvesting in high winds';
    pestRisk = 'Medium - Wind can spread pests';
  }

  // Weather condition-based advice
  if (description.includes('rain')) {
    irrigationNeeded = false;
    pestRisk = 'High - Rain increases disease risk';
    harvestRecommendation = 'Avoid harvesting during wet conditions';
  } else if (description.includes('sunny') || description.includes('clear')) {
    if (temp > 25) {
      irrigationNeeded = true;
    }
  }

  return {
    crop_suitability: cropSuitability,
    irrigation_needed: irrigationNeeded,
    pest_risk: pestRisk,
    harvest_recommendation: harvestRecommendation
  };
};

module.exports = {
  getWeatherByCoordinates,
  getWeatherByCity,
  getWeatherHistory
};
