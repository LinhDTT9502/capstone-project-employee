import { deleteCommentAPI, getAllCommentsAPI, getChildCommentByParentIdAPI, getCommentByIdAPI, getCommentsbyProductCodeAPI, replyCommentAPI } from "../../api/Coordinator/apiComment";

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

export const getChildCommentsByParentCommentId = async (parenCommentId) => {
  try {
    const response = await getChildCommentByParentIdAPI(parenCommentId);
    return response.data.data.$values;
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

export const replyComment = async (productCode, parentCommentId, content, token) => {
  try {
    const response = await replyCommentAPI(productCode, parentCommentId, content, token);
    return response.data.data.$values;
  } catch (error) {
    console.error('Error fetching orders list:', error);
    throw error;
  }
};

// Delete comment by ID
export const deleteCommentById = async (commentId, token) => {
  try {
    const response = await deleteCommentAPI(commentId, token);
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment with ID ${commentId}:`, error);
    throw error;
  }
};