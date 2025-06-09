import axios from 'axios';
import Cookies from 'js-cookie';

// API base URL
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Token'ı alma fonksiyonu
const getToken = () => {
  // Cookie'den token'ı al
  const token = Cookies.get('accessToken');
  if (token) {
    return token;
  }
  
  // Cookie'de yoksa localStorage'dan kontrol et (yedek olarak)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  
  return null;
};

// Axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie'leri gönder - bu çok önemli!
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Added token to request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 hatası durumunda yönlendirme
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    console.error('API Error:', error.response?.status, error.response?.data, originalRequest.url);
    
    // 401 hatası durumunda login sayfasına yönlendir
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Unauthorized error, redirecting to login page');
      
      // LocalStorage'dan kullanıcı bilgilerini temizle
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
      }
      
      // Login sayfasına yönlendir
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
