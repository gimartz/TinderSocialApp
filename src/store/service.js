// src/services/api.js
import axios from 'axios';
import store from '.';

// IMPORTANT: Replace with your actual token retrieval logic
// For example, from AsyncStorage or Redux state
const getAuthToken = () => {
  const state = store.getState();
  // console.log('Auth:', state.auth.token); // Log the auth token to check if it's being retrieved correctly
  return state?.auth?.token || null;
};

const apiClient = axios.create({
  baseURL: 'https://speedit-server.onrender.com/v1/api/restaurants',
  // baseURL: 'http://192.168.123.196:8080/v1/api/restaurants',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the Authorization header
apiClient.interceptors.request.use(
  config => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default apiClient;
