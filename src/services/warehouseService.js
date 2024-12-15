import { fetchAllWarehousesApi, getProductofBranchAPI } from "../api/apiWarehouse";

export const getAllWarehouses = async () => {
  try {
    const response = await fetchAllWarehousesApi();
    return response.data?.data?.$values;
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    throw error;
  }
};

export const fetchProductsbyBranch = async (branchId) => {
    try {
      const response = await getProductofBranchAPI(branchId);
      return response.data.data.$values
    } catch (error) {
      console.error('Error fetching Warehouse data:', error);
      throw error;
    }
  };
  