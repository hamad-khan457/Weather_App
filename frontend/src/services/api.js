import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const weatherAPI = {
  getCurrentWeather: (city) => 
    api.get(`/weather/current?city=${city}`),
  
  getForecast: (city) => 
    api.get(`/weather/forecast?city=${city}`),
  
  getSearchHistory: () => 
    api.get('/weather/history'),
  
  deleteHistory: (id) => 
    api.delete(`/weather/history/${id}`)
};

export default api;