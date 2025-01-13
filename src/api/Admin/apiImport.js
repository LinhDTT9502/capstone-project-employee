import axios from "axios";

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/ImportHistory';

export const getImportHistory = () => {
  return axios.get(`${API_BASE_URL}/list-all-import-histories`, {
    headers: {
      'accept': '*/*'
    }
  });
};

// Fetch all import histories by branchId
export const getImportHistoryByBranch = (branchId) => {
  return axios.get(`${API_BASE_URL}/list-all-import-histories-by-branchId/${branchId}`, {
    headers: {
      accept: "*/*",
    },
  });
};

// Delete an import history by ID
export const deleteImportHistory = (importHistoryId) => {
  return axios.delete(`${API_BASE_URL}/delete-import-history/${importHistoryId}`, {
    headers: {
      accept: "*/*",
    },
  });
};