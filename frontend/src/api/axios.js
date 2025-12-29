import axios from 'axios';

// Use proxy in development, direct URL in production
const baseURL = import.meta.env.DEV 
  ? '/api'  // Vite proxy will forward to http://localhost:8080
  : 'http://localhost:8080';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (CORS, connection issues)
    if (!error.response) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        console.error('Network error - possible CORS issue or server unavailable');
        // Don't show toast here, let individual components handle it
      }
      return Promise.reject({
        ...error,
        message: 'Network error. Please check if the server is running and CORS is configured.',
      });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;

