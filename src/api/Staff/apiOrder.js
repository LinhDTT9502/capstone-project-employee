import axios from 'axios';

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/SaleOrder';

export const getOrderListAPI = () => {
  return axios.get(`${API_BASE_URL}/get-all-sale-orders`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const getOrderDetailAPI = (orderId) => {
  return axios.get(`${API_BASE_URL}/get-sale-order-detail?orderId=${orderId}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const getOrderbyCodeAPI = (orderCode) => {
  return axios.get(`${API_BASE_URL}/get-order-by-code?orderCode=${orderCode}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const getOrderbyBranchAPI = (branchId) => {
  return axios.get(`${API_BASE_URL}/get-orders-by-branch?branchId=${branchId}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const getOrderbyStatusAPI = (orderStatus) => {
  return axios.get(`${API_BASE_URL}/get-orders-by-status`, {
    headers: {
      'accept': '*/*'
    },
    params: {
      orderStatus: orderStatus
    }
  });
};


export const approveOrderAPI = (orderId) => {
  return axios.post(`${API_BASE_URL}/${orderId}/approve`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const rejectOrderAPI = (orderId) => {
  return axios.post(`${API_BASE_URL}/${orderId}/reject`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const removeOrderAPI = (orderId) => {
  return axios.delete(`${API_BASE_URL}/remove/${orderId}`, {
    headers: {
      'accept': '*/*'
    }
  });
};