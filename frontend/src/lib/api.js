import axios from 'axios';

const api = axios.create({
  // NEXT_PUBLIC_API_URL is baked as '/api' at build time.
  // Calls go to khizar.ksdev.me/api/* which Next.js rewrites proxy to the backend container.
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

// Request interceptor to add JWT token if exists
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
