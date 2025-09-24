import { authRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export const UsersApi = {
  // GET /users - Query all users records
  getAll: () => authRequest(ENDPOINTS.users.getAll),

  // POST /users - Add users record
  create: (data) => authRequest(ENDPOINTS.users.create, {
    method: "POST",
    body: data,
  }),

  // GET /users/{user_id} - Get users record
  getById: (user_id) => authRequest(ENDPOINTS.users.getById(user_id)),

  // PATCH /users/{user_id} - Edit users record
  update: (user_id, data) => authRequest(ENDPOINTS.users.update(user_id), {
    method: "PATCH",
    body: data,
  }),

  // DELETE /users/{user_id} - Delete users record
  delete: (user_id) => authRequest(ENDPOINTS.users.remove(user_id), {
    method: "DELETE",
  }),
};