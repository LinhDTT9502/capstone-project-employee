import axios from 'axios';

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/RefundRequest';

export const getListRefund = (orderType, status, branchId) => {
  return axios.get(`${API_BASE_URL}/getAll`, {
    headers: {
      'accept': '*/*'
    },
    params: {
      orderType: orderType,
        status: status,
        branchId: branchId
    }
  });
};

export const updateRefundApi = ( data, token) => {
  return axios.put(`${API_BASE_URL}/update`, data, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
};

