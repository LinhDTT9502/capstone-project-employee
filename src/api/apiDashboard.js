import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder';

export const fetchOrdersAPI = () => {
  return axios.get(`${API_BASE_URL}/get-all-sale-orders`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
