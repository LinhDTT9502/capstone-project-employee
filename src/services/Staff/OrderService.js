import { approveOrderAPI, getOrderbyBranchAPI, getOrderbyCodeAPI, getOrderbyStatusAPI, getOrderDetailAPI, getOrderListAPI, rejectOrderAPI, removeOrderAPI } from "../../api/Staff/apiOrder";

export const getOrderList = async () => {
  try {
    const response = await getOrderListAPI();
    return response.data.data.$values;
  } catch (error) {
    console.error('Error fetching orders list:', error);
    throw error;
  }
};

export const getOrderDetail = async (orderId) => {
  try {
    const response = await getOrderDetailAPI(orderId);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching orders list:', error);
    throw error;
  }
};

export const getOrderbyCode = async (orderCode) => {
  try {
    const response = await getOrderbyCodeAPI(orderCode);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching orders list:', error);
    throw error;
  }
};
export const getOrderbyBranch = async (branchId) => {
  try {
    const response = await getOrderbyBranchAPI(branchId);

    // Debugging: Log the full response to understand its structure
    console.log('API response:', response);

    // Safely access the `data` field
    if (response.data && response.data.data) {

      return response.data.data.$values || null;
    }

    // Return null if `data` is not as expected
    return null;
  } catch (error) {
    console.error('null', error);
    console.error('Error fetching orders list:', error);
    throw error;
  }
};

export const getOrderbyStatus = async (orderStatus) => {
  try {
    const response = await getOrderbyStatusAPI(orderStatus);
    return response.data.data.$values;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const approveOrder = async (orderId) => {
  try {
    const response = await approveOrderAPI(orderId);
    return response.data.data;
  } catch (error) {
    console.error('Error approve:', error);
    throw error;
  }
};

export const rejectOrder = async (orderId) => {
  try {
    const response = await rejectOrderAPI(orderId);
    return response.data.data;
  } catch (error) {
    console.error('Error approve:', error);
    throw error;
  }
};

export const removeOrder = async (orderId) => {
  try {
    const response = await removeOrderAPI(orderId);
    return response.data;
  } catch (error) {
    console.error('Error remove:', error);
    throw error;
  }
};