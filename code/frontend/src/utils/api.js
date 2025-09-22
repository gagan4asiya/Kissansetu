import { Platform } from 'react-native';
import axios from 'axios';

// =============================================================================
// 🔧 SETUP FOR NEW DEVELOPERS - CHANGE THIS IP ADDRESS!
// =============================================================================
// 
// TO FIND YOUR IP ADDRESS:
// Windows: Open Command Prompt and run: ipconfig | findstr "IPv4"
// Mac/Linux: Open Terminal and run: ifconfig | grep "inet "
// 
// Look for an IP that starts with 192.168.x.x or 172.x.x.x or 10.x.x.x
// 
const YOUR_COMPUTER_IP = '192.168.29.52'; // 👈 CHANGE THIS TO YOUR IP!
//
// =============================================================================

const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    // Web can use localhost
    return 'http://localhost:5000/api';
  }
  
  // For mobile devices (React Native), use your computer's actual IP
  return `http://${YOUR_COMPUTER_IP}:5000/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      baseURL: API_BASE_URL,
    });
    
    // Provide user-friendly error messages
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      throw new Error(`Cannot connect to server at ${API_BASE_URL}. 

Troubleshooting:
1. Ensure backend is running: npm start (in code/backend/)
2. If using mobile device, try uncommenting one of the IP addresses in api.js:
   - http://172.16.37.127:5000/api (your primary IP)
   - http://172.19.96.1:5000/api (your secondary IP)`);
    }
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error(`Server is not running at ${API_BASE_URL}. Please start the backend server with: npm start`);
    }
    
    throw error;
  }
);

// Weather API functions
export const weatherAPI = {
  // Get weather by city
  getWeatherByCity: async (city) => {
    try {
      const response = await api.get(`/weather/city?city=${city}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch weather for ${city}:`, error.message);
      throw error;
    }
  },
  
  // Get weather by coordinates
  getWeatherByCoords: async (lat, lon) => {
    try {
      const response = await api.get(`/weather/coords?lat=${lat}&lon=${lon}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch weather for coordinates ${lat},${lon}:`, error.message);
      throw error;
    }
  },
  
  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Backend health check failed:', error.message);
      throw error;
    }
  },
};

// Export the configured axios instance and base URL for other uses
export { api, API_BASE_URL };
export default api;
