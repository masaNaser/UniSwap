export const mapProjectStatus = (status) => {
  // If already a string, return as is (handle both PascalCase and normal case)
  if (typeof status === 'string') {
    const statusMap = {
      'active': 'Active',
      'completed': 'Completed',
      'overdue': 'Overdue',
      'submittedforfinalreview': 'SubmittedForFinalReview',
      'submitted for final review': 'SubmittedForFinalReview',
      'submitted for review': 'SubmittedForFinalReview',
      'submittedForFinalReview': 'SubmittedForFinalReview',
      'SubmittedForFinalReview': 'SubmittedForFinalReview',
    };
    
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '');
    return statusMap[normalizedStatus] || status;
  }

  // If numeric, map to string
  const statusMapping = {
    0: 'Active',
    1: 'Completed',
    2: 'Overdue',
    3: 'SubmittedForFinalReview',
  };

  return statusMapping[status] || 'Active';
};

export const mapProjectsWithStatus = (projects) => {
  if (!Array.isArray(projects)) return [];

  return projects.map(project => ({
    ...project,
    projectStatus: project.projectStatus 
      ? mapProjectStatus(project.projectStatus)
      : project.status 
        ? mapProjectStatus(project.status)
        : 'Active'
  }));
};

export const getStatusDisplayLabel = (status) => {
  const labelMap = {
    'All Status': 'All Status',
    'Active': 'Active',
    'Completed': 'Completed',
    'Overdue': 'Overdue',
    'SubmittedForFinalReview': 'Submitted For Review',
  };

  return labelMap[status] || status;
};