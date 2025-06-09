'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/utils/api';
import {LoginData, SignupData} from "@/lib/auth";
import Cookies from 'js-cookie';

// Kullanıcı tipi
interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  roles?: string[];
}

// AuthContext için tip tanımı
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  getGoogleAuthUrl: () => Promise<string>;
  setTokens: () => Promise<boolean>;
  fetchUserData: () => Promise<User | undefined>;
  hasRole: (role: string) => boolean;
}

// Context oluşturma
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookie'den token'ı alma fonksiyonu
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

// Cookie'den refresh token'ı alma fonksiyonu
const getRefreshToken = () => {
  // Cookie'den refresh token'ı al
  const refreshToken = Cookies.get('refreshToken');
  if (refreshToken) {
    return refreshToken;
  }
  
  // Cookie'de yoksa localStorage'dan kontrol et (yedek olarak)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  
  return null;
};

// Cookie'den kullanıcı bilgilerini alma fonksiyonu
const getUserFromCookie = () => {
  try {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      // URL decode işlemi yaparken + işaretlerini boşluğa çevir
      const decodedCookie = decodeURIComponent(userCookie.replace(/\+/g, ' '));
      return JSON.parse(decodedCookie);
    }
  } catch (e) {
    console.error('Failed to parse user cookie:', e);
  }
  return null;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Kullanıcı bilgilerini almak için fonksiyon
  const fetchUserData = async () => {
    try {
      console.log("Fetching user data...");
      setLoading(true);

      // Önce cookie'den kullanıcı bilgilerini kontrol et
      const userFromCookie = getUserFromCookie();
      if (userFromCookie) {
        setUser(userFromCookie);
        console.log("User data loaded from cookie:", userFromCookie);
        setLoading(false);
        return userFromCookie;
      }

      // API endpoint'ini çağır - cookie'ler otomatik olarak gönderilecek
      const response = await api.get('/auth-service/api/v1/auth/me');
      console.log("User data response:", response.data);

      if (response.data) {
        setUser(response.data);
        console.log("User data set:", response.data);
        
        // Kullanıcı bilgilerini localStorage'a da kaydet (opsiyonel)
        if (typeof window !== 'undefined') {
          localStorage.setItem('userData', JSON.stringify(response.data));
        }
        
        setLoading(false);
        return response.data;
      }
      
      setLoading(false);
      return null;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Token geçersizse veya kullanıcı bulunamazsa logout yapın
      if (error.response?.status === 401) {
        logout();
      }
      setLoading(false);
      throw error;
    }
  };

  // Token'ları ayarlamak için fonksiyon - artık token parametresi almıyor
  const setTokens = async () => {
    try {
      // Kullanıcı bilgilerini al - cookie'ler otomatik olarak gönderilecek
      await fetchUserData();
      return true;
    } catch (error) {
      console.error("Failed to set tokens:", error);
      return false;
    }
  };

  // Auth durumunu başlatma
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Initializing auth...");
        setLoading(true);
        
        // Önce cookie'den kullanıcı bilgilerini kontrol et
        const userFromCookie = getUserFromCookie();
        if (userFromCookie) {
          setUser(userFromCookie);
          console.log("User data loaded from cookie:", userFromCookie);
          setLoading(false);
          return;
        }
        
        // Cookie'de yoksa localStorage'dan kontrol et
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            setUser(userData);
            console.log("User data loaded from localStorage:", userData);
            setLoading(false);
            return;
          } catch (e) {
            console.error("Failed to parse user data from localStorage:", e);
          }
        }
        
        // Token varsa API'den kullanıcı bilgilerini al
        const token = getToken();
        if (token) {
          console.log("Token found, fetching user data");
          await fetchUserData();
        } else {
          console.log("No token found");
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Google Auth URL'sini almak için fonksiyon
  const getGoogleAuthUrl = async () => {
    try {
      const response = await api.get('/auth-service/api/v1/oauth2/google/url');
      return response.data;
    } catch (error) {
      console.error('Failed to get Google auth URL:', error);
      throw error;
    }
  };

  // Logout fonksiyonu
  const logout = () => {
    // Cookie'den token'ları sil
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    console.log("Tokens removed from cookies");
    
    // localStorage'dan da sil
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      console.log("Tokens removed from localStorage");
      setUser(null);
    }
    router.push('/login');
  };

  // Role kontrolü
  const hasRole = (role: string) => {
    return user?.roles?.includes(role) || false;
  };

  // Auth durumu - user varsa true, yoksa false
  const isAuthenticated = !!user;

  // Context değeri
  const value = {
    user,
    loading,
    isAuthenticated,
    login: async (data: LoginData) => {
      try {
        const response = await api.post('/auth-service/api/v1/auth/login', data);
        // Login sonrası kullanıcı bilgilerini al
        await fetchUserData();
        return response.data;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    signup: async (data: SignupData) => {
      try {
        const response = await api.post('/auth-service/api/v1/auth/signup', data);
        // Signup sonrası kullanıcı bilgilerini al
        await fetchUserData();
        return response.data;
      } catch (error) {
        console.error('Signup failed:', error);
        throw error;
      }
    },
    logout,
    getGoogleAuthUrl,
    setTokens,
    fetchUserData,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
