import { getAllProductsAPI, getProductByProductCode, getProductByProductCodeAPI, getProductColor, getProductSize } from "../api/apiProduct";

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

export const fetchProductByProductCode = async (productCode, color, size, condition) => {
  try {
    const response = await getProductByProductCode(productCode, color, size, condition);
    return response.data.$values;
  } catch (error) {
    console.error(`Error fetching product:`, error);
    throw error;
  }
};

export const fetchAProductByProductCode = async (productCode) => {
  try {
    const response = await getProductByProductCodeAPI(productCode);
    return response.data.$values;
  } catch (error) {
    console.error(`Error fetching product:`, error);
    throw error;
  }
};

export const fetchAllProducts = async () => {
  try {
    const response = await getAllProductsAPI();
    return response.data.data.$values;
  } catch (error) {
    console.error(`Error fetching product:`, error);
    throw error;
  }
};