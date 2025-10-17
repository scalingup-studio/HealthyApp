import { authRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export const HealthApi = {
  // === GETTING DATA ===
  async getAll() {
    try {
      const response = await authRequest(ENDPOINTS.healthData.getAll);
      console.log('Health API: Get all response', response);
      return response;
    } catch (error) {
      console.error('Error fetching all health data:', error);
      throw error;
    }
  },

  async getByUserId(user_id) {
    try {
      const response = await authRequest(`${ENDPOINTS.healthData.getAll}?user_id=${user_id}`);
      console.log('Health API: Get by user ID response', response);
      return response;
    } catch (error) {
      console.error('Error fetching health data by user ID:', error);
      throw error;
    }
  },

  async getById(user_id) {
    try {
      const response = await authRequest(ENDPOINTS.healthData.getById(user_id));
      console.log('Health API: Get by ID response', response);
      return response;
    } catch (error) {
      console.error('Error fetching health data by ID:', error);
      throw error;
    }
  },

  // === ADDING DATA ===
  async create(data) {
    try {
      console.log("Health API: Creating health data", data);
      const response = await authRequest(ENDPOINTS.healthData.create, {
        method: "POST",
        body: data,
      });
      console.log("Health API: Create response", response);
      return response;
    } catch (error) {
      console.error('Error creating health data:', error);
      throw error;
    }
  },

  // === UPDATING DATA ===
  async update(user_id, data) {
    try {
      console.log("Health API: Updating health data", { user_id, data });
      const response = await authRequest(ENDPOINTS.healthData.update(user_id), {
        method: "PATCH",
        body: data,
      });
      console.log("Health API: Update response", response);
      return response;
    } catch (error) {
      console.error('Error updating health data:', error);
      throw error;
    }
  },

  // === DELETING DATA ===
  async delete(user_id) {
    try {
      console.log("Health API: Deleting health data", user_id);
      const response = await authRequest(ENDPOINTS.healthData.remove(user_id), {
        method: "DELETE",
      });
      console.log("Health API: Delete response", response);
      return response;
    } catch (error) {
      console.error('Error deleting health data:', error);
      throw error;
    }
  },

  // === ADDITIONAL METHODS (optional) ===
  
  // Отримати дані за діапазоном дат
  async getByDateRange(user_id, startDate, endDate) {
    try {
      const response = await authRequest(`${ENDPOINTS.healthData.getAll}?user_id=${user_id}&start_date=${startDate}&end_date=${endDate}`);
      console.log('Health API: Get by date range response', response);
      return response;
    } catch (error) {
      console.error('Error fetching health data by date range:', error);
      throw error;
    }
  },

  // Отримати останні N записів
  async getRecent(user_id, limit = 10) {
    try {
      const response = await authRequest(`${ENDPOINTS.healthData.getAll}?user_id=${user_id}&limit=${limit}&sort=desc`);
      console.log('Health API: Get recent response', response);
      return response;
    } catch (error) {
      console.error('Error fetching recent health data:', error);
      throw error;
    }
  }
};