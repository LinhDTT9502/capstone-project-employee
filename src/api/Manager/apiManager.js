import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Manager';

export const getAllManagers = () => {
  return axios.get(`${API_BASE_URL}/get-all-managers`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const getAllManagerWithoutBranch = () => {
  return axios.get(`https://capstone-project-703387227873.asia-southeast1.run.app/api/User/get-users-without-branch/2`, {
    headers: {
      'accept': '*/*'
    }
  });
};


export const createNewManager = (newManager) => {
  return axios.post(`${API_BASE_URL}/create-manager`, {
    userId: newManager.userId,
    branchId: newManager.branchId,
    startDate: newManager.startDate,
    endDate: newManager.endDate,
  }, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const updateManager = (manager) => {
  return axios.put(`${API_BASE_URL}/update-manager?managerId=${manager.managerId}`,
    {
      userId: manager.userId,
      branchId: manager.branchId,
      startDate: manager.startDate,
      endDate: manager.endDate,
    },
    {
      headers: {
        'accept': '*/*'
      }
    });
};

export const deleteManager = (id) => {
  return axios.delete(`${API_BASE_URL}/delete-manager?managerId=${id}`, {
    headers: {
      'accept': '*/*'
    }
  });
};
