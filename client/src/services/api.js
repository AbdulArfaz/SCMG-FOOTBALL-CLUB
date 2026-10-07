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

// // Media API calls
export const fetchPictures = () => api.get('/media/pictures');
export const addPicture = (formData) => api.post('/media/pictures', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const fetchVideos = () => api.get('/media/videos');
export const addVideo = (videoData) => api.post('/media/videos', videoData, {
  headers: { 'Content-Type': 'multipart/form-data'}
});

// --- Vintage Media API calls ---
export const fetchVintagePictures = () => api.get('/vintage-pictures');
export const addVintagePicture = (formData) => api.post('/vintage-pictures', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const fetchVintageVideos = () => api.get('/vintage-videos');
export const addVintageVideo = (videoData) => api.post('/vintage-videos', videoData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default api;