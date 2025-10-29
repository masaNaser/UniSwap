import api from './api';

// Get all projects by subservice 
export const getProjectBySubServices = async (token, id) => {
  return await api.get(`/PublishProjects/by-subservice/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get paginated projects by subservice
export const browseProjectsBySubService = async (token, subServiceId, page, pageSize) => {
  // Validate subServiceId
  if (!subServiceId) {
    throw new Error('subServiceId is required');
  }
  
  console.log('Calling browse API with:', { subServiceId, page, pageSize });
  
  return await api.get(`/PublishProjects/browse/${subServiceId}`, {
    params: {
      // SubServiceId: subServiceId,  
      Page: page,
      PageSize: pageSize
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};