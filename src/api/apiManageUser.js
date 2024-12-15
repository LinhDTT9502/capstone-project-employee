import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/User';

export const getAllUser = () => {
  return axios.get(`${API_BASE_URL}/get-all-users`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const createNewUser = (data) => {
  const payload = {
    userName: data.username, 
    email: data.email,
    fullName: data.fullName,
    gender: data.gender,
    phoneNumber: data.phone, 
    dob: data.birthDate, 
    address: data.address || "", 
    roleId: parseInt(data.roleId, 10), 
    hashPassword: data.password, 
  };
  return axios.post(`${API_BASE_URL}/create-user`,payload, {

    headers: {
      'accept': '*/*'
    }
  });
};

export const deleteUser = (id) => {
  return axios.delete(`${API_BASE_URL}/delete-user`, {
    params: { id }, 
    headers: {
      accept: '*/*',
    },
  });
};

export const updateUser = (id, data) => {
  return axios.put(`${API_BASE_URL}/update-user`, data, {
    params: { id }, 
    headers: {
      accept: '*/*',
    },
  });
};