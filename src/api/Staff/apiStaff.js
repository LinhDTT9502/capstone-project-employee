import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Staff';

export const getStaffbyBranch = (branchId) => {
    return axios.get(`${API_BASE_URL}/get-staffs-by-branch?branchId=${branchId}`, {
      headers: {
        'accept': '*/*'
      }
    });
  };