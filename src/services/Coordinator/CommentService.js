import { getAllCommentsAPI, getCommentByIdAPI, getCommentsbyProductCodeAPI } from "../../api/Coordinator/apiComment";

export const getAllCommentsByProductCode = async (productCode) => {
  try {
    const response = await getCommentsbyProductCodeAPI(productCode);
    return response.data.data.$values;
  } catch (error) {
    console.error('Error fetching orders list:', error);
    throw error;
  }
};

export const getCommentsById = async (commentId) => {
  try {
    const response = await getCommentByIdAPI(commentId);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching orders list:', error);
    throw error;
  }
};

export const getCommentList = async () => {
  try {
    const response = await getAllCommentsAPI();
    return response.data.data.$values;
  } catch (error) {
    console.error('Error fetching orders list:', error);
    throw error;
  }
};