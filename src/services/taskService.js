import api from "./api";

// ===== Get Tasks =====
export const getTasksByStatus = async (projectId, status = null, token) => {
  const params = {};
  if (status) params.status = status;

  return await api.get(`/tasks/project/${projectId}`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getProjectTaskDetails = async (projectId, token) => {
  return await api.get(`/tasks/${projectId}/task-details`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ===== Create/Update/Delete Tasks =====
export const createTask = async (projectId, formData, token) => {
  return await api.post(`/tasks/project/${projectId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateTask = async (taskId, formData, token) => {
  return await api.patch(`/tasks/${taskId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteTask = async (taskId, token) => {
  return await api.delete(`/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ===== Task Status Transitions =====
export const moveToInProgress = async (taskId, token) => {
  return await api.post(
    `/tasks/${taskId}/MoveToInProgress`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const submitForReview = async (taskId, reviewDueAt, token) => {
  return await api.post(
    `/tasks/${taskId}/submit-review`,
    { reviewDueAt: reviewDueAt ? new Date(reviewDueAt).toISOString() : null },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// ===== Client Review Decisions =====
export const acceptTask = async (taskId, comment, token) => {
  return await api.post(
    `/tasks/${taskId}/accept`,
    { comment: comment || "" },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const rejectTask = async (taskId, comment, token) => {
  return await api.post(
    `/tasks/${taskId}/reject`,
    { comment: comment || "" },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// ===== Project Management =====
export const updateProjectProgress = async (projectId, token) => {
  return await api.post(
    `/tasks/project/${projectId}/update-progress`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const closeProjectByClient = async (projectId, token,data) => {
  return await api.post(`/Projects/${projectId}/close-by-client`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
              'Content-Type': 'application/json'

    }
  );
};

export const closeProjectByProvider = async (projectId, token) => {
  return await api.post(`/Projects/${projectId}/close-by-provider`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
              'Content-Type': 'application/json'

    }
  );
};

// // ===== Auto Accept =====
// export const autoAcceptDueTasks = async (token) => {
//   return await api.post(
//     `/tasks/auto-accept`,
//     {},
//     {
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
// };
