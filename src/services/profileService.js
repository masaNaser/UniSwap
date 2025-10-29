import api from "./api";

export const GetFullProfile = async (token) => {
  return await api.get(`/Profile`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const GetProfileById = async (token,userId) => {
  return await api.get(`/Profile/${userId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};