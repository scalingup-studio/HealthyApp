import { CUSTOM_ENDPOINTS } from "./apiConfig";

/**
 * Map MIME types to allowed file types
 */
const getFileType = (mimeType) => {
  const typeMap = {
    'application/pdf': 'pdf',
    'image/jpeg': 'image',
    'image/jpg': 'image',
    'image/png': 'image',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/plain': 'txt'
  };
  
  return typeMap[mimeType] || 'file';
};

export const uploadFileApi = async (file, userId, category, fileName = null) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);
    formData.append("category", category);
    
    // Використовуємо правильний file_type з дозволених значень
    const allowedFileType = getFileType(file.type);
    formData.append("file_type", allowedFileType);
    
    // Використовуємо реальне ім'я файлу
    formData.append("file_name", fileName || file.name);

    console.log("📤 Uploading file with mapped type:", {
      originalType: file.type,
      mappedType: allowedFileType,
      fileName: file.name
    });

    const response = await fetch(CUSTOM_ENDPOINTS.uploudFile.uploudFile, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Server response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}. Response: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Upload successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    throw error;
  }
};

/**
 * Get all uploaded files for a specific user
 */
export const getUserFilesApi = async (userId) => {
  try {
    const response = await fetch(`${CUSTOM_ENDPOINTS.uploudFile.getUserUploudFiles}?user_id=${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting user files:", error);
    throw error;
  }
};

/**
 * Download specific file (завантаження)
 */
export const downloadFileApi = async (fileId, fileName = null, userId = null) => {
  try {
// Use the NEW endpoint for loading
    let url = `${CUSTOM_ENDPOINTS.uploudFile.downloadFile}`;
    const params = new URLSearchParams();
    
    if (fileId) params.append('file_id', fileId);
    if (userId) params.append('user_id', userId); // для безпеки
    
    url += `?${params.toString()}`;

    console.log("📥 Downloading file from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName || `file_${fileId}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    return { success: true, message: 'File downloaded successfully' };
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

/**
 * Delete an uploaded file
 */
export const deleteFileApi = async (fileId, userId = null) => {
  try {
    const response = await fetch(CUSTOM_ENDPOINTS.uploudFile.deleteFile, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_id: fileId,
        user_id: userId
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}. Response: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ File deleted successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    throw error;
  }
};


export default {
  uploadFileApi,
  getUserFilesApi,
  downloadFileApi,
  deleteFileApi
};