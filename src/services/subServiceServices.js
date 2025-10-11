import api from './api';

export const getSubServices = async (token,id) => {
  return await api.get(`/services/${id}/subservices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};