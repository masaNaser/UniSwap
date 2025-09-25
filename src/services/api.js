// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://uniswap.runasp.net/api', // رابط الباك عندك
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// api.interceptors.request.use(config => {
//     const token = localStorage.getItem('token'); // اسم المفتاح اللي خزنتي فيه التوكن
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api;

import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://uniswap.runasp.net/api',
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
            const response = await axios.post('https://uniswap.runasp.net/api/Account/refresh-token', { refreshToken });
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
