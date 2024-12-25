import { addProductAPI, changeProductStatusAPI, deleteProductAPI, getAllProductsAPI, getProductByProductCode, getProductByProductCodeAPI, getProductColor, getProductSize, updateProductAPI } from "../api/apiProduct";

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

export const changeProductStatus = async (productId) => {
  try {
    const response = await changeProductStatusAPI(productId);
    return response;
  } catch (error) {
    console.error(`Error update product status:`, error);
    throw error;
  }
};

// Update product by ID
export const updateProductById = async (productId, productData, token) => {
  try {
    const response = await updateProductAPI(productId, productData, token);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};

// Add product
export const addProduct = async (productData, token) => {
  try {
    const response = await addProductAPI(productData, token);
    return response.data;
  } catch (error) {
    console.error(`Error adding product:`, error);
    throw error;
  }
};

// Delete product by ID
export const deleteProductById = async (productId) => {
  try {
    const response = await deleteProductAPI(productId);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw error;
  }
};