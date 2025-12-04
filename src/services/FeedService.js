
import api from "./api";

export const Search = async (query,token) => {
  return await api.get(`/search`, {
       params: { query }, 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const trendingServices = async (token) => {
  return await api.get(`/Feeds/trending-services`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const topContributors = async (token) => {
  return await api.get(`/Feeds/top-contributors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const trendingTopics = async (token) => {
  return await api.get(`/Feeds/trending-topics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};