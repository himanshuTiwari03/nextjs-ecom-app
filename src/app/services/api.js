// lib/api.js or services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: "http://fakestoreapi.in/api/",
  headers: {
    'Content-Type': 'application/json',
  },
});

//  Auto attach token if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const get = (url, config = {}) => api.get(url, config);
const post = (url, data, config = {}) => api.post(url, data, config);
const put = (url, data, config = {}) => api.put(url, data, config);
const del = (url, config = {}) => api.delete(url, config);

export default {
  get,
  post,
  put,
  delete: del, // named delete is reserved
};
