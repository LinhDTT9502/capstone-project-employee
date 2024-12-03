import axios from "axios";

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder';

export const getRentalbyStatusAPI = (orderStatus) => {
    return axios.get(`${API_BASE_URL}/get-rental-orders-by-status`, {
      headers: {
        'accept': '*/*'
      },
      params: {
        orderStatus: orderStatus
      }
    });
  };

  export const getRentalDetailAPI = (orderCode) => {
    return axios.get(`${API_BASE_URL}/get-rental-order-by-orderCode?orderCode=${orderCode}`, {
      headers: {
        'accept': '*/*'
      }
    });
  };

  export const getRentalbyBranchAPI = (branchId) => {
    return axios.get(`${API_BASE_URL}/get-orders-by-branch?branchId=${branchId}`, {
      headers: {
        'accept': '*/*'
      }
    });
  };