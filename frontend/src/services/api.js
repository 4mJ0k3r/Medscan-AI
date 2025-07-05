import axios from 'axios';

// Create axios instance with base configuration
const getApiBaseURL = () => {
  // In production, use the same domain with /api prefix
  if (import.meta.env.PROD) {
    return '/api';
  }
  // In development, use the specified API URL or localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 30000, // Increased timeout for serverless cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and OpenAI API key
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    // Add OpenAI API key if available
    const openaiApiKey = localStorage.getItem('openai_api_key');
    if (openaiApiKey) {
      config.headers['X-OpenAI-API-Key'] = openaiApiKey;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (email, password, name) => 
    api.post('/auth/register', { email, password, name }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
};

// Blood Test API calls
export const bloodTestAPI = {
  uploadReport: (formData) => 
    api.post('/blood-test/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  getReports: (params = {}) => 
    api.get('/blood-test/reports', { params }),
  
  getReport: (id) => 
    api.get(`/blood-test/reports/${id}`),
  
  updateReport: (id, data) => 
    api.put(`/blood-test/reports/${id}`, data),
  
  deleteReport: (id) => 
    api.delete(`/blood-test/reports/${id}`),
  
  getAnalysis: (id) => 
    api.get(`/blood-test/reports/${id}/analysis`),
  
  getProcessingStatus: (id) => 
    api.get(`/blood-test/reports/${id}/status`),
  
  reprocessReport: (id) => 
    api.post(`/blood-test/reports/${id}/reprocess`),
  
  getDashboardStats: () => 
    api.get('/blood-test/dashboard'),
};

// User API calls
export const userAPI = {
  getProfile: () => 
    api.get('/user/profile'),
  
  updateProfile: (data) => 
    api.put('/user/profile', data),
  
  uploadAvatar: (formData) => 
    api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// Health Facts API calls
export const healthFactsAPI = {
  getRandomFacts: (count = 2) => 
    api.get(`/health-facts/random?count=${count}`),
  
  getAllFacts: () => 
    api.get('/health-facts'),
};

export default api; 