import { authRequest } from "./apiClient";
import { ENDPOINTS, CUSTOM_ENDPOINTS } from "./apiConfig";

export const HealthHistoryApi = {
  /**
   * Get health history summary
   */
  async getHealthHistorySummary(userId) {
    try {
      return await authRequest(CUSTOM_ENDPOINTS.healthHistory.getHealthHistorySummary, {
        method: 'POST',
        body: { user_id: userId }
      });
    } catch (error) {
      console.error('Error fetching health history summary:', error);
      throw error;
    }
  },

  /**
   * Add medical condition
   */
  async addMedicalCondition(data) {
    try {
      return await authRequest(ENDPOINTS.medicalConditions.create, {
        method: 'POST',
        body: data
      });
    } catch (error) {
      console.error('Error adding medical condition:', error);
      throw error;
    }
  },

  /**
   * Add medication
   */
  async addMedication(data) {
    try {
      return await authRequest(ENDPOINTS.medications.create, {
        method: 'POST',
        body: data
      });
    } catch (error) {
      console.error('Error adding medication:', error);
      throw error;
    }
  },

  /**
   * Add allergy
   */
  async addAllergy(data) {
    try {
      return await authRequest(ENDPOINTS.allergies.create, {
        method: 'POST',
        body: data
      });
    } catch (error) {
      console.error('Error adding allergy:', error);
      throw error;
    }
  },

  /**
   * Add surgical history
   */
  async addSurgicalHistory(data) {
    try {
      return await authRequest(ENDPOINTS.surgicalHistory.create, {
        method: 'POST',
        body: data
      });
    } catch (error) {
      console.error('Error adding surgical history:', error);
      throw error;
    }
  },

  /**
   * Add vaccination
   */
  async addVaccination(data) {
    try {
      return await authRequest(ENDPOINTS.vaccinations.create, {
        method: 'POST',
        body: data
      });
    } catch (error) {
      console.error('Error adding vaccination:', error);
      throw error;
    }
  },

  /**
   * Add sensitivity
   */
  async addSensitivity(data) {
    try {
      return await authRequest(ENDPOINTS.sensitivities.create, {
        method: 'POST',
        body: data
      });
    } catch (error) {
      console.error('Error adding sensitivity:', error);
      throw error;
    }
  },

  /**
   * Add family history
   */
  async addFamilyHistory(data) {
    try {
      return await authRequest(ENDPOINTS.familyHistory.create, {
        method: 'POST',
        body: data
      });
    } catch (error) {
      console.error('Error adding family history:', error);
      throw error;
    }
  },

  /**
   * Update medical condition
   */
  async updateMedicalCondition(id, data) {
    try {
      return await authRequest(ENDPOINTS.medicalConditions.update(id), {
        method: 'PUT',
        body: data
      });
    } catch (error) {
      console.error('Error updating medical condition:', error);
      throw error;
    }
  },

  /**
   * Delete medical condition
   */
  async deleteMedicalCondition(id) {
    try {
      return await authRequest(ENDPOINTS.medicalConditions.remove(id), {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting medical condition:', error);
      throw error;
    }
  }
};