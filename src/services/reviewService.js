import api from "./api";

export const addClientReviewToProvider = async (projectId, rating, content, token) => {
  return await api.post(
    `/reviews/client-to-provider`,
    { 
      rating: Number(rating),
      content: content || ''
    },
    {
      params: { 
        ProjectId: projectId 
      },
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }
  );
};

// ===== Get Review by Project =====
export const getReviewByProject = async (projectId, token) => {
  return await api.get(`/reviews/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ===== Get Public Reviews =====
export const getPublicReviews = async (publishProjectId, token) => {
  return await api.get(`/reviews/publish-projects/${publishProjectId}/reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ===== Add Public Review =====
export const addPublicReview = async (publishProjectId, rating, content, token) => {
  return await api.post(
    `/reviews/publish-projects/${publishProjectId}/reviews`,
    { rating, content },
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }
  );
};