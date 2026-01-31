/**
 * Professional JWT Token Management Utility
 * Handles token storage, validation, and refresh operations
 */

const TOKEN_KEY = 'greyn_auth_token';
const REFRESH_TOKEN_KEY = 'greyn_refresh_token';
const USER_KEY = 'greyn_user_data';

interface TokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Decode JWT token without verification (for client-side checks only)
 * Note: Always verify tokens on the backend
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Check if token is valid (exists and not expired)
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  return !isTokenExpired(token);
};

/**
 * Get stored authentication token
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store authentication tokens
 */
export const setAuthTokens = (token: string, refreshToken?: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Store user data
 */
export const setUserData = (userData: any): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

/**
 * Get stored user data
 */
export const getUserData = (): any | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getAuthToken();
  if (!token || !isTokenValid(token)) {
    return {};
  }
  
  return {
    Authorization: `Bearer ${token}`
  };
};

/**
 * Extract user info from token
 */
export const getUserFromToken = (token: string): { userId: string; role: string } | null => {
  const payload = decodeToken(token);
  if (!payload) return null;
  
  return {
    userId: payload.userId,
    role: payload.role
  };
};

/**
 * Check if user has valid session
 */
export const hasValidSession = (): boolean => {
  const token = getAuthToken();
  return isTokenValid(token);
};
