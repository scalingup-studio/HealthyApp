import { ENDPOINTS, CUSTOM_ENDPOINTS } from './api-endpoints';

// Basic request
async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('authToken');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Insight API
export const insightApi = {
  // Insight generation
  generateInsight: async (data) => {
    return await apiRequest(CUSTOM_ENDPOINTS.insights.getInsights, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get insights history
  getInsightsHistory: async (userId) => {
    return await apiRequest(`${ENDPOINTS.healthData.getAll}?user_id=${userId}`);
  },

 // Get specific insight by ID
  getInsightById: async (id) => {
    return await apiRequest(ENDPOINTS.healthData.getById(id));
  },

  // Створити но// Create a new insight recordвий запис інсайту
  createInsight: async (insightData) => {
    return await apiRequest(ENDPOINTS.healthData.create, {
      method: 'POST',
      body: JSON.stringify(insightData),
    });
  },

 // Update insight
  updateInsight: async (id, insightData) => {
    return await apiRequest(ENDPOINTS.healthData.update(id), {
      method: 'PATCH',
      body: JSON.stringify(insightData),
    });
  },

 // Delete insight
  deleteInsight: async (id) => {
    return await apiRequest(ENDPOINTS.healthData.remove(id), {
      method: 'DELETE',
    });
  },

// Get summary health information
  getHealthSummary: async (userId) => {
    return await apiRequest(`${CUSTOM_ENDPOINTS.healthHistory.getHealthHistorySummary}?user_id=${userId}`);
  },
};

// Usage examples:
/*
// Generate a new insight
const insight = await insightApi.generateInsight({
user_id: '123',
metrics: [
{ metric_type: 'blood_pressure_systolic', value: 145 },
{ metric_type: 'blood_pressure_diastolic', value: 95 }
],
query: "What should I do about this?"
});

// Get insight history
const history = await insightApi.getInsightsHistory('user-123');

// Create an entry in health_data
const newRecord = await insightApi.createInsight({
  user_id: '123',
  type: 'blood_pressure',
  value: '145/95',
  insight_text: 'Based on your recent data patterns...',
  recorded_at: new Date().toISOString()
});
*/

export default insightApi;