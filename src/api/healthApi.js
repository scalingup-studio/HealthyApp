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
      const response = await authRequest(`${ENDPOINTS.healthData.getAll}/${user_id}`);
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
   * Update specific health data record by health_data_id
   * @param {string} user_id - User ID to include in URL
   * @param {string} health_data_id - Health data ID to update
   * @param {Object} data - Health data fields to update
   * 
   * @example
   * // Update health data for user with specific health_data_id
   * await HealthApi.updateRecord("51e43fdb-b975-4f99-90e9-8793024ae622", "c1e4b33c-5a6c-f66c-9020-d5793f9dde9e", {
   *   date: "1984-12-10",
   *   heart_rate: 62585865,
   *   blood_pressure_systolic: 15982,
   *   blood_pressure_diastolic: -48939256,
   *   weekly_activity_minutes: -11923139.205127731,
   *   activity_level: -17688024,
   *   visibility_scope: "private",
   *   hydration_liters: -12463869.491033956,
   *   pulse_oximetry: -52757245,
   *   respiratory_rate: -3833992,
   *   body_weight_trend: "reprehen",
   *   body_mass_index: 1462399.419555992,
   *   fasting_glucose: -7295863.15483503,
   *   body_temperature: 89632521.1517317
   * });
   */
  async updateRecord(user_id, health_data_id, data) {
    try {
      console.log('🏥 Updating health data record:', health_data_id, 'for user:', user_id);
      console.log('📝 Health data to update:', data);
      
      const payload = {
        health_data_id: health_data_id,
        ...data
      };
      
      const response = await authRequest(`${ENDPOINTS.healthData.getAll}/${user_id}`, {
        method: "PATCH",
        body: payload,
      });
      
      console.log('✅ Health data record updated successfully:', response);
      return response;
    } catch (error) {
      console.error('Error updating health data record:', error);
      throw error;
    }
  },

  /**
   * Update health data (legacy method - use updateRecord for better control)
   * @param {string} user_id - User ID to include in URL
   * @param {Object} data - Health data object containing health_data_id and other fields
   */
  async update(user_id, data) {
    try {
      console.log('🏥 Updating health data for user:', user_id);
      console.log('📝 Health data to update:', data);
      
      // Ensure health_data_id is included in the payload
      const payload = {
        ...data,
        health_data_id: data.health_data_id || data.id
      };
      
      const response = await authRequest(`${ENDPOINTS.healthData.getAll}/${user_id}`, {
        method: "PATCH",
        body: payload,
      });
      
      console.log('✅ Health data updated successfully:', response);
      return response;
    } catch (error) {
      console.error('Error updating health data:', error);
      throw error;
    }
  },

  /**
   * Delete specific health data record by health_data_id
   * @param {string} user_id - User ID to include in URL
   * @param {string} health_data_id - Health data ID to delete
   */
  async deleteRecord(user_id, health_data_id) {
    try {
      console.log('🗑️ Deleting health data record:', health_data_id, 'for user:', user_id);
      
      const response = await authRequest(`${ENDPOINTS.healthData.getAll}/${user_id}`, {
        method: "DELETE",
        body: { id: health_data_id },
      });
      
      console.log('✅ Health data record deleted successfully:', response);
      return response;
    } catch (error) {
      console.error('Error deleting health data record:', error);
      throw error;
    }
  },

  /**
   * Delete health data (legacy method - use deleteRecord for better control)
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