// src/services/reviewService.js
import api from "./api";

// ===== Client Review to Provider =====
// NOTE: This function is currently NOT USED in the project close flow.
// The review is now submitted as part of closeProjectByClient() in taskService.js
// Keeping this for potential future standalone review functionality.
export const addClientReviewToProvider = async (projectId, rating, content, token) => {
  return await api.post(
    `/reviews/client-to-provider`,
    { 
      rating: Number(rating),
      content: content || 'Project completed successfully'
    },
    {
      params: { 
        ProjectId: projectId  // Capital P to match backend parameter name
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