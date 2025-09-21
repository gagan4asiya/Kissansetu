const axios = require('axios');

const testAPI = async () => {
  try {
    console.log('Testing Kisan Setu Backend API...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test weather by coordinates (Bangalore)
    console.log('\n2. Testing weather by coordinates (Bangalore)...');
    const weatherResponse = await axios.get('http://localhost:5000/api/weather/coordinates?lat=12.9716&lon=77.5946');
    console.log('✅ Weather data received:', {
      location: weatherResponse.data.location,
      current_temp: weatherResponse.data.current.temperature,
      farming_advice: weatherResponse.data.farming_advice
    });
    
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
};

// Run the test
testAPI();
