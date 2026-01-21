import api from './api';

export const getSubServices = async (token, id) => {
  return await api.get(`/services/${id}/subservices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOneSubServices = async (token, serviceId, subServiceId) => {
  return await api.get(`services/${serviceId}/subservices/${subServiceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//  تعديل Create لدعم parentSubServiceId
export const CreateSubServices = async (token, serviceId, data, parentSubServiceId = null) => {
  // بناء الـ URL بناءً على وجود parentSubServiceId
  const url = parentSubServiceId 
    ? `/services/${serviceId}/subservices?parentSubServiceId=${parentSubServiceId}`
    : `/services/${serviceId}/subservices`;
  
  // تحويل data.name → data.Name (capital N)
  const payload = { Name: data.name };
  
  return await api.post(url, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// تعديل Edit لتحويل name → Name
export const EditSubServices = async (token, serviceId, subId, data) => {
  const payload = { Name: data.name };
  
  return await api.put(`/services/${serviceId}/subservices/${subId}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const DeleteSubServices = async (token, serviceId, subId) => {
  return await api.delete(`/services/${serviceId}/subservices/${subId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};