import { request } from "./apiClient";
import { CUSTOM_ENDPOINTS } from "./apiConfig";

export const AuthApi = {
  login: (data) => request(CUSTOM_ENDPOINTS.auth.login, {
    method: "POST",
    body: JSON.stringify(data),
  }),

  logout: () => request(CUSTOM_ENDPOINTS.auth.logout, {
    method: "POST"
  }),

  refreshToken: () => request(CUSTOM_ENDPOINTS.auth.refreshToken),

  signup: (userData) => request(CUSTOM_ENDPOINTS.auth.signup, {
    method: "POST",
    body: JSON.stringify(userData),
  }),

  // 🔴 ВИПРАВИТИ: додати JSON.stringify
  requestPasswordReset: (email) => request(CUSTOM_ENDPOINTS.auth.forgotPassword, {
    method: "POST",
    body: JSON.stringify({ email }), // 🟢 Виправлено
  }),

  // 🔴 ВИПРАВИТИ: додати JSON.stringify
  resetPassword: ({ token, new_password }) => request(CUSTOM_ENDPOINTS.auth.resetPassword, {
    method: "POST",
    body: JSON.stringify({ token, new_password }), // 🟢 Виправлено
  }),

  // Google OAuth
  getGoogleAuthUrl: async () => {
    const response = await request(CUSTOM_ENDPOINTS.auth.google);
    return response.url;
  },

  handleGoogleCallback: (queryString) => request(`${CUSTOM_ENDPOINTS.auth.googleCallback}?${queryString}`),

  // 🟢 ДОДАТИ: метод для перевірки автентифікації
  checkAuth: () => request(`${CUSTOM_ENDPOINTS.auth.checkAuth}`),
};