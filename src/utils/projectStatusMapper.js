// src/utils/projectStatusMapper.js

/**
 * Maps ProjectStatus enum values (numbers) to readable strings
 * Backend returns: 0, 1, 2, 3, etc.
 * Frontend needs: "Active", "Completed", "SubmittedForFinalReview", etc.
 */

export const ProjectStatusEnum = {
  Active: 0,
  Completed: 1,
  SubmittedForFinalReview: 2,
  Overdue: 3,
  Pending: 4,
};

export const mapProjectStatus = (status) => {
  console.log('🔄 Mapping status:', status, 'Type:', typeof status);
  
  // If already a string, return as is
  if (typeof status === 'string') {
    console.log('✅ Already string:', status);
    return status;
  }

  // If number, map to string
const statusMap = {
  0: 'Active',
  1: 'Completed',
  2: 'SubmittedForFinalReview',  // ✅ هذا الاسم بالضبط!
  3: 'Overdue',
  4: 'Pending',
};

  const result = statusMap[status] || 'Active';
  console.log('✅ Mapped to:', result);
  
  return result;
};

/**
 * Maps an entire project object to include readable status
 */
export const mapProjectWithStatus = (project) => {
  if (!project) return project;

  return {
    ...project,
    projectStatus: mapProjectStatus(project.projectStatus || project.status),
    status: mapProjectStatus(project.projectStatus || project.status),
  };
};

/**
 * Maps array of projects to include readable statuses
 */
export const mapProjectsWithStatus = (projects) => {
  if (!Array.isArray(projects)) return [];
  return projects.map(mapProjectWithStatus);
};