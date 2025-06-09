import api from '@/utils/api';
import { jwtDecode } from 'jwt-decode';

export interface SignupData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    imageUrl?: string;
    roles: string[];
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface JwtPayload {
    sub: string;
    email: string;
    roles: string[];
    exp: number;
}

export const authService = {
    async signup(data: SignupData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/signup', data);
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data;
    },

    async googleLogin(idToken: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/google/login', { idToken });
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data;
    },

    async getGoogleAuthUrl(): Promise<string> {
        const response = await api.get<string>('/oauth2/google/url');
        return response.data;
    },

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/refresh-token', refreshToken);
        this.setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data;
    },

    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    },

    setTokens(accessToken: string, refreshToken: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        }
    },

    getAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken');
        }
        return null;
    },

    getRefreshToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('refreshToken');
        }
        return null;
    },

    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        if (!token) return false;

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },

    getUserFromToken(): User | null {
        const token = this.getAccessToken();
        if (!token) return null;

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return {
                id: parseInt(decoded.sub),
                email: decoded.email,
                name: '',
                roles: decoded.roles || ['USER']
            };
        } catch {
            return null;
        }
    },

    hasRole(role: string): boolean {
        const user = this.getUserFromToken();
        return user?.roles.includes(role) || false;
    }
};
