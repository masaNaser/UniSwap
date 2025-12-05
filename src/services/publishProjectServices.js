import api from "./api";

// Get all projects by subservice
export const getProjectBySubServices = async (token, id) => {
  return await api.get(`/PublishProjects/by-subservice/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get paginated projects by subservice
export const browseProjectsBySubService = async (
  token,
  subServiceId,
  page,
  pageSize
) => {
  if (!subServiceId) {
    throw new Error("subServiceId is required");
  }

  console.log("Calling browse API with:", { subServiceId, page, pageSize });

  return await api.get(`/PublishProjects/browse/${subServiceId}`, {
    params: {
      Page: page,
      PageSize: pageSize,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const publishFromCompletedProject = async (
  token,
  projectId,
  formData
) => {
  return await api.post(`/PublishProjects?projectId=${projectId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editPublishProject = async (token, publishProjectId, formData) => {
  try {
    const response = await api.put(
      `/PublishProjects/${publishProjectId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error editing publish project:", error);
    throw error;
  }
};
