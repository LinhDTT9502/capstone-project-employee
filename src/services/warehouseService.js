import { getProductofBranchAPI } from "../api/apiWarehouse";

export const fetchProductsbyBranch = async (branchId) => {
    try {
      const response = await getProductofBranchAPI(branchId);
      return response.data.data.$values
    } catch (error) {
      console.error('Error fetching Warehouse data:', error);
      throw error;
    }
  };
  