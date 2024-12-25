import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/sport';

// Get all sports
export const getAllSports = () => {
  return axios.get(`${API_BASE_URL}/list-sports`, {
    params: { status: true },
    headers: {
      'accept': '*/*'
    }
  });
};

// Get sport details by ID
export const getSportDetails = (sportId) => {
  return axios.get(`${API_BASE_URL}/get-sport-by-id/${sportId}`, {
    headers: {
      'accept': '*/*'
    }
  });
};

// Add new sport
export const addSport = (sportData) => {
  return axios.post(`${API_BASE_URL}/add-sports`, sportData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Edit sport by ID
export const editSport = (sportId, sportData) => {
  return axios.put(`${API_BASE_URL}/update-sport/${sportId}`, sportData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Remove sport by ID
export const removeSport = (sportId) => {
  return axios.delete(`${API_BASE_URL}/delete-sport/${sportId}`, {}, {
    headers: {
      'accept': '*/*'
    }
  });
};

// Change sport status
export const changeSportStatusApi = (sportId) => {
  return axios.put(`${API_BASE_URL}/edit-status/${sportId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
