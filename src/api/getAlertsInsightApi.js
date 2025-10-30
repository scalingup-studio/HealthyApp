import { authRequest } from "./apiClient";
import { CUSTOM_ENDPOINTS } from "./apiConfig";

export const GetAlertsInsightApi = {
  /**
   * Get AI-generated alerts for a specific user
   * @param {string} userId - User ID
   */
  async getAlertsInsight(userId) {
    try {
      const endpoint = CUSTOM_ENDPOINTS.alertsInsight.getAlertsInsight.replace('{user_id}', userId);
      const response = await authRequest(endpoint, {
        method: "GET",
      });

      return response;
    } catch (error) {
      console.error('Error getting alerts insight:', error);
      throw error;
    }
  },
};