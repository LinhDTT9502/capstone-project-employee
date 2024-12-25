import {
  fetchAllBrandsApi,
  fetchBrandDetailsByIdApi,
  createBrandApi,
  updateBrandApi,
  deleteBrandApi,
  changeBrandStatusApi,
} from "../api/apiBrand";

// Fetch all brands
export const getAllBrands = async () => {
  try {
    const response = await fetchAllBrandsApi();

    const filteredBrands = response.data.data.$values.filter(
      (brand) => brand.status === true
    );

    return filteredBrands;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};


// Fetch brand details by ID
export const getBrandDetails = async (brandId) => {
  const response = await fetchBrandDetailsByIdApi(brandId);
  return response.data;
};

// Add a new brand
export const createBrand = async (formData, token) => {
  try {
    const response = await createBrandApi(formData, token);
    return response.data;
  } catch (error) {
    console.error("Error adding brand:", error);
    throw error;
  }
};


// Update a brand by ID
export const updateBrand = async (brandId, formData, token) => {
  try {
    const response = await updateBrandApi(brandId, formData, token);
    return response.data;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error;
  }
};


// Delete a brand by ID
export const removeBrand = async (brandId) => {
  const response = await deleteBrandApi(brandId);
  return response.data;
};

// Change brand status
export const changeBrandStatus = async (brandId) => {
  try {
    const response = await changeBrandStatusApi(brandId);
    return response;
  } catch (error) {
    console.error("Error changing brand status:", error);
    throw error;
  }
};