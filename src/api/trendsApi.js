import { authRequest } from "./apiClient";
import { API_BASE } from "./apiConfig";

export const TrendsApi = {
  /**
   * Get health trends for a specific metric
   * @param {string} typeMetric - Type of metric (e.g., 'heart_rate', 'blood_pressure')
   * @param {string} period - Period type ('daily', 'weekly', 'monthly')
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   */
  async getTrends({ typeMetric, period, startDate, endDate }) {
    try {
      const response = await authRequest(`${API_BASE}/metrics/trends`, {
        method: "POST",
        body: {
          type_metric: typeMetric,
          period,
          start_date: startDate,
          end_date: endDate,
        },
      });

      return response;
    } catch (error) {
      console.error('Error getting trends:', error);
      throw error;
    }
  },

  /**
   * Get forecast for a specific metric
   * @param {string} typeMetric - Type of metric
   */
  async getForecast(typeMetric) {
    try {
      const response = await authRequest(`${API_BASE}/metrics/forecast`, {
        method: "POST",
        body: {
          type_metric: typeMetric,
        },
      });

      return response;
    } catch (error) {
      console.error('Error getting forecast:', error);
      throw error;
    }
  },
};
