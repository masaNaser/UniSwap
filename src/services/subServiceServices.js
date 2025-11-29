import api from './api';

export const getSubServices = async (token,id) => {
  return await api.get(`/services/${id}/subservices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOneSubServices = async (token,serviceId,subServiceId) => {
  return await api.get(`services/${serviceId}/subservices/${subServiceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const CreateSubServices = async (token, serviceId, data) => {
  return await api.post(`/services/${serviceId}/subservices`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const EditSubServices = async (token, serviceId, subId, data) => {
  return await api.put(`/services/${serviceId}/subservices/${subId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const DeleteSubServices = async (token, serviceId, subId) => {
  return await api.delete(`/services/${serviceId}/subservices/${subId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};