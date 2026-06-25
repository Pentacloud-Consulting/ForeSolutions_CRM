'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CREDENTIALS = { username: 'pentahouse', password: 'Penta@2026' };

const roleUsers: Record<UserRole, User> = {
  admin: { username: 'pentahouse', role: 'admin', displayName: 'Admin User' },
  sales: { username: 'pentahouse', role: 'sales', displayName: 'Sales Team' },
  project_manager: { username: 'pentahouse', role: 'project_manager', displayName: 'Project Manager' },
  accountant: { username: 'pentahouse', role: 'accountant', displayName: 'Accountant' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('pentahouse_auth');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('pentahouse_auth');
      }
    }
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      const u = roleUsers.admin;
      setUser(u);
      localStorage.setItem('pentahouse_auth', JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('pentahouse_auth');
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    const u = roleUsers[role];
    setUser(u);
    localStorage.setItem('pentahouse_auth', JSON.stringify(u));
  }, []);

  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
