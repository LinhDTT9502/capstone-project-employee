import { createBranch, deleteBranch, getAllBranchs, getBranchDetail } from "../api/apiBranch";

export const fetchBranchs = async () => {
  try {
    const response = await getAllBranchs();
    return response.data.data.$values;
  } catch (error) {
    console.error('Error fetching brand data:', error);
    throw error;
  }
};

export const fetchBranchDetail = async (branchId ) => {
  try {
    const response = await getBranchDetail(branchId );
    return response.data;
  } catch (error) {
    console.error('Error fetching brand data:', error);
    throw error;
  }
};

export const addNewBranch = async (branchData) => {
  try {
      const result = await createBranch(branchData);
      return result.data;
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
      const response = await deleteBranch(id);
      return response; 
    } catch (error) {
      console.error(`Error deleting feedback with ID ${id}:`, error);
      throw error;
    }
  };