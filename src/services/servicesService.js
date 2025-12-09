import api from './api';

export const getServices = async (token) => {
  return await api.get('/Services', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getOneServices = async (token,serviceId) => {
  return await api.get(`Services/${serviceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      
    },
  });
};


export const CreateServices = async (token,data) => {
  return await api.post('/Services', data,{
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",

    
    },
  });
};

export const EditServices = async (token, id, data) => {
  return await api.put(`/Services`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    params: { id },  // 👈 هيي
  });
};


export const DeleteServices = async (token, id) => {
  return await api.delete(`/Services`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { id }, // <-- مهم
  });
};
