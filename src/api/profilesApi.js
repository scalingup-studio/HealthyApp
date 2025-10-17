import { authRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export const ProfilesApi = {
  /**
   * Get all profiles
   */
  async getAll() {
    try {
      return await authRequest(ENDPOINTS.profiles.getAll);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  },

  /**
   * Get profile by user ID
   */
  async getById(user_id) {
    try {
      return await authRequest(ENDPOINTS.profiles.getById(user_id));
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  /**
   * Create new profile
   */
  async create(data) {
    try {
      return await authRequest(ENDPOINTS.profiles.create, {
        method: "POST",
        body: data,
      });
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  /**
   * Update profile
   */
  async update(user_id, data) {
    try {
      return await authRequest(ENDPOINTS.profiles.update(user_id), {
        method: "PATCH",
        body: data,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Delete profile
   */
  async delete(user_id) {
    try {
      return await authRequest(ENDPOINTS.profiles.remove(user_id), {
        method: "DELETE",
      });
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  },
};