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
    userName: data.username, // Map 'username' to 'userName'
    email: data.email,
    fullName: data.fullName,
    gender: data.gender,
    phoneNumber: data.phone, // Map 'phone' to 'phoneNumber'
    dob: data.birthDate, // Map 'birthDate' to 'dob'
    address: data.address || "", // Provide a default value if 'address' is not available
    roleId: parseInt(data.roleId, 10), // Convert 'roleId' to a number if it's a string
    hashPassword: data.password, // Map 'password' to 'hashPassword'
  };
  return axios.post(`${API_BASE_URL}/create-user`,payload, {

    headers: {
      'accept': '*/*'
    }
  });
};