import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Warehouse';


export const fetchAllWarehousesApi = () => {
  return axios.get(`${API_BASE_URL}/list-all`, {
    headers: {
      "accept": "*/*",
    },
  });
};

export const getProductofBranchAPI = (branchId) => {
  const url = `${API_BASE_URL}/list-products-of-branch/${branchId}`;
  return axios.get(url, {
    headers: {
      'accept': '*/*'
    }
  });
};


export const updateQuantity = (warehouseId, availableQuantity, totalQuantity) => {
  return axios.put(`${API_BASE_URL}/update-quantity-of-warehouse/${warehouseId}?availableQuantity=${availableQuantity}&totalQuantity=${totalQuantity}`, {
    headers: {
      accept: '*/*',
    },
  });
};