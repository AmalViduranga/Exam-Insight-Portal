import axios from 'axios';

// Get the base URL from env or fallback to local
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g. redirect to login)
      // This will be handled by the AuthContext or components
    }
    return Promise.reject(error);
  }
);
