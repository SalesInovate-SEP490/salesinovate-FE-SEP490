import axios from 'axios';

const axiosInstance = axios.create({
  // Base URL for the API
  // baseURL: `${process.env.REACT_APP_API_ENDPOINT}:8086/api`,
  baseURL: "http://localhost:8082/api",
  // baseURL: `${process.env.REACT_APP_API_ENDPOINT}:8082/api`,
  timeout: 80000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify request config before sending the request
    // For example, add an Authorization header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response in Axios Instance", response.data)
    // Handle response data
    return response;
  },
  (error) => {
    // Handle response error
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error('Response error:', error.response);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Request error:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Axios error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
