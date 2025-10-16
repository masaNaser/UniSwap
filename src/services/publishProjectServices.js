import api from './api';

export const getProjectBySubServices = async (token,id) => {
  return await api.get(`/PublishProjects/by-subservice/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const Pagination = async (token, page,pageSize) => {
  return await api.get(`/PublishProjects/browse?page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}