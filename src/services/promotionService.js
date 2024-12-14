import {
    fetchAllPromotionsApi,
    createOrUpdatePromotionApi,
  } from "../api/apiPromotion";
  
  // Fetch all promotions
  export const getAllPromotions = async () => {
    try {
      const response = await fetchAllPromotionsApi();
      
      return response.data;
      
    } catch (error) {
      console.error("Error fetching promotions:", error);
      throw error;
    }
      
  };
  
  // Create or update a promotion
  export const createOrUpdatePromotion = async (productName, percentDiscount) => {
    try {
      const response = await createOrUpdatePromotionApi(productName, percentDiscount);
      return response.data;
    } catch (error) {
      console.error("Error creating/updating promotion:", error);
      throw error;
    }
  };
  