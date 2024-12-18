import { getAllBranchs, getBranchDetail } from "../api/apiBranch";

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