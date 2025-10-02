export const API_BASE = "https://xu6p-ejbd-2ew4.n7e.xano.io/api:5PA_dIPO";
export const API_BASE_AUTH = "https://xu6p-ejbd-2ew4.n7e.xano.io/api:HBbbpjK5";

// CRUD helper
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
  users: crud("users"),
  userSettings: crud("user_settings"),
  goals: crud("goals"),
  healthData: crud("health_data"),
  profiles: crud("profiles"),
};

export const CUSTOM_ENDPOINTS = {
  auth: {
    login: `${API_BASE_AUTH}/auth/login`,
    logout: `${API_BASE_AUTH}/auth/logout`,
    refreshToken: `${API_BASE_AUTH}/auth/refresh`,
    signup: `${API_BASE_AUTH}/auth/signup`,
    forgotPassword: `${API_BASE_AUTH}/auth/forgot-password`,
    resetPassword: `${API_BASE_AUTH}/auth/reset-password`,
    google: `${API_BASE_AUTH}/auth/google`,
    googleCallback: `${API_BASE_AUTH}/auth/callback/google`,
    googleCallback: `${API_BASE_AUTH}/auth/success`,
    checkAuth: `${API_BASE_AUTH}/auth/check-auth`, // якщо бек підтримує
  },
  onboarding: {
    step: (step) => `${API_BASE}/onboarding/${step}`,
  },
};

