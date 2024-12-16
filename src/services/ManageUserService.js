import {
  createNewUser,
  getAllUser,
  deleteUser as apiDeleteUser,
  updateUser as apiUpdateUser,
  getUserDetailsApi,
  changeUserStatusApi,
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

// Get user details
// Service function to get user details
export const getUserDetails = async (userId) => {
  try {
    const response = await getUserDetailsApi(userId);
    if (response.data.user?.isSuccess) {
      return response.data.user.data; 
    } else {
      throw new Error(response.data.user?.message || "Failed to fetch user details.");
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error
  }
};

// Change user status
export const changeUserStatus = async (userId, status) => {
  try {
    const response = await changeUserStatusApi(userId, status);
    return response.data;
  } catch (error) {
    console.error("Error changing user status:", error);
    throw error;
  }
};
