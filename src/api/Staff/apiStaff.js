import axios from 'axios';

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Staff';

export const getAllStaff = () => {
  return axios.get(`${API_BASE_URL}/get-all-staffs`, {
    headers: {
      'accept': '*/*'
    }
  });
};
export const getAllStaffWithoutBranch = () => {
  return axios.get(`https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/User/get-users-without-branch/3`, {
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

export const deleteStaff = (id) => {
  return axios.delete(`${API_BASE_URL}/delete?staffId=${id}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const updateStaff = (staff) => {
  return axios.put(`${API_BASE_URL}/update?staffId=${staff.staffId}`,
    {
      userId: staff.userId,
      branchId: staff.branchId,
      managerId: staff.managerId,
      startDate: staff.startDate,
      endDate: staff.endDate,
      position: staff.position,
      isActive: staff.isActive
    },
    {
      headers: {
        'accept': '*/*'
      }
    });
};