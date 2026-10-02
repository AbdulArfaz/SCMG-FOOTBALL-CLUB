import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Player API calls
export const fetchPlayers = () => api.get('/players');
export const addPlayer = (playerData) => api.post('/players', playerData);
export const updatePlayer = (id, playerDto) => api.put(`/players/${id}`, playerDto);
export const deletePlayer = (id) => api.delete(`/players/${id}`);

// Match & Leaderboard API calls
export const recordMatch = (matchData) => api.post('/matches', matchData);
export const fetchMatches = () => api.get('/matches');
export const fetchLeaderboard = (month) => api.get(`/stats/leaderboard?month=${month}`);

// Admin Login API call
export const adminLogin = (credentials) => api.post('/admin/login', credentials);

export default api;