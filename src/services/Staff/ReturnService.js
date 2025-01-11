import { getListReturn, getListReturnbyBranch, updateReturndApi } from "../../api/Staff/apiReturn";

export const getListOrderReturn = async () => {
  try {
    const response = await getListReturn();
    return response.data.$values; 
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getListOrderReturnbyBranch = async (branchId) => {
  try {
    const response = await getListReturnbyBranch(branchId);
    return response.data.data.$values; 
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};


export const updateReturnd = async (returnID, data) => {
  try {
    const response = await updateReturndApi(returnID,data);
    return response; 
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};
