
import api from './api';
 
export const createPost = async (postData, token) => {
    return await api.post(`/Posts`, postData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
}

export const getPosts = async ( token) => {
    return await api.get(`/Posts`,{
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
}

export const deletePost = async (token,id) => {
    return await api.delete(`/Posts/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
}

export const editPost = async (formData, token, id) => {
    return await api.put(`/Posts/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const likePost = async (token,id)=>{
    return await api.get(`/posts/${id}/like`,{
         headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    );
}