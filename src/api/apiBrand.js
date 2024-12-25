import axios from "axios";

const API_BASE_URL = "https://capstone-project-703387227873.asia-southeast1.run.app/api/Brand";

// Fetch all brands
export const fetchAllBrandsApi = () => {
  return axios.get(`${API_BASE_URL}/list-all`, {
    params: { status: true },
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
export const createBrandApi = (formData, token) => {
  console.log(token);

  return axios.post(`${API_BASE_URL}/add-brand`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};


// Update a brand by ID
export const updateBrandApi = (brandId, formData, token) => {
  return axios.put(`${API_BASE_URL}/update-brand/${brandId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete a brand by ID
export const deleteBrandApi = (brandId) => {
  return axios.delete(`${API_BASE_URL}/delete-brand/${brandId}`, {

    headers: {
      "accept": "*/*",
    },
  });
};

// Change brand status
export const changeBrandStatusApi = (brandId) => {
  return axios.put(`${API_BASE_URL}/edit-status/${brandId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
