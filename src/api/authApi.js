// src__api__authApi.js
/**
 * Refactored Authentication API
 * Removed cookie manipulation, simplified logic
 */

import { request } from "./apiClient";
import { CUSTOM_ENDPOINTS } from "./apiConfig";
import { tokenManager } from "./tokenManager";

// Helper function to get IP address
async function getIPAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
}

export const AuthApi = {
  /**
   * Login user
   */
  async login(data) {
    try {
      console.log('🔐 Attempting login for:', data.email);

      const requestData = {
        email: data.email,
        password: data.password,
        user_agent: navigator.userAgent,
        ip_address: await getIPAddress()
      };

      const response = await request(CUSTOM_ENDPOINTS.auth.login, {
        method: "POST",
        body: requestData,
        credentials: "include" // Important: allows backend to set cookies
      });

      if (!response.authToken) {
        throw new Error('No authToken received from server');
      }

      // Store token using token manager
      tokenManager.setToken(response.authToken);

      console.log('✅ Login successful');
      return response;

    } catch (error) {
      console.error('🔴 Login error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      console.log('🚪 Attempting logout...');

      // Call logout endpoint (backend will clear cookies)
      await request(CUSTOM_ENDPOINTS.auth.logout, {
        method: "POST",
        credentials: "include"
      });

      console.log('✅ Logout successful');
    } catch (error) {
      console.error('🔴 Logout error:', error);
      // Continue with local cleanup even if API fails
    } finally {
      // Always clear local token
      tokenManager.clearToken();
    }
  },

  /**
   * Refresh auth token
   * Uses token manager for centralized refresh logic
   */
  async refreshToken() {
    return tokenManager.refreshToken();
  },

  /**
   * Signup new user
   */
  async signup(userData) {
    try {
      console.log('👤 Attempting signup for:', userData.email);

      const requestData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        user_agent: navigator.userAgent,
        ip_address: await getIPAddress()
      };

      const response = await request(CUSTOM_ENDPOINTS.auth.signup, {
        method: "POST",
        body: requestData,
        credentials: "include"
      });

      console.log('✅ Signup successful');
      return response;

    } catch (error) {
      console.error('🔴 Signup error:', error);
      throw error;
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    try {
      console.log('📧 Requesting password reset for:', email);

      const response = await request(CUSTOM_ENDPOINTS.auth.forgotPassword, {
        method: "POST",
        body: { email },
      });

      console.log('✅ Password reset email sent');
      return response;

    } catch (error) {
      console.error('🔴 Password reset request error:', error);
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword({ token, new_password }) {
    try {
      console.log('🔑 Resetting password...');

      const response = await request(CUSTOM_ENDPOINTS.auth.resetPassword, {
        method: "POST",
        body: { token, new_password },
      });

      console.log('✅ Password reset successful');
      return response;

    } catch (error) {
      console.error('🔴 Password reset error:', error);
      throw error;
    }
  },

  /**
   * Get Google OAuth URL
   */
  async getGoogleAuthUrl() {
    try {
      console.log('🔗 Getting Google auth URL...');
      const response = await request(CUSTOM_ENDPOINTS.auth.google);
      console.log('✅ Google auth URL received');
      return response.url;

    } catch (error) {
      console.error('🔴 Google auth URL error:', error);
      throw error;
    }
  },

  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(code) {
    try {
      console.log('🔐 Handling Google callback...');

      const response = await request(
        `${CUSTOM_ENDPOINTS.auth.googleCallback}?code=${code}`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      // Store token if received
      if (response.authToken) {
        tokenManager.setToken(response.authToken);
      }

      console.log('✅ Google callback successful');
      return response;

    } catch (error) {
      console.error('🔴 Google callback error:', error);
      tokenManager.clearToken();
      throw error;
    }
  },

  /**
   * Check auth status (validate token)
   */
  async checkAuth() {
    try {
      const token = tokenManager.getToken();

      if (!token) {
        return { authenticated: false };
      }

      // Check if token is expired
      if (tokenManager.isTokenExpired(token)) {
        console.log('Token expired, attempting refresh...');
        const refreshResult = await this.refreshToken();
        return {
          authenticated: true,
          user: refreshResult.user,
        };
      }

      return { authenticated: true };

    } catch (error) {
      console.error('Auth check failed:', error);
      return { authenticated: false };
    }
  },
};

export default AuthApi;
