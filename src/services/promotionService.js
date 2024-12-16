import {
    fetchAllPromotionsApi,
    createOrUpdatePromotionApi,
    deletePromotionApi,
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

// Delete a promotion
export const deletePromotion = async (productName) => {
  try {
    const response = await deletePromotionApi(productName);
    return response.data;
  } catch (error) {
    console.error("Error deleting promotion:", error);
    throw error;
  }
};
  