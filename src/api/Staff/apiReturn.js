import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/ReturnRequest';

export const getListReturn = () => {
  return axios.get(`${API_BASE_URL}/get-all`, {
    headers: {
      'accept': '*/*'
    },
  });
};

export const getListReturnbyBranch = (branchId) => {
  return axios.get(`${API_BASE_URL}/branch/${branchId}`, {
    headers: {
      'accept': '*/*'
    },
  });
};

export const updateReturndApi = ( returnID, data) => {
  return axios.put(`${API_BASE_URL}/${returnID}`, data, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
    }
  });
};

