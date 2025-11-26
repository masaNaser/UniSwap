import api from "./api";

export const GetDashboard = async (token) => {
  return await api.get(`/AdminDashboard/stats`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetUsers = async (token) => {
  return await api.get(`/AdminDashboard/users`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetOneReports = async (token,reportId) => {
  return await api.get(`/AdminDashboard/${reportId}/getReport`,  {
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
  return await api.post(
    `/AdminDashboard/${reportId}/reviewReport`,
    { accept }, // Body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const Analytics = async (token) => {
  return await api.get(`/AdminDashboard/analytics`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};