import api from "./api";

// GET ALL
export const getServices = async (token) => {
  return await api.get("/Services", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET ONE
export const getOneServices = async (token, serviceId) => {
  return await api.get(`/Services/${serviceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// CREATE
export const CreateServices = async (token, data) => {
  const fd = new FormData();

  fd.append("Name", data.name);
  fd.append("Description", data.description);

  if (data.image) {
    fd.append("Image", data.image);
  }

  return await api.post("/Services", fd, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// EDIT
export const EditServices = async (token, id, data) => {
  const fd = new FormData();

  if (data.name) fd.append("Name", data.name);
  if (data.description) fd.append("Description", data.description);
  if (data.image) fd.append("Image", data.image);

  return await api.put(`/Services?id=${id}`, fd, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// DELETE
export const DeleteServices = async (token, id) => {
  return await api.delete(`/Services`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { id }, // لازم
  });
};
