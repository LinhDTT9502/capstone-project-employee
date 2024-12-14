import { getListRefund, updateRefundApi } from "../../api/Staff/apiRefund";

export const getListOrderRefund = async (orderType, status, branchId) => {
  try {
    const response = await getListRefund(orderType, status, branchId);
    return response.data.data.$values; 
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const updateRefund = async (data, token) => {
  try {
    const response = await updateRefundApi(data, token);
    return response; 
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};
