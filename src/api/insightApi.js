import { authRequest } from "./apiClient";
import { CUSTOM_ENDPOINTS } from "./apiConfig";

export const InsightApi = {
  /**
   * Generate a new insight based on health metrics
   */
  async generateInsight(data) {
    try {
      const requestData = {
        user_id: data.user_id,
        metrics: data.metrics || [],
        query: data.query || '',
        ...data.options
      };

      const response = await authRequest(CUSTOM_ENDPOINTS.insights.generateInsights, {
        method: "POST",
        body: requestData,
      });
      
      return response;
    } catch (error) {
      console.error('Error generating insight:', error);
      throw error;
    }
  },
};