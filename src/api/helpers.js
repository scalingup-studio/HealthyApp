export const createCrudApi = (endpoints) => {
    const handleResponse = async (response) => {
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`HTTP ${response.status}: ${error}`);
      }
      return response.json();
    };
  
    return {
      getAll: async () => {
        const res = await fetch(endpoints.getAll);
        return handleResponse(res);
      },
      getById: async (id) => {
        const res = await fetch(endpoints.getById(id));
        return handleResponse(res);
      },
      create: async (data) => {
        const res = await fetch(endpoints.create, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return handleResponse(res);
      },
      update: async (id, data) => {
        const res = await fetch(endpoints.update(id), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return handleResponse(res);
      },
      remove: async (id) => {
        const res = await fetch(endpoints.remove(id), {
          method: "DELETE",
        });
        return handleResponse(res);
      },
    };
  };