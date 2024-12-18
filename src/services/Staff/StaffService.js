import { createNewStaff, deleteStaff, getAllStaff, getAllStaffWithoutBranch, getStaffbyBranch, updateStaff } from "../../api/Staff/apiStaff";

export const fetchAllStaff = async () => {
  try {
    const response = await getAllStaff();
    return response.data.data.$values; 
  } catch (error) {
    console.error('Error fetching staffs:', error);
    throw error;
  }
};

export const fetchAllStaffWithoutBranch = async () => {
  try {
    const response = await getAllStaffWithoutBranch();
    return response.data.data.$values; 
  } catch (error) {
    console.error('Error fetching staffs:', error);
    throw error;
  }
};

export const fetchStaffbyBranch = async (branchId) => {
    try {
      const response = await getStaffbyBranch(branchId);
      return response.data.data.$values; 
    } catch (error) {
      console.error('Error fetching staffs:', error);
      throw error;
    }
  };

  export const createStaff = async (newStaff) => {
    try {
      const response = await createNewStaff(newStaff);
      return response.data; 
    } catch (error) {
      console.error('Error fetching staffs:', error);
      throw error;
    }
  };

  export const removeStaff = async (id) => {
    try {
      const response = await deleteStaff(id);
      return response.data; 
    } catch (error) {
      console.error(`Error deleting feedback with ID ${id}:`, error);
      throw error;
    }
  };

  export const editStaff = async (staff) => {
    try {
      const response = await updateStaff(staff);
      return response.data; 
    } catch (error) {
      console.error(`Error deleting feedback with ID ${id}:`, error);
      throw error;
    }
  };
  