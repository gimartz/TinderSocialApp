// src/services/api.js
import axios from 'axios';
import store from '.';

// IMPORTANT: Replace with your actual token retrieval logic
// For example, from AsyncStorage or Redux state
const getAuthToken = () => {
  const state = store.getState();
  const token = state.auth?.token;
  // console.log('User Info:', token); // Log the user info to check if it's being retrieved correctly
  return token || null;
};

const ApiInstance = axios.create({
  baseURL: 'https://speedit-server.onrender.com/v1/api', // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the Authorization header
ApiInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default ApiInstance;