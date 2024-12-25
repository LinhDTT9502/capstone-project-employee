import { changeBranchStatusApi, createBranch, deleteBranchByIdApi, getAllBranchs, getBranchDetail, updateBranchAPI } from "../api/apiBranch";

export const fetchBranchs = async () => {
  try {
    const response = await getAllBranchs();
    return response.data.data.$values;
  } catch (error) {
    console.error('Error fetching brand data:', error);
    throw error;
  }
};

export const fetchBranchDetail = async (branchId) => {
  try {
    const response = await getBranchDetail(branchId);
    return response.data;
  } catch (error) {
    console.error('Error fetching brand data:', error);
    throw error;
  }
};

export const addNewBranch = async (branchData) => {
  try {
    const response = await createBranch(branchData);
    console.log(response);

    return response.data;
  } catch (error) {
    console.error('Error adding branch:', error);
    throw error;
  }
};

export const getBranchs = async () => {
  try {
    const response = await getAllBranchs();
    return response.data.data.$values;
  } catch (error) {
    console.error('Error fetching brand data:', error);
    throw error;
  }
};

export const removeBranch = async (id) => {
  try {
    const response = await deleteBranchByIdApi(id);
    return response;
  } catch (error) {
    console.error(`Error deleting feedback with ID ${id}:`, error);
    throw error;
  }
};

// Change branch status
export const changeBranchStatus = async (branchId) => {
  try {
    const response = await changeBranchStatusApi(branchId);
    return response;
  } catch (error) {
    console.error("Error changing user status:", error);
    throw error;
  }
};

// Update branch by ID
export const updateBranchById = async (branchId, branchData) => {
  try {
    console.log(branchData);

    const response = await updateBranchAPI(branchId, branchData);
    console.log(response);

    return response.data;
  } catch (error) {
    console.error(`Error updating branch with ID ${branchId}:`, error);
    throw error;
  }
};