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

export const GetPendingReports = async (token,data) => {
  return await api.get(`reports/pending`,data,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const ReviewReprot = async (token,reportId) => {
  return await api.post(`/api/reports/${reportId}/review`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const Analytics = async (token) => {
  return await api.get(`/AdminDashboard/analytics`,  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};