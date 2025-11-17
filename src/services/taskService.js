// src/services/taskService.js
import api from './api';

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

export const getClientReviewCard = async (taskId, token) => {
  return await api.get(`/tasks/${taskId}/review-card`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ===== Create/Update/Delete Tasks =====
export const createTask = async (projectId, taskData, token) => {
  const formData = new FormData();
  formData.append('Title', taskData.title);
  formData.append('Description', taskData.description || '');
  
  if (taskData.deadline) {
    formData.append('Deadline', new Date(taskData.deadline).toISOString());
  }
  
  if (taskData.file) {
    formData.append('UploadFile', taskData.file);
  }

  return await api.post(`/tasks/project/${projectId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateTask = async (taskId, taskData, token) => {
  const formData = new FormData();
  formData.append('Title', taskData.title);
  formData.append('Description', taskData.description || '');
  
  if (taskData.deadline) {
    formData.append('Deadline', new Date(taskData.deadline).toISOString());
  }
  
  if (taskData.progressPercentage !== undefined) {
    formData.append('ProgressPercentage', taskData.progressPercentage);
  }
  
  if (taskData.file) {
    formData.append('UploadFile', taskData.file);
  }

  return await api.patch(`/tasks/${taskId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
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
  return await api.post(`/tasks/${taskId}/MoveToInProgress`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
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
    { comment: comment || '' },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const rejectTask = async (taskId, comment, token) => {
  return await api.post(
    `/tasks/${taskId}/reject`,
    { comment: comment || '' },
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

export const closeProject = async (projectId, token) => {
  return await api.post(
    `/tasks/${projectId}/close`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// ===== Auto Accept =====
export const autoAcceptDueTasks = async (token) => {
  return await api.post(
    `/tasks/auto-accept`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};