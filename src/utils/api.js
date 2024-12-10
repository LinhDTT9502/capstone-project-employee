/* eslint-disable no-unused-vars */
import axios from 'axios';

const api = axios.create({
	baseURL: 'https://capstone-project-703387227873.asia-southeast1.run.app/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

// Thêm interceptor vào axios instance
api.interceptors.request.use(
	function (config) {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	function (response) {
		return response;
	},
	async function (error) {
		console.log('Error in interceptor:', error.response?.status); // Debugging line
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const refreshToken = localStorage.getItem('refreshToken');
			try {
				const response = await axios.post('/auth/refresh', { token: refreshToken });
				const { accessToken } = response.data;
				localStorage.setItem('accessToken', accessToken);
				originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch (err) {
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);

export default api;
