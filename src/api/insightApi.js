import apiClient from './apiClient';

const INSIGHTS_BASE = '/generate-insight';

export const InsightApi = {
  /**
   * Generate a new insight based on health metrics
   * @param {Object} data - Data for insight generation
   * @param {string} data.user_id - User ID
   * @param {Array} data.metrics - Array of health metrics
   * @param {string} data.query - Question or query for the insight
   * @param {Object} data.options - Additional options
   * @returns {Promise<Object>} - Insight object
   */
  generateInsight: async (data) => {
    try {
      const requestData = {
        user_id: data.user_id,
        metrics: data.metrics || [],
        query: data.query || '',
        ...data.options
      };

      console.log('🔄 Generating insight with data:', requestData);
      
      const response = await apiClient.post(INSIGHTS_BASE, requestData);
      console.log('✅ Insight generated successfully:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error generating insight:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate insight');
    }
  },
  
};

export default InsightApi;