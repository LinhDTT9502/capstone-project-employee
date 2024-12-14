import { getListRefund } from "../../api/Staff/apiRefund";

export const getListOrderRefund = async (status, branchId) => {
  try {
    const response = await getListRefund(status, branchId);
    return response.data.data.$values; 
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};
