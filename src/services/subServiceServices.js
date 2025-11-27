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


export const CreateSubServices = async (token,data,serviceId) => {
  return await api.post(`/Services/${serviceId}`, {data},{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const EditSubServices = async (token,data,serviceId,subServiceId) => {
  return await api.put(`services/${serviceId}/subservices/${subServiceId}`, {data},{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const DeleteSubServices = async (token,serviceId,subServiceId) => {
  return await api.delete(`/services/${serviceId}/subservices/${subServiceId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};