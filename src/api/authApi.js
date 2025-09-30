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

  requestPasswordReset: (email) => request(CUSTOM_ENDPOINTS.auth.forgotPassword, {
    method: "POST",
    body: { email },
  }),

  resetPassword: ({ token, new_password }) => request(CUSTOM_ENDPOINTS.auth.resetPassword, {
    method: "POST",
    body: { token, new_password },
  }),

  // Google OAuth
  // getGoogleAuthUrl: () => CUSTOM_ENDPOINTS.auth.google,

  getGoogleAuthUrl: async () => {
    const response = await request(CUSTOM_ENDPOINTS.auth.google);
    return response.url; // Extract the URL from JSON
  },


  handleGoogleCallback: (queryString) => request(`${CUSTOM_ENDPOINTS.auth.googleCallback}?${queryString}`),
};