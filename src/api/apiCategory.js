import axios from "axios";

const API_BASE_URL = "https://capstone-project-703387227873.asia-southeast1.run.app/api/Category";

// Get all categories
export const getAllCategories = () => {
  return axios.get(`${API_BASE_URL}/list-categories`, {
    params: { status: true },
    headers: {
      "accept": "*/*",
    },
  });
};

// Get category details by ID
export const getCategoryDetails = (categoryId) => {
  return axios.get(`${API_BASE_URL}/get-category-by-id/${categoryId}`, {
    headers: {
      "accept": "*/*",
    },
  });
};

// Add a new category
export const addCategory = (categoryData) => {
  return axios.post(`${API_BASE_URL}/add-category`, categoryData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Add multiple categories
export const addCategories = (categoriesData) => {
  return axios.post(`${API_BASE_URL}/add-categories`, categoriesData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Update category by ID
export const updateCategory = (categoryId, categoryData) => {
  return axios.put(`${API_BASE_URL}/update-category/${categoryId}`, categoryData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete category by ID
export const deleteCategory = (categoryId) => {
  return axios.delete(`${API_BASE_URL}/delete-category/${categoryId}`, {
    headers: {
      "accept": "*/*",
    },
  });
};

// Change category status
export const changeCategoryStatusApi = (categoryId) => {
  return axios.put(`${API_BASE_URL}/edit-status/${categoryId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

