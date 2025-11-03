import api from "./api";

// Create a collaboration request
export const createCollaborationRequest = async (token, data) => {
  return await api.post("/collaborations", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Get dashboard data - view: 'client' or 'Provider' (case-sensitive!)
// statusFilter: 'All', 'Pending', 'Active', 'Completed', 'Overdue'
export const getDashboard = async (token, view, statusFilter = "All") => {
  return await api.get("/Projects/dashboard", {
    params: {
      view: view, // 'client' or 'Provider'
      statusFilter: statusFilter,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get single collaboration request
export const getCollaborationRequest = async (token, id) => {
  return await api.get(`/collaborations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get pending collaboration requests
// role: 'Client' or 'Provider' (case-sensitive!)
export const getPendingRequests = async (token, role) => {
  return await api.get("/collaborations/requests/pending", {
    params: {
      role: role, // 'Client' or 'Provider'
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Edit collaboration request
export const editCollaborationRequest = async (token, id, data) => {
  return await api.put(`/collaborations/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Approve collaboration request (Provider only)
export const approveCollaborationRequest = async (token, id) => {
  return await api.post(
    `/collaborations/${id}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Cancel collaboration request (Client only)
export const cancelCollaborationRequest = async (token, id) => {
  return await api.post(
    `/collaborations/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Reject collaboration request (Provider only)
export const rejectCollaborationRequest = async (token, id) => {
  return await api.post(
    `/collaborations/${id}/reject`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};