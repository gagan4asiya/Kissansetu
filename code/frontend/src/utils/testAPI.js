// Test script to verify backend connectivity
import { weatherAPI, API_BASE_URL } from './api';

export const testBackendConnection = async () => {
  console.log('🔄 Testing backend connection...');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  
  try {
    // Test health check endpoint
    console.log('🏥 Testing health check...');
    const health = await weatherAPI.healthCheck();
    console.log('✅ Health check successful:', health);
    
    // Test weather API with a simple city
    console.log('🌤️ Testing weather API...');
    const weather = await weatherAPI.getWeatherByCity('Delhi');
    console.log('✅ Weather API successful:', weather.location.name);
    
    return {
      success: true,
      message: 'Backend connection successful!',
      details: {
        health: health.status,
        weather: weather.location.name
      }
    };
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return {
      success: false,
      message: 'Backend connection failed',
      error: error.message,
      baseURL: API_BASE_URL
    };
  }
};

// Helper function to check network connectivity
export const checkNetworkConnectivity = async () => {
  try {
    // Try to fetch from a reliable external service
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    console.error('Network connectivity check failed:', error);
    return false;
  }
};
