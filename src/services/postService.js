import api from "./api";

export const createPost = async (postData, token) => {
  return await api.post(`/Posts`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const getPosts = async (token,page=1,pageSize = 20) => {
  return await api.get(`/Posts?page=${page}&pageSize=${pageSize}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deletePost = async (token, postId) => {
  return await api.delete(`/Posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const RemoveImgInPost = async (token, postId) => {
  return await api.delete(`/Posts/${postId}/remove-image`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editPost = async (formData, token, postId) => {
  return await api.put(`/Posts/${postId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const likePost = async (token, postId) => {
  return await api.post(
    `/posts/${postId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const unlikePost = async (token, postId) => {
  return await api.delete(
    `/posts/${postId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getComments = async (token, postId) => {
  return await api.get(`/Comments?postId=${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addComment = async (token, postId, content) => {
  return await api.post(
    `/Comments/${postId}`,
    { content: content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const editComment = async (token, commentId, content) => {
  return await api.put(
    `/Comments/${commentId}`,
    {
      id: commentId,
      content: content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteComment = async (token, commentId) => {
  return await api.delete(`/Comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


export const closeCommentPost = async (token, postId) => {
  return await api.put(`/Posts/${postId}/close`,
    {}, 
{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
