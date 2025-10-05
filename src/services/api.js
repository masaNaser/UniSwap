

import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://uni.runasp.net/',
        baseURL: '/api', // فقط /api عشان proxy يشتغل
    // headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
    //أ) جلب التوكنات من التخزين
    let token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const expiration = localStorage.getItem('accessTokenExpiration');
    const now = Math.floor(Date.now() / 1000); // الوقت الحالي بالثواني

    //إذا الوقت الحالي أكبر من وقت الانتهاء، يعني التوكن انتهت.
    //ونتأكد إنه عندنا refreshToken صالح للتجديد.
    if (expiration && now >= expiration && refreshToken) {
        try {
            const response = await axios.post('http://uni.runasp.net/Account/refresh-token', { refreshToken });
            token = response.data.accessToken;
            localStorage.setItem('accessToken', token);
            localStorage.setItem('accessTokenExpiration', response.data.exp); // حسب السيرفر
        } catch (err) {
            console.error('Refresh token failed', err);
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, error => Promise.reject(error));

export default api;
