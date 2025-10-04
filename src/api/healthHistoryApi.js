import { request } from "./apiClient";
import { ENDPOINTS, CUSTOM_ENDPOINTS } from "./apiConfig";

export const HealthHistoryApi = {
 // === GETTING SUMMARY DATA ===
  async getHealthHistorySummary(userId) {
    try {
      const response = await request(CUSTOM_ENDPOINTS.healthHistory.getHealthHistorySummary, {
        method: 'POST',
        body: { user_id: userId }
      });
      console.log('response', response)
      return response;
    } catch (error) {
      console.error('Error fetching health history summary:', error);
      throw error;
    }
  },

 // === GETTING DATA ===
  async getHealthHistory(userId) {
    try {
      const response = await request(CUSTOM_ENDPOINTS.health.getUserHealthData, {
        method: 'POST',
        body: { user_id: userId }
      });
      return response;
    } catch (error) {
      console.error('Error fetching health history:', error);
      throw error;
    }
  },
  // === ADDING DATA ===
  async addMedicalCondition(data) {
    console.log("API: Adding medical condition", data);
    return await request(ENDPOINTS.medicalConditions.create, {
      method: 'POST',
      body: data
    });
  },

  async addMedication(data) {
    console.log("API: Adding medication", data);
    return await request(ENDPOINTS.medications.create, {
      method: 'POST',
      body: data
    });
  },

  async addAllergy(data) {
    console.log("API: Adding allergy", data);
    return await request(ENDPOINTS.allergies.create, {
      method: 'POST',
      body: data
    });
  },

  async addSurgicalHistory(data) {
    console.log("API: Adding surgical history", data);
    return await request(ENDPOINTS.surgicalHistory.create, {
      method: 'POST',
      body: data
    });
  },

  async addVaccination(data) {
    console.log("API: Adding vaccination", data);
    return await request(ENDPOINTS.vaccinations.create, {
      method: 'POST',
      body: data
    });
  },

  async addSensitivity(data) {
    console.log("API: Adding sensitivity", data);
    return await request(ENDPOINTS.sensitivities.create, {
      method: 'POST',
      body: data
    });
  },

  async addFamilyHistory(data) {
    console.log("API: Adding family history", data);
    return await request(ENDPOINTS.familyHistory.create, {
      method: 'POST',
      body: data
    });
  },

  // === ОНОВЛЕННЯ ТА ВИДАЛЕННЯ ===
  
  async updateMedicalCondition(id, data) {
    return await request(ENDPOINTS.medicalConditions.update(id), {
      method: 'PUT',
      body: data
    });
  },

  async deleteMedicalCondition(id) {
    return await request(ENDPOINTS.medicalConditions.remove(id), {
      method: 'DELETE'
    });
  }
};