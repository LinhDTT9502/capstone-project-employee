import { 
  getImportHistory, 
  getImportHistoryByBranch, 
  deleteImportHistory 
} from "../../api/Admin/apiImport";

// Fetch all import histories
export const fetchImportHistory = async () => {
  try {
    const response = await getImportHistory();
    return response.data.data.$values.sort(
      (a, b) => new Date(b.importDate) - new Date(a.importDate)
    );
  } catch (error) {
    console.error("Error fetching list:", error);
    throw error;
  }
};

// Fetch import histories by branch ID
export const fetchImportHistoryByBranch = async (branchId) => {
  try {
    const response = await getImportHistoryByBranch(branchId);
    return response.data.data.$values.sort(
      (a, b) => new Date(b.importDate) - new Date(a.importDate)
    );
  } catch (error) {
    console.error("Error fetching list by branch:", error);
    throw error;
  }
};

// Delete import history by ID
export const removeImportHistory = async (importHistoryId) => {
  try {
    await deleteImportHistory(importHistoryId);
    return true;
  } catch (error) {
    console.error(`Error deleting import history ID ${importHistoryId}:`, error);
    throw error;
  }
};
