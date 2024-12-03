import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Warehouse';


export const getProductofBranchAPI = (branchId) => {
    const url = `${API_BASE_URL}/list-products-of-branch/${branchId}`;
    return axios.get(url, {
      headers: {
        'accept': '*/*'
      }
    });
  };
  