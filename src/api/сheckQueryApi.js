import { authRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export const CheckQueryApi = {
  /**
   * Validate user query for safety checks
   */
  async checkQuery(user_id, query) {
    try {
      const response = await authRequest(ENDPOINTS.checkQuery.checkQuery, {
        method: "POST",
        body: { user_id, query },
      });
      
      return {
        ...response,
        error_details: response.validation_details || response.error_details || {}
      };
    } catch (error) {
      console.error('CheckQuery API Error:', error);
      throw error;
    }
  },
};