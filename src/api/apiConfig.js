export const API_BASE = process.env.REACT_APP_API_BASE || "https://xu6p-ejbd-2ew4.n7e.xano.io/api:5PA_dIPO";

// Function to create CRUD endpoints
function crud(table) {
  return {
    getAll: `${API_BASE}/${table}`,
    getById: (id) => `${API_BASE}/${table}/${id}`,
    create: `${API_BASE}/${table}`,
    update: (id) => `${API_BASE}/${table}/${id}`,
    remove: (id) => `${API_BASE}/${table}/${id}`,
  };
}

export const ENDPOINTS = {
  // Everyone uses {user_id}
  users: crud("users"),
  userSettings: crud("user_settings"),
  goals: crud("goals"),
  healthData: crud("health_data"),
  profiles: crud("profiles"),
};

export const CUSTOM_ENDPOINTS = {
  auth: {
    login: `${API_BASE}/auth/login`,
    logout: `${API_BASE}/auth/logout`,
    refreshToken: `${API_BASE}/auth/refresh`,
    signup: `${API_BASE}/auth/signup`,
  },
};