import axios from 'axios';
// Using the baseurl to make requests from backend
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL + '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
