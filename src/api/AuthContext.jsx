import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthApi } from "./authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);

  // ✅ We move refreshAuth to useCallback for link stability
  const refreshAuth = useCallback(async () => {
    if (refreshLoading) return null;

    setRefreshLoading(true);
    try {
      // console.log('🔄 Manually refreshing auth token...');
      const refreshRes = await AuthApi.refreshToken();
      // console.log('🔄 Manually refreshing auth token... completed, token = ', JSON.stringify(refreshRes))
      if (refreshRes?.authToken) {
        // console.log('✅ Manual refresh successful');
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
  }, [refreshLoading]);

  useEffect(() => {
    async function initAuth() {
      try {
        console.log('🔄 Attempting auto-authentication with refresh token...');
  
        const refreshRes = await AuthApi.refreshToken();
        console.log('✅ Auto-authentication successful:', refreshRes);
  
        if (refreshRes?.authToken) {
          setAuthToken(refreshRes.authToken);
          setUser(refreshRes.user ?? null);
        } else {
          console.log('ℹ️ No valid session found');
          setAuthToken(null);
          setUser(null);
        }
      } catch (error) {
        if (error.message?.includes('expired') || error.message?.includes('Invalid')) {
          console.log('🔄 Refresh token expired or invalid, clearing session');
          // Automatically clear expired tokens
          await AuthApi.logout().catch(() => {}); // Ignore logout errors
        } else {
          console.log('ℹ️ Auto-authentication failed:', error.message);
        }
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
  
    initAuth();
  }, []);

  // ✅ Function to automatically renew the token before expiration
  useEffect(() => {
    if (!authToken) return;

   // Function to calculate time to update
    const calculateRefreshTime = () => {
      try {
       // Parse the JWT token to get the expiration time
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        const expiresAt = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;
        
       // Update 10 minutes before the end, but no less than 1 minute later
        const refreshTime = Math.max(
          60 * 1000, // Мінімум 1 хвилина
          timeUntilExpiry - (10 * 60 * 1000)// 10 minutes to go
        );
        
        console.log(`🕒 Token expires at: ${new Date(expiresAt).toLocaleTimeString()}`);
        console.log(`🕒 Will refresh in: ${Math.round(refreshTime / 1000 / 60)} minutes`);
        
        return refreshTime;
      } catch (error) {
        console.error('🔴 Error parsing token, using default refresh time');
       // If the token could not be parsed, we use the default value
        return 10 * 60 * 1000; // 10 minutes
      }
    };

    const refreshTime = calculateRefreshTime();

    const refreshTimer = setTimeout(async () => {
      try {
        console.log('🔄 Auto-refreshing token before expiration...');
        const newTokens = await refreshAuth();
        if (newTokens) {
          console.log('✅ Token auto-refreshed successfully');
        }
      } catch (error) {
        console.log('🔴 Auto-refresh failed:', error.message);
        // We don't clear the state here - the user can still use the current token
        // until it actually expires
      }
    }, refreshTime);

    return () => {
      console.log('🧹 Cleaning up auto-refresh timer');
      clearTimeout(refreshTimer);
    };
  }, [authToken, refreshAuth]); // ✅ Now refreshAuth is a stable link

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

  // ✅ Added a function to complete onboarding
  async function completeOnboarding(status = "completed") {
    try {
      console.log('🎯 Completing onboarding with status:', status);
      
     // Update the user's state
      setUser(prev => ({
        ...prev,
        onboarding_completed: true,
        onboarding_status: status
      }));
      // Here you can add an API call to update on the server if needed
// await AuthApi.updateOnboardingStatus({ onboarding_completed: true });
      
      console.log('✅ Onboarding marked as completed in AuthContext');
      return { success: true };
    } catch (error) {
      console.error("Error completing onboarding:", error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!authToken && !!user;
  };

  // ✅ Added a function to check onboarding status
  const hasCompletedOnboarding = () => {
    return user?.completed === true || user?.onboarding_completed === true;
  };

  // ✅ Added a function to check if the token will expire soon
  const isTokenExpiringSoon = () => {
    if (!authToken) return false;
    
    try {
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      const expiresAt = payload.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      
     // We assume that the token will expire soon if there are less than 15 minutes left
      return timeUntilExpiry < (15 * 60 * 1000);
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; // If the check fails, we assume it will expire
    }
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
    completeOnboarding,
    hasCompletedOnboarding, 
    isTokenExpiringSoon, 

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