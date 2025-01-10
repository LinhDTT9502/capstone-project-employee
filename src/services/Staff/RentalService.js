import { approveExtensionAPI, approveRentalAPI, getListExtension, getRentalbyBranchAPI, getRentalbyStatusAPI, getRentalDetailAPI, getRentalsListAPI, rejectExtensionAPI, rejectRentalAPI, removeRentalAPI } from "../../api/Staff/apiRental";

export const getRentalsList = async () => {
  try {
    const response = await getRentalsListAPI();
    return response.data.data.$values;
  } catch (error) {
    console.error('Error fetching orders list:', error);
    throw error;
  }
};

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

    // Safely access the `data` field
    if (response.data && response.data.data) {

      return response.data.data.$values || null;
    }

  } catch (error) {
    console.error('Error fetching orders list:', error);
    throw error;
  }
};

export const approveRental = async (orderId) => {
  try {
    const response = await approveRentalAPI(orderId);
    return response.data.data;
  } catch (error) {
    console.error('Error approve:', error);
    throw error;
  }
};

export const rejectRental = async (orderId) => {
  try {
    const response = await rejectRentalAPI(orderId);
    return response.data.data;
  } catch (error) {
    console.error('Error approve:', error);
    throw error;
  }
};

export const removeRental = async (orderId) => {
  try {
    const response = await removeRentalAPI(orderId);
    return response.data;
  } catch (error) {
    console.error('Error remove:', error);
    throw error;
  }
};

export const fetchListExtension = async (extensionStatus, branchId) => {
  try {
    const response = await getListExtension(extensionStatus, branchId);
    return response.data;
  } catch (error) {
    console.error('Error :', error);
    throw error;
  }
};

export const approveExtension = async (rentalOrderCode) => {
  try {
    const response = await approveExtensionAPI(rentalOrderCode);
    return response.data.data;
  } catch (error) {
    console.error('Error approve:', error);
    throw error;
  }
};

export const rejectExtension = async (rentalOrderCode, rejectionReason) => {
  try {
    const response = await rejectExtensionAPI(rentalOrderCode, rejectionReason);
    return response.data.data;
  } catch (error) {
    console.error('Error approve:', error);
    throw error;
  }
};