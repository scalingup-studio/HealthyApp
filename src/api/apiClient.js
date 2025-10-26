// src__api__apiClient.js
/**
 * Refactored API Client
 * Simplified with centralized token management
 */

import { tokenManager } from "./tokenManager";

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

/**
 * Base request function (no auth)
 */
export const request = async (url, options = {}) => {
  const isFormData = options?.body instanceof FormData;

  const config = {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    ...options,
  };

  // Serialize body if it's an object and not FormData
  if (config.body && typeof config.body === "object" && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new ApiError(
        "Network error: Unable to connect to server",
        0,
        { networkError: true }
      );
    }

    throw new ApiError(error.message || "Unknown error occurred", 0, null);
  }
};

/**
 * Authenticated request function
 * Automatically handles token refresh on 401 errors
 */
export const authRequest = async (url, options = {}, retry = true) => {
  const isFormData = options?.body instanceof FormData;

  const config = {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    credentials: "include", // Important: sends cookies
    ...options,
  };

  // Add auth token to headers
  try {
    const token = await tokenManager.ensureValidToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (tokenError) {
    // If we can't get a valid token, this will be caught as 401 below
    console.warn('Could not ensure valid token:', tokenError);
  }

  // Serialize body if needed
  if (config.body && typeof config.body === "object" && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // Handle 401 (Unauthorized) - token expired or invalid
    if (response.status === 401 && retry) {
      console.log('🔐 401 Unauthorized - attempting token refresh...');

      try {
        // Refresh token
        const refreshResult = await tokenManager.refreshToken();

        if (!refreshResult.authToken) {
          throw new Error('No token received from refresh');
        }

        // Retry request with new token
        console.log('🔄 Retrying request with new token...');
        config.headers["Authorization"] = `Bearer ${refreshResult.authToken}`;

        const retryResponse = await fetch(url, config);
        return await handleResponse(retryResponse);

      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);

        // Clear token and throw auth error
        tokenManager.clearToken();

        throw new ApiError(
          "Session expired. Please login again.",
          401,
          { authError: true }
        );
      }
    }

    return await handleResponse(response);

  } catch (error) {
    if (error instanceof ApiError) throw error;

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new ApiError(
        "Network error: Unable to connect to server",
        0,
        { networkError: true }
      );
    }

    throw new ApiError(error.message || "Unknown error occurred", 0, null);
  }
};

/**
 * Handle response parsing and error checking
 */
async function handleResponse(response) {
  let data = null;
  const contentType = response.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : null;
    }
  } catch (parseError) {
    console.warn("Failed to parse response:", parseError);
    data = { message: "Failed to parse response" };
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}`,
      response.status,
      data
    );
  }

  return data ?? {};
}

/**
 * API client with helper methods
 */
export const apiClient = {
  // Core methods
  request,
  authRequest,

  // GET requests
  get: (url, options = {}) => request(url, { ...options, method: 'GET' }),
  authGet: (url, options = {}) => authRequest(url, { ...options, method: 'GET' }),

  // POST requests
  post: (url, data, options = {}) => request(url, {
    ...options,
    method: 'POST',
    body: data
  }),
  authPost: (url, data, options = {}) => authRequest(url, {
    ...options,
    method: 'POST',
    body: data
  }),

  // PUT requests
  put: (url, data, options = {}) => request(url, {
    ...options,
    method: 'PUT',
    body: data
  }),
  authPut: (url, data, options = {}) => authRequest(url, {
    ...options,
    method: 'PUT',
    body: data
  }),

  // PATCH requests
  patch: (url, data, options = {}) => request(url, {
    ...options,
    method: 'PATCH',
    body: data
  }),
  authPatch: (url, data, options = {}) => authRequest(url, {
    ...options,
    method: 'PATCH',
    body: data
  }),

  // DELETE requests
  delete: (url, options = {}) => request(url, { ...options, method: 'DELETE' }),
  authDelete: (url, options = {}) => authRequest(url, { ...options, method: 'DELETE' }),
};

export default apiClient;
