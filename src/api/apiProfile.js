import axios from 'axios';

const API_BASE_URL = 'https://twosportapi-295683427295.asia-southeast2.run.app/api/Employee';

export const getProfileAPI = (id) => {
  return axios.get(`${API_BASE_URL}/get-profile?id=${id}`, {
    headers: {
      'accept': '*/*'
    }
  });
};