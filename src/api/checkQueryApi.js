import { authRequest } from "./apiClient";
import { API_BASE } from "./apiConfig";

export const CheckQueryApi = {
  /**
   * Validate user query for safety and medical appropriateness
   * @param {string} query - User's query to validate
   */
  async checkQuery(query) {
    try {
      const response = await authRequest(`${API_BASE}/check_query`, {
        method: "POST",
        body: {
          query,
        },
      });

      return response;
    } catch (error) {
      console.error('Error checking query:', error);
      throw error;
    }
  },
};
