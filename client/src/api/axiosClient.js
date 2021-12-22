import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://qkmedia.herokuapp.com/',
    withCredentials: true,
    headers: {
        'content-type': 'application/json',
    },
});

axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        // Handle errors
        if (error.response.data.message === 'jwt expired') {
            return window.location.reload();
        }
        throw error.response.data;
    }
);

export default axiosClient;
