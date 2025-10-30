import { authRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export const GoalsApi = {
  // GET /goals - Query all goals records
  getAll: () => authRequest(ENDPOINTS.goals.getAll),

  // GET /goals?user_id={user_id} - Filter by user_id
  getByUserId: (user_id) => authRequest(`${ENDPOINTS.goals.getAll}?user_id=${user_id}`),

  // GET /goals/{user_id} - Get goals record
  getById: (user_id) => authRequest(ENDPOINTS.goals.getById(user_id)),

  // POST /goals - Add goals record
  create: (data) => authRequest(ENDPOINTS.goals.create, {
    method: "POST",
    body: data,
  }),

  // PATCH /goals/{user_id} - Edit goals record
  update: (user_id, data) => authRequest(ENDPOINTS.goals.update(user_id), {
    method: "PATCH",
    body: data,
  }),

  // DELETE /goals/{user_id} - Delete goals record
  delete: (user_id) => authRequest(ENDPOINTS.goals.remove(user_id), {
    method: "DELETE",
  }),
};