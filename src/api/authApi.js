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
};