
import api from "./api";

export const Search = async (query,token) => {
  return await api.get(`/search`, {
       params: { query }, 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};