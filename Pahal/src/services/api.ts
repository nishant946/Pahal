import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:3000';
//add /api/v1/ to the base url
const API_VERSION = '/api/v1';
const API_URL = `${BASE_URL}${API_VERSION}/`;

export const API_URLS = {
  LOGIN: `${API_URL}auth/login`,
  SIGNUP: `${API_URL}auth/signup`,
  FORGOT_PASSWORD: `${API_URL}auth/forgot-password`,
  RESET_PASSWORD: `${API_URL}auth/reset-password`,
  GET_USER: `${API_URL}user/get-user`,
  UPDATE_USER: `${API_URL}user/update-user`,
  GET_ALL_USERS: `${API_URL}user/get-all-users`,
  GET_USER_BY_ID: (id: string) => `${API_URL}user/get-user/${id}`,
};


const api=axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Add a token to the headers if it exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        return response.data;

    },
    (error) => {
        // Handle the error
        if(!error.response) {
            // Handle network error
            console.error('Network error:', error);
            return Promise.reject(new Error('Network error'));
        }
        if (error.response.status === 401) {
            // Redirect to login page if unauthorized
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;


