// src__api__AuthContext.jsx
/**
 * Refactored Auth Context
 * Simplified with token manager integration
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthApi } from "./authApi.js";
import { tokenManager } from "./tokenManager.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize auth on mount
   */
  useEffect(() => {
    async function initAuth() {
      try {
        console.log('🔄 Initializing authentication...');

        // Try to get existing token
        const existingToken = tokenManager.getToken();

        if (!existingToken) {
          console.log('ℹ️ No existing token found');
          setLoading(false);
          return;
        }

        // Check if token is expired
        if (tokenManager.isTokenExpired(existingToken)) {
          console.log('🔄 Token expired, attempting refresh...');

          try {
            const refreshResult = await tokenManager.refreshToken();
            setAuthToken(refreshResult.authToken);
            setUser(refreshResult.user ?? null);
            console.log('✅ Auto-authentication successful');
          } catch (refreshError) {
            console.log('❌ Auto-refresh failed:', refreshError.message);
            // Clear invalid token
            tokenManager.clearToken();
            setAuthToken(null);
            setUser(null);
          }
        } else {
          // Token is valid
          setAuthToken(existingToken);
          console.log('✅ Valid token found');

          // Optionally fetch user data here if not in token
          // For now, we'll set user from token payload
          const payload = tokenManager.parseToken(existingToken);
          if (payload) {
            setUser({
              id: payload.user_id || payload.sub || payload.id,
              email: payload.email,
              ...payload,
            });
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  /**
   * Login function
   */
  const login = useCallback(async (email, password) => {
    try {
      console.log('🔐 Logging in...');
      const res = await AuthApi.login({ email, password });

      setAuthToken(res.authToken);
      setUser(res.user ?? null);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.message || "Login failed"
      };
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
  async function signup(email, password, userData = {}) {
    try {
      console.log('📝 Starting signup process...');
      const res = await AuthApi.signup({ email, password, ...userData });
      console.log('📝 AuthApi.signup response:', res);

      setAuthToken(res.authToken);
      setUser(res.user ?? null);
      setIsNewUser(true); // This is a signup, new user

      console.log('📝 New user signed up successfully - will redirect to onboarding');
      console.log('🎯 Signup redirect: Onboarding (new user)');
      console.log('📝 isNewUser set to:', true);

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
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
  }, []);

  /**
   * Refresh auth token
   */
  const refreshAuth = useCallback(async () => {
    try {
      console.log('🔄 Manually refreshing auth token...');
      const refreshRes = await tokenManager.refreshToken();

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
      setAuthToken(null);
      setUser(null);
      return null;
    }
  }, []);

  /**
   * Complete onboarding
   */
  const completeOnboarding = useCallback(async (status = "completed") => {
    try {
      console.log('🎯 Completing onboarding with status:', status);

      // Update user state locally
      setUser(prev => ({
        ...prev,
        onboarding_completed: true,
        onboarding_status: status,
        completed: true,
        save_onboarding: {
          ...prev.save_onboarding,
          onboarding_completed: true,
          current_step: "completed",
          progress: {
            ...prev.save_onboarding?.progress,
            percentage: 100
          },
          completed_at: new Date().toISOString()
        }
      }));

      console.log('✅ Onboarding marked as completed');
      return { success: true };
    } catch (error) {
      console.error("Error completing onboarding:", error);
      return { success: false, error: error.message };
    }
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback(() => {
  // ✅ Added a function to load onboarding data from API
  async function loadOnboardingData() {
    try {
      console.log('📊 Loading onboarding data from API...');

      // Import OnboardingApi dynamically to avoid circular dependency
      const { OnboardingApi } = await import('./onboardingApi.js');

      if (!user?.id) {
        console.log('⚠️ No user ID available for loading onboarding data');
        return { success: false, error: 'No user ID' };
      }

      const onboardingData = await OnboardingApi.getProgress(user.id);
      console.log('📊 Onboarding data loaded:', onboardingData);

      // Update user state with onboarding data
      setUser(prev => ({
        ...prev,
        save_onboarding: onboardingData?.save_onboarding || prev.save_onboarding
      }));

      return { success: true, data: onboardingData };
    } catch (error) {
      console.error('Error loading onboarding data:', error);
      return { success: false, error: error.message };
    }
  }

  // ✅ Added a function to reset onboarding status (for testing)
  async function resetOnboarding() {
    try {
      console.log('🔄 Resetting onboarding status...');

     // Update the user's state with both old and new structure
      setUser(prev => ({
        ...prev,
        onboarding_completed: false,
        completed: false,
        onboarding_status: "not_started",
        save_onboarding: {
          ...prev.save_onboarding,
          onboarding_completed: false,
          current_step: "personal",
          progress: {
            ...prev.save_onboarding?.progress,
            percentage: 0
          }
        }
      }));

      console.log('✅ Onboarding status reset in AuthContext');
      return { success: true };
    } catch (error) {
      console.error("Error resetting onboarding:", error);
      return { success: false, error: error.message };
    }
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!authToken && !!user;
  }, [authToken, user]);

  /**
   * Check if user has completed onboarding
   */
  const hasCompletedOnboarding = useCallback(() => {
    return user?.completed === true || user?.onboarding_completed === true;
  }, [user]);

  /**
   * Check if token is expiring soon
   */
  const isTokenExpiringSoon = useCallback(() => {
    if (!authToken) return false;

    const timeUntilExpiry = tokenManager.getTimeUntilExpiry(authToken);
    // Consider "soon" as less than 15 minutes
    return timeUntilExpiry < (15 * 60 * 1000);
  }, [authToken]);

  const value = {
    // State
    authToken,
    user,
    loading,

    // Functions
    login,
    signup,
    logout,
    refreshAuth,
    isAuthenticated,
    completeOnboarding,
    resetOnboarding,
    loadOnboardingData,
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
