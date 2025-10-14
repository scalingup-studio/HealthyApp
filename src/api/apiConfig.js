export const API_BASE = "https://xu6p-ejbd-2ew4.n7e.xano.io/api:5PA_dIPO";
export const API_BASE_AUTH = "https://xu6p-ejbd-2ew4.n7e.xano.io/api:HBbbpjK5";
export const API_DOMEN_DEV = "https://xu6p-ejbd-2ew4.n7e.xano.io";

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
  healthHistory: crud("health_history"),
  medicalConditions: crud("medical_conditions"),
  medications: crud("medications"),
  allergies: crud("allergies"),
  surgicalHistory: crud("surgical_history"),
  vaccinations: crud("vaccinations"),
  sensitivities: crud("sensitivities"),
  familyHistory: crud("family_history"),
  healthData: crud("health_data"),
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
    checkAuth: `${API_BASE_AUTH}/auth/check-auth`,
  },
  onboarding: {
    step: (step) => `${API_BASE}/onboarding/${step}`,
  },
  healthHistory: {
    getHealthHistorySummary: `${API_BASE}/health_history_summary`
  }, 
  insights: {
    generateInsights: `${API_BASE}/generate-insight`
  },
  checkThreshold: {
    checkThreshold: `${API_BASE}/check-threshold`
  },
  checkQuery: {
    checkQuery: `${API_BASE}/check_query`
  },
  alertsInsight: {
    getAlertsInsight: `${API_BASE}/alerts_ai/{user_id}`
  },
  uploudFile: {
    uploudFile: `${API_BASE}/upload/attachment_file`,
    getUserUploudFiles: `${API_BASE}/upload/get_files`,
    downloadFile: `${API_BASE}/upload/download_file`,
    deleteFile: `${API_BASE}/upload/delete_file`
  },
};