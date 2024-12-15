import {
  createNewUser,
  getAllUser,
  deleteUser as apiDeleteUser,
  updateUser as apiUpdateUser,
} from "../api/apiManageUser";

export const fetchAllUsers = async () => {
  try {
    const response = await getAllUser();
    return response.data.data.$values;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (data) => {
  try {
    const response = await createNewUser(data);
    return response.data.data.$values;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const removeUser = async (id) => {
  try {
    const response = await apiDeleteUser(id);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const editUser = async (id, data) => {
  try {
    const response = await apiUpdateUser(id, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
