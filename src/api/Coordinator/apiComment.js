import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Comment';

// export const getOrderDetailAPI = (productCode) => {
//   return axios.get(`${API_BASE_URL}/get-all-comments/${orderId}`, {
//     headers: {
//       'accept': '*/*'
//     }
//   });
// };

export const getCommentsbyProductCodeAPI = (productCode) => {
  return axios.get(`${API_BASE_URL}/get-all-comments/${productCode}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const getCommentByIdAPI = (commentId) => {
  return axios.get(`${API_BASE_URL}/get-comment-by-id/${commentId}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const getAllCommentsAPI = () => {
  return axios.get(`${API_BASE_URL}/get-all-comments/`, {
    headers: {
      'accept': '*/*'
    }
  });
};

// export const getOrderbyBranchAPI = (branchId) => {
//   return axios.get(`${API_BASE_URL}/get-orders-by-branch?branchId=${branchId}`, {
//     headers: {
//       'accept': '*/*'
//     }
//   });
// };

// export const getOrderbyStatusAPI = (orderStatus) => {
//   return axios.get(`${API_BASE_URL}/get-orders-by-status`, {
//     headers: {
//       'accept': '*/*'
//     },
//     params: {
//       orderStatus: orderStatus
//     }
//   });
// };


// export const approveOrderAPI = (orderId) => {
//   return axios.post(`${API_BASE_URL}/${orderId}/approve`, {
//     headers: {
//       'accept': '*/*'
//     }
//   });
// };

// export const rejectOrderAPI = (orderId) => {
//   return axios.post(`${API_BASE_URL}/${orderId}/reject`, {
//     headers: {
//       'accept': '*/*'
//     }
//   });
// };

// export const removeOrderAPI = (orderId) => {
//   return axios.delete(`${API_BASE_URL}/remove/${orderId}`, {
//     headers: {
//       'accept': '*/*'
//     }
//   });
// };