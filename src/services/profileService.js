import { getUserProfile } from "../api/apiProfile";

export const getProfile = async (userId) => {
  try {
    const response = await getUserProfile(userId);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};