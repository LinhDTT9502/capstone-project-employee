import {
    getAllCategories,
    getCategoryDetails,
    addCategory,
    addCategories,
    updateCategory,
    deleteCategory,
  } from "../api/apiCategory";
  
  // Fetch all categories
  export const fetchCategories = async () => {
    try {
      const response = await getAllCategories();

      const filteredCategory = response.data.data.$values.filter(category => category.status === true);
        return filteredCategory;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };
  
  // Fetch category details by ID
  export const fetchCategoryDetails = async (categoryId) => {
    try {
      const response = await getCategoryDetails(categoryId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category details for ID ${categoryId}:`, error);
      throw error;
    }
  };
  
  // Add a new category
  export const createCategory = async (categoryData) => {
    try {
      const response = await addCategory(categoryData);
      return response.data;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  };
  
  // Add multiple categories
  export const createCategories = async (categoriesData) => {
    try {
      const response = await addCategories(categoriesData);
      return response.data;
    } catch (error) {
      console.error("Error adding multiple categories:", error);
      throw error;
    }
  };
  
  // Update category by ID
  export const updateCategoryById = async (categoryId, categoryData) => {
    try {
      const response = await updateCategory(categoryId, categoryData);
      return response.data; 
    } catch (error) {
      console.error(`Error updating category with ID ${categoryId}:`, error);
      throw error;
    }
  };
  
  // Delete category by ID
  export const deleteCategoryById = async (categoryId) => {
    try {
      const response = await deleteCategory(categoryId);
      return response.data; 
    } catch (error) {
      console.error(`Error deleting category with ID ${categoryId}:`, error);
      throw error;
    }
  };
  