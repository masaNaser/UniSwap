import api from './api';

export const GetByParentSubService= async (token,serviceId,parentId) => {
  return await api.get(`/services/${serviceId}/subservices/parent/${parentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



export const CreateStudySupportSub= async (token,data) => {
  return await api.post('PublishProjects/study',data ,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
