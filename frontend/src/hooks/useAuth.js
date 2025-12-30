import { useState, useEffect } from 'react';
import { AUTH_CHANGED_EVENT, emitAuthChanged } from './AuthEvents';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserInfo(null);
        setLoading(false);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUserRole(null);
          setUserInfo(null);
        } else {
          setIsAuthenticated(true);
          setUserRole(payload.role || 'USER');
          setUserInfo({
            userId: payload.userId,
            email: payload.email,
            role: payload.role || 'USER',
            username: payload.username,
          });
        }
      } catch (e) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
        setUserInfo(null);
      }

      setLoading(false);
    };

    checkAuth();

    const handleAuthChanged = () => {
      checkAuth();
    };

    const handleStorage = (event) => {
      if (event.key === 'token') {
        checkAuth();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
      window.addEventListener('storage', handleStorage);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
        window.removeEventListener('storage', handleStorage);
      }
    };
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    emitAuthChanged();
  };

  const logout = () => {
    localStorage.removeItem('token');
    emitAuthChanged();
  };

    return {
      isAuthenticated,
      loading,
      userRole,
      userInfo,
      login,
      logout,
    };
  };

