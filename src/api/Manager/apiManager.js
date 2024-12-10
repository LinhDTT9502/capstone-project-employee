import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Manager';

export const getAllManagers = () => {
    return axios.get(`${API_BASE_URL}/get-all-managers`, {
      headers: {
        'accept': '*/*'
      }
    });
  };