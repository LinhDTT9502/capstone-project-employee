import { createNewManager, deleteManager, getAllManagers, getAllManagerWithoutBranch, updateManager } from "../../api/Manager/apiManager";

export const fetchAllManagers = async () => {
  try {
    const response = await getAllManagers();
    return response.data.data.$values;
  } catch (error) {
    console.error('Error fetching managers:', error);
    throw error;
  }
};

export const fetchAllManagerWithoutBranch = async () => {
  try {
    const response = await getAllManagerWithoutBranch();
    return response.data.data.$values;
  } catch (error) {
    console.error('Error fetching managers:', error);
    throw error;
  }
};

export const createManager = async (newManager) => {
  try {
    const response = await createNewManager(newManager);
    return response.data;
  } catch (error) {
    console.error('Error fetching managers:', error);
    throw error;
  }
};

export const editManager = async (manager) => {
  try {
    const response = await updateManager(manager);
    return response.data;
  } catch (error) {
    console.error(`Error deleting feedback with ID ${mamager.id}:`, error);
    throw error;
  }
};

export const removeManager = async (id) => {
  try {
    const response = await deleteManager(id);
    return response.data;
  } catch (error) {
    console.error(`Error deleting feedback with ID ${id}:`, error);
    throw error;
  }
};