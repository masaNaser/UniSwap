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
// ✅ FIXED: Changed URL to match backend endpoint
export const getReviewByProject = async (projectId, token) => {
  console.log("📡 getReviewByProject - Request:", {
    projectId,
    endpoint: `/Projects/review/${projectId}`,  // ✅ Correct endpoint
  });

  try {
    const response = await api.get(`/Projects/review/${projectId}`, {  // ✅ FIXED URL
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