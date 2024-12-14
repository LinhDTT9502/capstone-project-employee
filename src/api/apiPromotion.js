import axios from "axios";

const API_BASE_URL = "https://capstone-project-703387227873.asia-southeast1.run.app/api/Promotion";

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
  return axios.post(`${API_BASE_URL}/create-and-update-promotion/${productName}`, null, {
    params: {
      percentDiscount,
    },
  });
};