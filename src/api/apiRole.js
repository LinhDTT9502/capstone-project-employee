import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Role';

// Get all roles
export const getAllRoles = () => {
  return axios.get(`${API_BASE_URL}/list-all-roles`, {
    headers: {
      'accept': '*/*'
    }
  });
};


// Get role details by roleId
export const getRoleDetails = (roleId) => {
    return axios.get(`${API_BASE_URL}/get-role-details/${roleId}`);
  };

  // Add new role
export const addRole = (roleData) => {
    return axios.post(`${API_BASE_URL}/add-role`, roleData);
  };

// Edit role by ID
export const editRole = (roleId, roleData) => {
    return axios.post(`${API_BASE_URL}/edit-role/${roleId}`, roleData);
  };
  
  
// Remove role by ID
export const removeRole = (id) => {
    return axios.post(`${API_BASE_URL}/remove-role?roleId=${id}`, {
    });
  };