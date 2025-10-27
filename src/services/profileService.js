import api from "./api";

export const GetFullProfile = async (token) => {
  return await api.get(`/portfolio`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};