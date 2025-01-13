import axios from "axios";

const API_BASE_URL = "https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Promotion";

// Fetch all promotions
export const fetchAllPromotionsApi = () => {
  return axios.get(`${API_BASE_URL}/get-all-promotions`, {
    headers: {
      "accept": "*/*",
    },
  });
};

// Create or update a promotion
export const createOrUpdatePromotionApi = (productName, percentDiscount) => {
  return axios.put(`${API_BASE_URL}/create-and-update-promotion/${productName}`, null, {
    params: {
      percentDiscount,
    },
  });
};

export const deletePromotionApi = (productName) => {
  return axios.delete(`${API_BASE_URL}/delete-promotion?productName=${productName}`, {
    headers: {
      "accept": "*/*",
    },
  });
};