import axios from 'axios';

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Auth';

export const signIn = (userName, password) => {
  return axios.post(`${API_BASE_URL}/sign-in`, {
    userName,
    password,
  }, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const refreshTokenAPI = (token, refreshToken,userId) => {
  console.log(token);
  
  return axios.post(`https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Auth/refresh-token`, {
    token,
    refreshToken,
    userId
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};