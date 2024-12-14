import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/RefundRequest';

export const getListRefund = (status, branchId) => {
  return axios.get(`${API_BASE_URL}/getAll`, {
    headers: {
      'accept': '*/*'
    },
    params: {
        status: status,
        branchId: branchId
    }
  });
};

