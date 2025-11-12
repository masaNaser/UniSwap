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


// Projects APIs
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

// Services APIs
export const CreateService = async (token, data) => {
  return await api.post(`/Profile/my-services`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetUserService = async (token) => {
  return await api.get(`/Profile/services`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const RemoveService = async (token,serviceId) => {
  return await api.delete(`/Profile/my-services/${serviceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};