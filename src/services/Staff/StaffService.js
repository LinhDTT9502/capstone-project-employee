import { createNewStaff, getAllStaff, getStaffbyBranch } from "../../api/Staff/apiStaff";

export const fetchAllStaff = async () => {
  try {
    const response = await getAllStaff();
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
      return response.data.data; 
    } catch (error) {
      console.error('Error fetching staffs:', error);
      throw error;
    }
  };