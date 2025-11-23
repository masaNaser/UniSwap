// src/services/reviewService.js
import api from "./api";

// ===== Client Review to Provider =====
export const addClientReviewToProvider = async (projectId, rating, content, token) => {
  // Backend expects: POST /reviews/client-to-provider
  // With ProjectId as query parameter (capital P) and body with rating and content
  return await api.post(
    `/reviews/client-to-provider`,
    { 
      rating: Number(rating),
      content: content || 'Project completed successfully'
    },
    {
      params: { 
        ProjectId: projectId  // Capital P to match backend parameter name exactly
      },
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }
  );
};

// ===== Get Reviews =====
export const getReviewByProject = async (projectId, token) => {
  return await api.get(`/reviews/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

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