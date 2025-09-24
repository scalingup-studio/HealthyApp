import { authRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export const ProfilesApi = {
  // GET /profiles - Query all profiles records
  getAll: () => authRequest(ENDPOINTS.profiles.getAll),

  // GET /profiles/{user_id} - Get profiles record
  getById: (user_id) => authRequest(ENDPOINTS.profiles.getById(user_id)),

  // POST /profiles - Add profiles record
  create: (data) => authRequest(ENDPOINTS.profiles.create, {
    method: "POST",
    body: data,
  }),

  // PATCH /profiles/{user_id} - Edit profiles record
  update: (user_id, data) => authRequest(ENDPOINTS.profiles.update(user_id), {
    method: "PATCH",
    body: data,
  }),

  // DELETE /profiles/{user_id} - Delete profiles record
  delete: (user_id) => authRequest(ENDPOINTS.profiles.remove(user_id), {
    method: "DELETE",
  }),
};