import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Branch';

export const getAllBranchs = () => {
  return axios.get(`${API_BASE_URL}/list-all`, {
    headers: {
      'accept': '*/*'
    }
  });
};
export const getBranchDetail = (branchId) => {
  return axios.get(`${API_BASE_URL}/get-branch-by-id/${branchId}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const createBranch = async (branchData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/add-branch`, {
      method: 'POST',
      body: branchData, // Gửi formData trực tiếp
    });

    if (!response.ok) {
      throw new Error('Failed to create branch');
    }

    // Trả về dữ liệu JSON nếu yêu cầu thành công
    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteBranch = (branchId) => {
  const response = axios.post(`${API_BASE_URL}/delete-branch/${branchId}`, {
    headers: {
      'accept': '*/*'
    }
  });
  return response;
};