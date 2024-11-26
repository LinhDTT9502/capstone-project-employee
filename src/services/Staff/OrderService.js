import { approveOrderAPI, getOrderbyBranchAPI, getOrderbyStatusAPI, getOrderDetailAPI, getOrderListAPI, rejectOrderAPI } from "../../api/Staff/apiOrder";

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

export const getOrderbyBranch = async (branchId) => {
  try {
    const response = await getOrderbyBranchAPI(branchId);
    return response.data.data.$values; 
  } catch (error) {
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