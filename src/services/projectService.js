import api from './api';

export const getClientdashboard = async (token,view,statusFilter) => {
  return await api.get(`/Projects/dashboard?view=${view}&statusFilter=${statusFilter}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getServiceProviderDashboard = async (token,view,statusFilter) => {
  return await api.get(`/Projects/dashboard?view=${view}&statusFilter=${statusFilter}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};