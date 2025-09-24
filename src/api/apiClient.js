import { API_BASE } from './apiConfig'; // Імпортуємо з apiConfig

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const request = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.message || 'Request failed', response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network error', 0, null);
  }
};

export const authRequest = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    ...options,
  };

  return request(url, config);
};