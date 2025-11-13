import api from "./api";

// Profile APIs
export const GetFullProfile = async (token) => {
  return await api.get(`/Profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const GetProfileById = async (token, userId) => {
  return await api.get(`/Profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const EditProfile = async (token, data) => {
  return await api.put(`/Profile/me`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// Projects(PortfolioTap) APIs
export const CreateProject = async (token, data) => {
  return await api.post(`/Profile/CreateProject`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const EditProject = async (token, data,projectId) => {
  return await api.put(`/portfolio/project/${projectId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const DeleteProject = async (token, projectId) => {
  return await api.delete(`/Profile/project/${projectId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetUserProject = (token, userId = null) => {
  const endpoint = userId 
    ? `Profile/projects-by-user/${userId}` 
    : `Profile/projects-by-user`;
    
  return api.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
// Services(overviewTap) APIs
export const CreateService = async (token, data) => {
  return await api.post(`/Profile/my-services`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetUserService = async (token) => {
  return await api.get(`/Profile/my-services`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetUserServiceById = async (token, userId) => {
  return await api.get(`/Profile/services/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const RemoveService = async (token,serviceId) => {
  return await api.delete(`/Profile/my-services/${serviceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


