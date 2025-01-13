import axios from 'axios';
import axiosInstance from './axiosInstance';

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/User';

export const getUserProfile = (userId) => {
  return axiosInstance.get(`${API_BASE_URL}/get-profile?userId=${userId}`);
};

