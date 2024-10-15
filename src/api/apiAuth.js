import axios from 'axios';

const API_BASE_URL = 'https://twosportapi-295683427295.asia-southeast2.run.app/api/Employee';

export const signIn = (userName, password) => {
  return axios.post(`${API_BASE_URL}/log-in`, {
    userName,
    password,
  }, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const refreshTokenAPI = (token, refreshToken) => {
  return axios.post(`https://twosportapi-295683427295.asia-southeast2.run.app/api/Auth/refresh-token`, {
    token,
    refreshToken,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};