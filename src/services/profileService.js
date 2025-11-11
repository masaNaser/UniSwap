import api from "./api";

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