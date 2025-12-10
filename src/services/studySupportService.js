import api from './api';

export const getServices = async (token) => {
  return await api.get('/Services', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
