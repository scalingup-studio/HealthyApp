import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthApi } from "./authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    async function initAuth() {
      try {
        console.log('🔄 Attempting auto-authentication with refresh token...');

        // Try to get new authToken using refresh_token cookie
        // If no cookie exists, this will fail and user stays logged out
        const refreshRes = await AuthApi.refreshToken();

        if (refreshRes?.authToken) {
          console.log('✅ Auto-authentication successful');
          setAuthToken(refreshRes.authToken);
          setUser(refreshRes.user ?? null);
        } else {
          console.log('ℹ️ No valid session found');
          setAuthToken(null);
          setUser(null);
        }
      } catch (error) {
        // No valid refresh token = user not authenticated
        console.log('ℹ️ Auto-authentication failed (no valid session):', error.message);
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

  // Manual token refresh function
  const refreshAuth = async () => {
    if (refreshLoading) return null;

    setRefreshLoading(true);
    try {
      console.log('🔄 Manually refreshing auth token...');
      const refreshRes = await AuthApi.refreshToken();

      if (refreshRes?.authToken) {
        console.log('✅ Manual refresh successful');
        setAuthToken(refreshRes.authToken);
        setUser(refreshRes.user ?? null);
        return refreshRes.authToken;
      }

      console.log('❌ Refresh returned no token');
      return null;
    } catch (error) {
      console.error("❌ Manual refresh failed:", error);
      // On failed refresh, clear auth state
      setAuthToken(null);
      setUser(null);
      return null;
    } finally {
      setRefreshLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!authToken && !!user;
  };

  const value = {
    // State
    authToken,
    user,
    loading,
    refreshLoading,

    // Functions
    login,
    logout,
    refreshAuth,
    isAuthenticated,

    // Setters (for manual updates if needed)
    setAuthToken,
    setUser,
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