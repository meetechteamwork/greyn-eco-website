'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getAuthToken, 
  setAuthTokens, 
  setUserData, 
  getUserData, 
  clearAuthData,
  isTokenValid,
  getUserFromToken 
} from '../utils/jwt';
import { api } from '../utils/api';

type UserRole = 'simple-user' | 'ngo' | 'corporate' | 'carbon' | 'admin';

interface User {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  organizationName?: string;
  companyName?: string;
  contactPerson?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isNGO: boolean;
  isSimpleUser: boolean;
  isCorporate: boolean;
  isCarbon: boolean;
  isAdmin: boolean;
  login: (role: UserRole, credentials: any) => Promise<{ success: boolean; message?: string }>;
  signup: (role: UserRole, data: any) => Promise<{ success: boolean; message?: string; loggedIn?: boolean }>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status from stored token
  const checkAuth = () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      
      if (token && isTokenValid(token)) {
        // Get user from token and stored data
        const tokenUser = getUserFromToken(token);
        const storedUser = getUserData();
        
        if (tokenUser && storedUser) {
          setUser({
            ...storedUser,
            id: tokenUser.userId,
            role: tokenUser.role as UserRole
          });
        } else {
          // Token valid but no user data, clear auth
          clearAuthData();
          setUser(null);
        }
      } else {
        // Token invalid or expired, clear auth data
        clearAuthData();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuthData();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state from stored tokens on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = async (role: UserRole, credentials: any): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      let response;
      
      switch (role) {
        case 'simple-user':
          response = await api.auth.login.simpleUser(credentials);
          break;
        case 'ngo':
          response = await api.auth.login.ngo(credentials);
          break;
        case 'corporate':
          response = await api.auth.login.corporate(credentials);
          break;
        case 'admin':
          response = await api.auth.login.admin(credentials);
          break;
        default:
          return { success: false, message: 'Invalid role' };
      }

      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        
        // Store token and user data
        setAuthTokens(token);
        setUserData(userData);
        
        // Set user in context
        setUser({
          id: userData.id || userData._id || userData.userId,
          name: userData.name || userData.organizationName || userData.companyName || userData.contactPerson,
          email: userData.email,
          role: userData.role || role,
          organizationName: userData.organizationName,
          companyName: userData.companyName,
          contactPerson: userData.contactPerson,
        });

        return { success: true, message: response.message || 'Login successful!' };
      } else {
        return { success: false, message: response.message || 'Login failed. Please check your credentials.' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (role: UserRole, data: any): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      
      let response;
      
      switch (role) {
        case 'simple-user':
          response = await api.auth.signup.simpleUser(data);
          break;
        case 'ngo':
          response = await api.auth.signup.ngo(data);
          break;
        case 'corporate':
          response = await api.auth.signup.corporate(data);
          break;
        case 'admin':
          response = await api.auth.signup.admin(data);
          break;
        default:
          return { success: false, message: 'Invalid role' };
      }

      if (response.success && response.data) {
        // If token is provided (immediate login after signup)
        if (response.data.token) {
          const { token, user: userData } = response.data;
          setAuthTokens(token);
          setUserData(userData);
          
          const newUser = {
            id: userData.id || userData._id || userData.userId,
            name: userData.name || userData.organizationName || userData.companyName || userData.contactPerson,
            email: userData.email,
            role: userData.role || role,
            organizationName: userData.organizationName,
            companyName: userData.companyName,
            contactPerson: userData.contactPerson,
          };
          
          setUser(newUser);
          
          // Return success with loggedIn flag
          return { 
            success: true, 
            message: response.message || 'Registration successful!',
            loggedIn: true 
          };
        }

        // No token (NGO/Corporate - pending approval)
        return { 
          success: true, 
          message: response.message || 'Registration successful!',
          loggedIn: false 
        };
      } else {
        const errorMessage = response.errors 
          ? response.errors.map((e: any) => e.msg || e.message).join(', ')
          : response.message || 'Registration failed';
        
        return { success: false, message: errorMessage };
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, message: error.message || 'An error occurred during registration' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear all auth data first
    clearAuthData();
    setUser(null);
    
    // Force redirect to login page using window.location
    // This ensures a full page reload and clears any cached state
    if (typeof window !== 'undefined') {
      // Use replace to prevent back button from going back to dashboard
      window.location.replace('/auth');
    }
  };

  const isAuthenticated = user !== null && !isLoading;
  const isNGO = user?.role === 'ngo';
  const isSimpleUser = user?.role === 'simple-user';
  const isCorporate = user?.role === 'corporate';
  const isCarbon = user?.role === 'carbon';
  const isAdmin = user?.role === 'admin';

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isNGO,
    isSimpleUser,
    isCorporate,
    isCarbon,
    isAdmin,
    login,
    signup,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

