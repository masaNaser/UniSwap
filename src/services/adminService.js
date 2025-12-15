import api from "./api";

export const GetDashboard = async (token) => {
  return await api.get(`/AdminDashboard/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetUsers = async (token) => {
  return await api.get(`/AdminDashboard/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const CreateReport = async (token,data) => {
  return await api.post('/reports', data,
    {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const GetOneReports = async (token, reportId) => {
  return await api.get(`/AdminDashboard/${reportId}/getReport`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetPendingReports = async (token) => {
  return await api.get(`/AdminDashboard/pendingReport`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const ReviewReport = async (token, reportId, accept) => {
  // Convert boolean to the status value the backend expects
  // Backend expects: { status: 1 } for Accepted or { status: 2 } for Rejected
  const status = accept ? 1 : 2; // 1 = Accepted, 2 = Rejected

  return await api.post(
    `/AdminDashboard/${reportId}/reviewReport`,
    { status }, // Send status instead of accept
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const Analytics = async (token) => {
  return await api.get(`/AdminDashboard/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
