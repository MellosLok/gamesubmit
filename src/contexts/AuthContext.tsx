import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { tapAuthAPI } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化时检查用户登录状态
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('tap_token');
      if (token) {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to refresh user:', error);
          localStorage.removeItem('tap_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 刷新用户信息
  const refreshUser = async () => {
    try {
      const response = await tapAuthAPI.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
      setUser(null);
    }
  };

  // 登录
  const login = async () => {
    try {
      const response = await tapAuthAPI.login();
      if (response.success && response.data) {
        localStorage.setItem('tap_token', response.data.token);
        setUser(response.data.user);
      } else {
        throw new Error(response.message || '登录失败');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // 登出
  const logout = async () => {
    try {
      await tapAuthAPI.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('tap_token');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 