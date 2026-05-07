import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE_URL = process.env.API_BASE_URL || (isLocalhost ? 'http://localhost:5000/api' : '/api');

const API = axios.create({ baseURL: API_BASE_URL });

export function setToken(token){
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete API.defaults.headers.common['Authorization'];
}

export default API;
