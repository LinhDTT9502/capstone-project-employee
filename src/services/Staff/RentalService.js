import { getRentalbyBranchAPI, getRentalbyStatusAPI, getRentalDetailAPI } from "../../api/Staff/apiRental";


export const getRentalbyStatus = async (orderStatus) => {
    try {
      const response = await getRentalbyStatusAPI(orderStatus);
      return response.data.data.$values; 
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  };

  export const getRentalDetail = async (orderCode) => {
    try {
      const response = await getRentalDetailAPI(orderCode);
      return response.data; 
    } catch (error) {
      console.error('Error fetching orders list:', error);
      throw error;
    }
  };
  
export const getRentalbyBranch = async (branchId) => {
  try {
    const response = await getRentalbyBranchAPI(branchId);
    return response.data.data.$values; 
  } catch (error) {
    console.error('Error fetching orders list:', error);
    throw error;
  }
};