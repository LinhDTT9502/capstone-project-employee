import { toast } from "react-toastify";
import { createAdminUser, updateUser, getUserDetails, changeUserStatus } from "../api/apiAdmin";
import { fetchAllUsers as apiFetchAllUsers } from '../api/apiManageUser';

// Fetch All Users
export const fetchAllUsers = async () => {
  try {
    const users = await apiFetchAllUsers();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error("Error fetching users");
    throw error;
  }
};

// Create a new user
export const createNewUser = async (userData) => {
  try {
    await createAdminUser(userData);
    toast.success("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error.response?.data || error.message);
    toast.error("Error creating user");
    throw error;
  }
};

// Update user information
export const updateUserDetails = async (userId, updatedData) => {
  try {
    await updateUser(userId, updatedData);
    toast.success("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error.message);
    toast.error("Error updating user");
    throw error;
  }
};

// Get details for a specific user
export const fetchUserDetails = async (userId) => {
  try {
    const response = await getUserDetails(userId);
    return response.data?.result || response.data?.data;
  } catch (error) {
    console.error("Error fetching user details:", error.response || error);
    toast.error("Error fetching user details");
    throw error;
  }
};

// Change user status
export const toggleUserStatus = async (userId, currentStatus) => {
  try {
    const newStatus = !currentStatus;
    await changeUserStatus(userId, { isActive: newStatus });
    toast.success(`User status changed to ${newStatus ? "Active" : "Inactive"}`);
  } catch (error) {
    console.error("Error changing user status:", error);
    toast.error("Error changing user status");
    throw error;
  }
};
