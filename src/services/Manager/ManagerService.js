import { getAllManagers } from "../../api/Manager/apiManager";

export const fetchAllManagers = async () => {
    try {
      const response = await getAllManagers();
      return response.data.data.$values; 
    } catch (error) {
      console.error('Error fetching staffs:', error);
      throw error;
    }
  };