import { getProductColor, getProductSize } from "../api/apiProduct";

export const fetchProductColor = async (productCode) => {
  try {
    const response = await getProductColor(productCode);
    return response.data.data.$values;
  } catch (error) {
    console.error(`Error fetching product:`, error);
    throw error;
  }
};

export const fetchProductSize = async (productCode, color) => {
  try {
    const response = await getProductSize(productCode, color);
    return response.data.data.$values;
  } catch (error) {
    console.error(`Error fetching product with :`, error);
    throw error;
  }
};