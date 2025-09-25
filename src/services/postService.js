
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