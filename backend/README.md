# Kisan Setu Backend

Backend API for the Kisan Setu farmer application with weather integration and MongoDB database.

## Features

- Weather API integration with OpenWeatherMap
- MongoDB database for storing weather data and farmer information
- Farming advice based on weather conditions
- RESTful API endpoints

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `config.env` and update with your OpenWeatherMap API key
   - Ensure MongoDB is running on `mongodb://localhost:27017`

3. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Weather Endpoints

- `GET /api/weather/coordinates?lat={lat}&lon={lon}` - Get weather by coordinates
- `GET /api/weather/city?city={cityName}` - Get weather by city name
- `GET /api/weather/history?lat={lat}&lon={lon}&days={days}` - Get weather history

### Health Check

- `GET /api/health` - Server health status

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `OPENWEATHER_API_KEY` - OpenWeatherMap API key
- `NODE_ENV` - Environment (development/production)

## Weather Data Structure

The API returns comprehensive weather data including:
- Current weather conditions
- 5-day forecast
- Farming advice based on weather
- Location information

## Getting OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `config.env` file
