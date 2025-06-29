import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/v1`;

export const API_URLS = {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_URL}/auth/reset-password`,
    GET_USER: `${API_URL}/user/get-user`,
    UPDATE_USER: `${API_URL}/user/update-user`,
    GET_ALL_USERS: `${API_URL}/user/get-all-users`,
    GET_USER_BY_ID: (id: string) => `${API_URL}/user/get-user/${id}`,
};


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Add the teacher token to the headers if it exists
        const token = localStorage.getItem('teacherToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Response Error:', error.response?.status, error.response?.data);

        // Don't redirect on 401 for auth endpoints (login/register)
        const isAuthEndpoint = error.config?.url?.includes('/auth/');

        if (error.response?.status === 401 && !isAuthEndpoint) {
            // Clear auth data on unauthorized (but not for auth endpoints)
            localStorage.removeItem('teacherToken');
            localStorage.removeItem('teacher');
            window.location.href = '/login';
        }

        if (!error.response) {
            // Handle network error
            console.error('Network error:', error);
            return Promise.reject(new Error('Network error'));
        }

        return Promise.reject(error);
    }
);

export default api;

export const deleteStudent = async (id: string) => {
    await api.delete(`/student/${id}`);
};


