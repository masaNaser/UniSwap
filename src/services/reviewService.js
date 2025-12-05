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
  console.log("📡 getReviewByProject - Request:", {
    projectId,
    endpoint: `/Projects/review/${projectId}`,
  });

  try {
    const response = await api.get(`/Projects/review/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ getReviewByProject - Success:", response.data);
    return response;
  } catch (error) {
    console.error("❌ getReviewByProject - Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// Add Public Review to Published Project
export const addPublicReview = async (publishProjectId, rating, content, token) => {
  console.log("📤 Adding public review:", {
    publishProjectId,
    rating,
    content,
  });

  return await api.post(
    `/PublishProjects/${publishProjectId}/reviews`,
    { 
      rating: Number(rating),
      content: content || '' 
    },
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }
  );
};

// Get Public Reviews for Published Project
export const getPublicReviews = async (publishProjectId, token) => {
  console.log("📡 Fetching public reviews for:", publishProjectId);

  return await api.get(`/PublishProjects/publish-projects/${publishProjectId}/reviews`, {
    headers: { 
      Authorization: `Bearer ${token}` 
    },
  });
};