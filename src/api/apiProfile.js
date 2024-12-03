import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Employee';

export const getProfileAPI = (id) => {
  return axios.get(`${API_BASE_URL}/get-profile?id=${id}`, {
    headers: {
      'accept': '*/*'
    }
  });
};