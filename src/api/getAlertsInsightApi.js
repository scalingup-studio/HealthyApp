// import { CUSTOM_ENDPOINTS } from "./apiConfig";

// /**
//  * Get AI-generated alert insights for a user
//  * @param {string} userId - The ID of the user
//  * @returns {Promise<Object>} Alert insights data from backend
//  */
// export const getAlertsInsightApi = async (userId) => {
//     try {
//       const url = CUSTOM_ENDPOINTS.alertsInsight.getAlertsInsight.replace("{user_id}", userId);
  
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       return await response.json();
//     } catch (error) {
//       console.error("Error fetching alert insights:", error);
//       throw error;
//     }
//   };

// export default {
//   getAlertsInsightApi,
// };
