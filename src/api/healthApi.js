import { authRequest } from "./apiClient";
import { ENDPOINTS } from "./apiConfig";

export const HealthApi = {
  // GET /health_data - Query all health_data records
  getAll: () => authRequest(ENDPOINTS.healthData.getAll),

  // GET /health_data?user_id={user_id} - Filter by user_id
  getByUserId: (user_id) => authRequest(`${ENDPOINTS.healthData.getAll}?user_id=${user_id}`),

  // GET /health_data/{user_id} - Get health_data record
  getById: (user_id) => authRequest(ENDPOINTS.healthData.getById(user_id)),

  // POST /health_data - Add health_data record
  create: (data) => authRequest(ENDPOINTS.healthData.create, {
    method: "POST",
    body: data,
  }),

  // PATCH /health_data/{user_id} - Edit health_data record
  update: (user_id, data) => authRequest(ENDPOINTS.healthData.update(user_id), {
    method: "PATCH",
    body: data,
  }),

  // DELETE /health_data/{user_id} - Delete health_data record
  delete: (user_id) => authRequest(ENDPOINTS.healthData.remove(user_id), {
    method: "DELETE",
  }),
};