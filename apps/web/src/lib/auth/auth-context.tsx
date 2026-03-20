'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, AuthSession } from '@doodleshare/shared';
import { api } from '@/lib/api/client';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  login: (email: string, username: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'doodleshare_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setUser(data);
        setIsGuest(data.isGuest ?? false);
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, username: string) => {
    const res = await api.post<AuthSession>('/api/auth/mock-login', { email, username });
    setUser(res.user);
    setIsGuest(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...res.user, isGuest: false }));
  }, []);

  const loginAsGuest = useCallback(async () => {
    const res = await api.post<AuthSession>('/api/auth/guest');
    setUser(res.user);
    setIsGuest(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...res.user, isGuest: true }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isGuest, isLoading, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
