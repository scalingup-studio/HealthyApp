import { authRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export const ProfilesApi = {
  /**
   * Get all profiles
   */
  async getAll() {
    try {
      const res = await authRequest(ENDPOINTS.profiles.getAll);
      return res?.result ?? res; // Xano may wrap payload in { result, success }
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
      const res = await authRequest(ENDPOINTS.profiles.getById(user_id));
      return res?.result ?? res; // unwrap { result }
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
      const res = await authRequest(ENDPOINTS.profiles.create, {
        method: "POST",
        body: data,
      });
      return res?.result ?? res;
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
      const res = await authRequest(ENDPOINTS.profiles.update(user_id), {
        method: "PATCH",
        body: data,
      });
      return res?.result ?? res;
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
      const res = await authRequest(ENDPOINTS.profiles.remove(user_id), {
        method: "DELETE",
      });
      return res?.result ?? res;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  },
};