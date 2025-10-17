import { authRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export const UsersApi = {
  /**
   * Get all users
   */
  async getAll() {
    try {
      return await authRequest(ENDPOINTS.users.getAll);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  async getById(user_id) {
    try {
      return await authRequest(ENDPOINTS.users.getById(user_id));
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Create new user
   */
  async create(data) {
    try {
      return await authRequest(ENDPOINTS.users.create, {
        method: "POST",
        body: data,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update user
   */
  async update(user_id, data) {
    try {
      return await authRequest(ENDPOINTS.users.update(user_id), {
        method: "PATCH",
        body: data,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete user
   */
  async delete(user_id) {
    try {
      return await authRequest(ENDPOINTS.users.remove(user_id), {
        method: "DELETE",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};