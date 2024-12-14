import { getImportHistory } from "../../api/Admin/apiImport";

export const fetchImportHistory = async () => {
  try {
    const response = await getImportHistory();
    return response.data.data.$values; 
  } catch (error) {
    console.error('Error fetching list:', error);
    throw error;
  }
};