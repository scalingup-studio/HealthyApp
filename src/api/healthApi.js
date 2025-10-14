import { authRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export const HealthApi = {
  /**
   * Get all health data
   */
  async getAll() {
    try {
      const response = await authRequest(ENDPOINTS.healthData.getAll);
      return response;
    } catch (error) {
      console.error('Error fetching all health data:', error);
      throw error;
    }
  },

  /**
   * Get health data by user ID
   */
  async getByUserId(user_id) {
    try {
      const response = await authRequest(`${ENDPOINTS.healthData.getAll}?user_id=${user_id}`);
      return response;
    } catch (error) {
      console.error('Error fetching health data by user ID:', error);
      throw error;
    }
  },

  /**
   * Create new health data record
   */
  async create(data) {
    try {
      const response = await authRequest(ENDPOINTS.healthData.create, {
        method: "POST",
        body: data,
      });
      return response;
    } catch (error) {
      console.error('Error creating health data:', error);
      throw error;
    }
  },

  /**
   * Update health data
   */
  async update(user_id, data) {
    try {
      const response = await authRequest(ENDPOINTS.healthData.update(user_id), {
        method: "PATCH",
        body: data,
      });
      return response;
    } catch (error) {
      console.error('Error updating health data:', error);
      throw error;
    }
  },

  /**
   * Delete health data
   */
  async delete(user_id) {
    try {
      const response = await authRequest(ENDPOINTS.healthData.remove(user_id), {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error('Error deleting health data:', error);
      throw error;
    }
  },
};