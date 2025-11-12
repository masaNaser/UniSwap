import api from './api';

export const CreateReport = async (token,data) => {
  return await api.post('/reports', data,
    {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
