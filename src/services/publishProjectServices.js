import api from './api';

export const getProjectBySubServices = async (token,id) => {
  return await api.get(`/PublishProjects/by-subservice/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};