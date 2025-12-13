'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'simple-user' | 'engo';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isENGO: boolean;
  isSimpleUser: boolean;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ============================================================
  // MANUAL ROLE SWITCHING - Change this value to test roles
  // ============================================================
  // Options: 'simple-user' or 'engo'
  const INITIAL_ROLE: UserRole = 'engo'; // Change to 'engo' to test ENGO role
  
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: INITIAL_ROLE
  });

  const isAuthenticated = user !== null;
  const isENGO = user?.role === 'engo';
  const isSimpleUser = user?.role === 'simple-user';

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role
      });
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    isAuthenticated,
    isENGO,
    isSimpleUser,
    switchRole
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

