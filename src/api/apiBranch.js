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
  return axios.post(`${API_BASE_URL}/add-branch/`, branchData, {
    headers: {
      'accept': '*/*',
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const deleteBranchByIdApi = (branchId) => {
  const response = axios.delete(`${API_BASE_URL}/delete-branch/${branchId}`, {
    headers: {
      'accept': '*/*'
    }
  });
  return response;
};

// Change branch status
export const changeBranchStatusApi = (branchId) => {
  return axios.put(`${API_BASE_URL}/edit-status/${branchId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateBranchAPI = async (branchId, branchData) => {
  try {
    return axios.put(`${API_BASE_URL}/update-branch/${branchId}`, branchData, {
      headers: {
        'accept': '*/*',
        'Content-Type': 'multipart/form-data',
      }
    });
  } catch (error) {
    throw new Error(`Failed to update branch: ${error.message}`);
  }
};
