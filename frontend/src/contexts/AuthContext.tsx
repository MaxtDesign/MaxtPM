import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { AuthUser, ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest } from '../../../shared/src/types/auth';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => void;
    logoutAll: () => Promise<void>;
    forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
    resetPassword: (data: ResetPasswordRequest) => Promise<void>;
    changePassword: (data: ChangePasswordRequest) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const isAuthenticated = !!user;

    // Check if token is expired
    const isTokenExpired = (token: string): boolean => {
        try {
            const decoded = jwtDecode(token) as any;
            return decoded.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    };

    // Initialize auth state on app load
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const refreshToken = localStorage.getItem('refreshToken');
                const storedUser = localStorage.getItem('user');

                if (!accessToken || !refreshToken || !storedUser) {
                    setIsLoading(false);
                    return;
                }

                // Check if access token is expired
                if (isTokenExpired(accessToken)) {
                    // Try to refresh the token
                    try {
                        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                            refreshToken,
                        });

                        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

                        localStorage.setItem('accessToken', newAccessToken);
                        localStorage.setItem('refreshToken', newRefreshToken);

                        // Get fresh user data
                        const userResponse = await api.get('/auth/me');
                        const userData = userResponse.data.data.user;

                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                    } catch (refreshError) {
                        // Refresh failed, clear storage
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                    }
                } else {
                    // Token is valid, set user from storage
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginRequest): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/login', credentials);

            const { user: userData, tokens } = response.data.data;

            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            toast.success('Login successful!');
            navigate('/');
        } catch (error: any) {
            const message = error.response?.data?.error?.message || 'Login failed. Please try again.';
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: RegisterRequest): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/register', userData);

            const { user: newUser, tokens } = response.data.data;

            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            localStorage.setItem('user', JSON.stringify(newUser));

            setUser(newUser);
            toast.success('Registration successful! Welcome to PropEase!');
            navigate('/');
        } catch (error: any) {
            const message = error.response?.data?.error?.message || 'Registration failed. Please try again.';
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const logoutAll = async (): Promise<void> => {
        try {
            await api.post('/auth/logout-all');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
            toast.success('Logged out from all devices successfully');
        } catch (error: any) {
            const message = error.response?.data?.error?.message || 'Failed to logout from all devices';
            toast.error(message);
            throw error;
        }
    };

    const forgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
        try {
            setIsLoading(true);
            await api.post('/auth/forgot-password', data);
            toast.success('If an account with that email exists, a password reset link has been sent.');
        } catch (error: any) {
            const message = error.response?.data?.error?.message || 'Failed to send password reset email';
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
        try {
            setIsLoading(true);
            await api.post('/auth/reset-password', data);
            toast.success('Password reset successfully! You can now log in with your new password.');
            navigate('/login');
        } catch (error: any) {
            const message = error.response?.data?.error?.message || 'Failed to reset password';
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
        try {
            setIsLoading(true);
            await api.post('/auth/change-password', data);
            toast.success('Password changed successfully! Please log in again.');
            logout();
        } catch (error: any) {
            const message = error.response?.data?.error?.message || 'Failed to change password';
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUser = async (): Promise<void> => {
        try {
            const response = await api.get('/auth/me');
            const userData = response.data.data.user;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            logout();
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        logoutAll,
        forgotPassword,
        resetPassword,
        changePassword,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
