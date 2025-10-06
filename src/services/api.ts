import axios from 'axios';

const API_BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: process.env.REACT_APP_NASA_API_KEY || 'DEMO_KEY',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.url, 'Params:', config.params);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, 'Data count:', 
      response.data.photos?.length || response.data.latest_photos?.length || 0);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default apiClient;

