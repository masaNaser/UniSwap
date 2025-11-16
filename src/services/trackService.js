import api from './api';

export const getProjectTrackData = async (token,projectId) => {
  return await api.get(`/tasks/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
