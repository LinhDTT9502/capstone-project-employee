import { getProfileAPI } from "../api/apiProfile";

export const getProfile = async (id) => {
  try {
    const response = await getProfileAPI(id);
    return response.data.data; 
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};