import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthApi } from "./authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Функція для перевірки наявності refresh_token cookie
  const hasRefreshToken = () => {
    const cookies = document.cookie;
    return cookies.includes('refresh_token=');
  };

  useEffect(() => {
    async function initAuth() {
      // Перевіряємо чи взагалі є refresh_token перед запитом
      if (!hasRefreshToken()) {
        console.log("No refresh token found - user not authenticated");
        setLoading(false);
        return;
      }

      try {
        // 🔄 Спершу пробуємо отримати новий токен через refresh
        const refreshRes = await AuthApi.refreshToken();
        
        if (refreshRes?.authToken) {
          setAuthToken(refreshRes.authToken);
          setUser(refreshRes.user ?? null);
        } else {
          // Якщо refresh не вдався, користувач не авторизований
          setAuthToken(null);
          setUser(null);
        }
      } catch (error) {
        // Будь-яка помилка = не авторизований
        console.log("Auto-authentication failed:", error.message);
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    
    initAuth();
  }, []);

  async function login(email, password) {
    try {
      const res = await AuthApi.login({ email, password });
      // ✅ Правильні назви полів з бекенду
      setAuthToken(res.authToken);
      setUser(res.user ?? null);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  }

  async function logout() {
    try {
      await AuthApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  }

  // Функція для ручного оновлення токена
  const refreshAuth = async () => {
    if (refreshLoading) return null;
    
    setRefreshLoading(true);
    try {
      const refreshRes = await AuthApi.refreshToken();
      if (refreshRes?.authToken) {
        setAuthToken(refreshRes.authToken);
        setUser(refreshRes.user ?? null);
        return refreshRes.authToken;
      }
      return null;
    } catch (error) {
      console.error("Manual refresh failed:", error);
      // При неуспішному refresh - розлогінюємо
      setAuthToken(null);
      setUser(null);
      return null;
    } finally {
      setRefreshLoading(false);
    }
  };

  // Функція для перевірки чи авторизований користувач
  const isAuthenticated = () => {
    return !!authToken && !!user;
  };

  const value = {
    // Стан
    authToken,
    user,
    loading,
    refreshLoading,
    
    // Функції
    login,
    logout,
    refreshAuth,
    isAuthenticated,
    
    // Сетери
    setAuthToken,
    setUser,
    
    // Утиліти
    hasRefreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}