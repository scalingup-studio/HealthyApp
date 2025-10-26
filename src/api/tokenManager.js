// src__api__tokenManager.js
/**
 * Centralized Token Manager
 * Single source of truth for token refresh logic
 * Prevents race conditions and duplicate refresh requests
 */

import { CUSTOM_ENDPOINTS } from "./apiConfig";

class TokenManager {
    constructor() {
        this.refreshPromise = null;
        this.authToken = null;
        this.tokenExpiryTimer = null;
    }

    /**
     * Get current auth token from localStorage
     */
    getToken() {
        if (this.authToken) return this.authToken;

        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                this.authToken = token;
                return token;
            }
        } catch (error) {
            console.error('Failed to get token from localStorage:', error);
        }
        return null;
    }

    /**
     * Store auth token
     */
    setToken(token) {
        if (!token) {
            this.clearToken();
            return;
        }

        try {
            this.authToken = token;
            localStorage.setItem('authToken', token);
            this.scheduleTokenRefresh(token);
        } catch (error) {
            console.error('Failed to store token:', error);
        }
    }

    /**
     * Clear auth token
     */
    clearToken() {
        this.authToken = null;
        this.refreshPromise = null;

        if (this.tokenExpiryTimer) {
            clearTimeout(this.tokenExpiryTimer);
            this.tokenExpiryTimer = null;
        }

        try {
            localStorage.removeItem('authToken');
        } catch (error) {
            console.error('Failed to clear token:', error);
        }
    }

    /**
     * Parse JWT token to get payload
     */
    parseToken(token) {
        console.log(token);
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Failed to parse token:', error);
            return null;
        }
    }

    /**
     * Check if token is expired
     */
    isTokenExpired(token) {
        const payload = this.parseToken(token);
        if (!payload || !payload.exp) return true;

        const now = Math.floor(Date.now() / 1000);
        return payload.exp <= now;
    }

    /**
     * Get time until token expires (in milliseconds)
     */
    getTimeUntilExpiry(token) {
        const payload = this.parseToken(token);
        if (!payload || !payload.exp) return 0;

        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = payload.exp - now;
        return timeUntilExpiry * 1000; // Convert to milliseconds
    }

    /**
     * Schedule automatic token refresh before expiry
     */
    scheduleTokenRefresh(token) {
        // Clear existing timer
        if (this.tokenExpiryTimer) {
            clearTimeout(this.tokenExpiryTimer);
            this.tokenExpiryTimer = null;
        }

        // If token is already expired, don't schedule
        if (this.isTokenExpired(token)) {
            console.warn('Token is already expired, not scheduling refresh');
            return;
        }

        const timeUntilExpiry = this.getTimeUntilExpiry(token);

        // Refresh 5 minutes before expiry, or at 80% of token lifetime
        const refreshTime = Math.min(
            Math.max(timeUntilExpiry * 0.8, 60000), // At least 1 minute
            timeUntilExpiry - (5 * 60 * 1000) // 5 minutes before expiry
        );

        console.log(`🕐 Token refresh scheduled in ${Math.round(refreshTime / 1000 / 60)} minutes`);

        this.tokenExpiryTimer = setTimeout(() => {
            console.log('🔄 Auto-refreshing token...');
            this.refreshToken()
                .catch(error => {
                    console.error('Auto-refresh failed:', error);
                    // Will be handled by auth context
                });
        }, refreshTime);
    }

    /**
     * Refresh auth token
     * Ensures only one refresh happens at a time
     */
    async refreshToken() {
        // If refresh is already in progress, return the existing promise
        if (this.refreshPromise) {
            console.log('⏳ Refresh already in progress, waiting...');
            return this.refreshPromise;
        }

        console.log('🔄 Starting token refresh...');

        this.refreshPromise = this._performRefresh()
            .finally(() => {
                // Clear the promise after completion (success or failure)
                this.refreshPromise = null;
            });

        return this.refreshPromise;
    }

    /**
     * Internal method to perform the actual refresh
     */
    async _performRefresh() {
        try {
            // Get user agent and IP for security logging
            const user_agent = navigator.userAgent;
            let ip_address = 'unknown';

            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                ip_address = ipData.ip;
            } catch (ipError) {
                console.warn('Could not get IP address:', ipError);
            }

            // Call refresh endpoint (cookie is sent automatically)
            const response = await fetch(CUSTOM_ENDPOINTS.auth.refreshToken, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important: sends HTTP-only cookie
                body: JSON.stringify({
                    user_agent,
                    ip_address,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Refresh failed: ${response.status} ${errorText}`);
            }

            const data = await response.json();

            if (!data.authToken) {
                throw new Error('No authToken in refresh response');
            }

            // Store new token
            this.setToken(data.authToken);

            console.log('✅ Token refreshed successfully');

            return {
                authToken: data.authToken,
                user: data.user || null,
            };
        } catch (error) {
            console.error('❌ Token refresh failed:', error);

            // Clear token on refresh failure
            this.clearToken();

            throw error;
        }
    }

    /**
     * Validate current token and refresh if needed
     */
    async ensureValidToken() {
        const token = this.getToken();

        if (!token) {
            throw new Error('No token available');
        }

        // If token is expired, refresh it
        if (this.isTokenExpired(token)) {
            console.log('Token expired, refreshing...');
            const result = await this.refreshToken();
            return result.authToken;
        }

        // If token expires in less than 1 minute, refresh it
        const timeUntilExpiry = this.getTimeUntilExpiry(token);
        if (timeUntilExpiry < 60000) {
            console.log('Token expiring soon, refreshing...');
            const result = await this.refreshToken();
            return result.authToken;
        }

        return token;
    }
}

// Export singleton instance
export const tokenManager = new TokenManager();

// Export class for testing
export { TokenManager };
