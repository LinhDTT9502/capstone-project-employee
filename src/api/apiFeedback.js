import axios from 'axios';

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Feedback';

// Feedback APIs

// Get all feedbacks
export const getAllFeedbacks = () => {
  return axios.get(`${API_BASE_URL}/get-all-feedbacks`);
};

// Get feedback by ID
export const getFeedbackById = (id) => {
  return axios.get(`${API_BASE_URL}/get-feedback-by-id/${id}`, {
    params: { id },
  });
};

// Create feedback
export const createFeedback = (feedbackData) => {
  return axios.post(`${API_BASE_URL}/create-feedback`, feedbackData);
};

// Delete feedback by ID
export const deleteFeedback = (id) => {
  return axios.delete(`${API_BASE_URL}/remove-feedback/${id}`);
};

