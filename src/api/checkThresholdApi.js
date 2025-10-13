import { CUSTOM_ENDPOINTS } from "./apiConfig";

/**
 * Send health metrics to backend for threshold checking
 * @param {Object} metrics - Health metrics to check
 * @returns {Promise<Object>} Response from backend
 */
export const checkThreshold = async (metrics) => {
    try {
      const response = await fetch(CUSTOM_ENDPOINTS.checkThreshold.checkThreshold, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ metrics }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error sending metrics to backend:", error);
      throw error;
    }
  };
export default {
  checkThreshold,
};
