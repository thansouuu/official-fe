import axios from 'axios';

export const axiosInstance = (options = {}) => {
    const { formData = false } = options;

    const headers = {};

    headers['Content-Type'] = !formData ? 'application/json' : 'multipart/form-data';

    const instance = axios.create({
        baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
        timeout: 30000,
        headers,
    });

    // Add a request interceptor
    instance.interceptors.request.use(
        function (config) {
            const getToken = localStorage.getItem('accessToken');

            if (getToken) {
                config.headers['Authorization'] = `Bearer ${getToken}`;
            }

            return config;
        },
        function (error) {
            // Do something with request error
            return Promise.reject(error);
        },
    );

    // Add a response interceptor
    instance.interceptors.response.use(
        function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response.data;
        },
        function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            return Promise.reject(error);
        },
    );

    return instance;
};
