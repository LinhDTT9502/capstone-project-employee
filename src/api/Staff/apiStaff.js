import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Staff';

export const getAllStaff = () => {
  return axios.get(`${API_BASE_URL}/get-all-staffs`, {
    headers: {
      'accept': '*/*'
    }
  });
};
export const getStaffbyBranch = (branchId) => {
  return axios.get(`${API_BASE_URL}/get-staffs-by-branch?branchId=${branchId}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const createNewStaff = (newStaff) => {
  return axios.post(`${API_BASE_URL}/create`, {
    userId: newStaff.userId,
    branchId: newStaff.branchId,
    managerId: newStaff.managerId,
    startDate: newStaff.startDate,
    position: newStaff.position
  }, {
    headers: {
      'accept': '*/*'
    }
  });
};