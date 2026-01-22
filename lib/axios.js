import axios from 'axios';

const apiClient = axios.create({
    // baseURL: 'https://abbded0cdab9.ngrok-free.app/api',
    baseURL: 'http://127.0.0.1:8000/api',
    // baseURL: '/api',
    // baseURL: 'https://6ed04ab49fd4.ngrok-free.app/api',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'ngrok-skip-browser-warning': 'true',
    }
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/order')) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('is_logged_in');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;