import axios from "axios";

const API_BASE_URL = "https://capstone-project-703387227873.asia-southeast1.run.app/api/Brand";

// Fetch all brands
export const fetchAllBrandsApi = () => {
  return axios.get(`${API_BASE_URL}/list-all`, {
    headers: {
      "accept": "*/*",
    },
  });
};

// Fetch brand details by ID
export const fetchBrandDetailsByIdApi = (brandId) => {
  return axios.get(`${API_BASE_URL}/get-brand-by-id/${brandId}`);
};

// Add a new brand
export const createBrandApi = (brandData, brandName, brandImage) => {
  return axios.post(`${API_BASE_URL}/add-brand?BrandName=${brandName}`, brandData, {
    params: {brandImage},
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
};

// Update a brand by ID
export const updateBrandApi = (brandId, brandData) => {
  return axios.post(`${API_BASE_URL}/update-brand/${brandId}`, brandData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
     "Content-Type": "application/json",
    },
  });
};
// Delete a brand by ID
export const deleteBrandApi = (brandId) => {
  return axios.post(`${API_BASE_URL}/delete-brand/${brandId}`);
};