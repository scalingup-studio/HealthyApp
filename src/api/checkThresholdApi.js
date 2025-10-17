import { authRequest } from "./apiClient";
import { CUSTOM_ENDPOINTS } from "./apiConfig";

export const CheckThresholdApi = {
  /**
   * Send health metrics to backend for threshold checking
   */
  async checkThreshold(metrics) {
    try {
      return await authRequest(CUSTOM_ENDPOINTS.checkThreshold.checkThreshold, {
        method: "POST",
        body: { metrics },
      });
    } catch (error) {
      console.error('Error checking thresholds:', error);
      throw error;
    }
  },
};