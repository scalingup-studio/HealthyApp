import { CUSTOM_ENDPOINTS } from "./apiConfig";

/**
 * Upload a file (e.g., PDF) to the backend.
 * @param {File} file - The file object to upload
 * @param {string} userId - The ID of the user uploading the file
 * @param {string} category - The file category (e.g., 'medical', 'insurance', 'lab', 'other')
 * @param {string} fileType - The file type (e.g., 'pdf', 'image', etc.)
 * @returns {Promise<Object>} Response data from the backend
 */
export const uploadFileApi = async (file, userId, category, fileType = "pdf", fileName="test.pdf") => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);
    formData.append("category", category);
    formData.append("file_type", fileType);
    formData.append("file_name", fileName);


    const response = await fetch(CUSTOM_ENDPOINTS.uploudFile.uploudFile, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Get an uploaded file from the backend.
 * @param {string} fileId - The ID of the file to retrieve
 * @returns {Promise<Object>} File data or blob from the backend
 */
export const getUploudFileApi = async (fileId) => {
    try {
      const response = await fetch(`${CUSTOM_ENDPOINTS.uploudFile.getUploudFile}?file_id=${fileId}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting file:", error);
      throw error;
    }
  };
  

export default {
  uploadFileApi,
  getUploudFileApi
};
