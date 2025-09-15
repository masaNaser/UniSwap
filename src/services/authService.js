import api from './api';

export const register = (data) => api.post('/Account/register', data);
export const login = (credentials) => api.post('/Account/login', credentials);
export const forgotPassword = (data) => api.post('/Account/ForgotPassword', data);
export const resetPassword = ({ token, userId, newPassword }) =>
    api.post('/Account/reset-password', { token, userId, newPassword });
