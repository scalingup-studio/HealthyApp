/**
 * Creates a CRUD API for working with a resource
 * @param {Object} endpoints - Object with endpoints
 * @param {string} endpoints.getAll - URL for getting all records
 * @param {Function} endpoints.getById - Function that returns URL for getting by ID
 * @param {string} endpoints.create - URL for creating
 * @param {Function} endpoints.update - Function that returns URL for updating
 * @param {Function} endpoints.remove - Function that returns URL for deletion
 * @returns {Object} Object with CRUD methods
 * @returns {Function} returns.getAll - Method for getting all records
 * @returns {Function} returns.getById - Method for getting record by ID
 * @returns {Function} returns.create - Method for creating a record
 * @returns {Function} returns.update - Method for updating a record
 * @returns {Function} returns.remove - Method for deleting a record
 * @example
 * const api = createCrudApi({
 *   getAll: '/api/users',
 *   getById: (id) => `/api/users/${id}`,
 *   create: '/api/users',
 *   update: (id) => `/api/users/${id}`,
 *   remove: (id) => `/api/users/${id}`
 * });
 */
// Grouping APIs by functionality
export { AuthApi } from "./authApi";
export { UsersApi } from "./usersApi";
export { ProfilesApi } from "./profilesApi";
export { UserSettingsApi } from "./userSettingsApi";
export { HealthApi } from "./healthApi";
export { GoalsApi } from "./goalsApi";

// Utilities and helpers
export { createCrudApi } from "./helpers";
export { request, authRequest } from "./apiClient";

// You can add bulk export for convenience
export const Api = {
  Auth: AuthApi,
  Users: UsersApi,
  Profiles: ProfilesApi,
  UserSettings: UserSettingsApi,
  Health: HealthApi,
  Goals: GoalsApi,
};