import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:2000/api', // change if hosted elsewhere
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('jwt');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
