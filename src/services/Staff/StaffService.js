import { getStaffbyBranch } from "../../api/Staff/apiStaff";

export const fetchStaffbyBranch = async (branchId) => {
    try {
      const response = await getStaffbyBranch(branchId);
      return response.data.data.$values; 
    } catch (error) {
      console.error('Error fetching staffs:', error);
      throw error;
    }
  };