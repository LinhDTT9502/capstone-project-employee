import { getAllFeedbacks, getFeedbackById, createFeedback, deleteFeedback } from '../api/apiFeedback';

// Service to fetch all feedbacks
export const fetchAllFeedbacks = async () => {
  try {
    const response = await getAllFeedbacks();
    return response.data.data.$values; 
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
};

// Service to fetch a feedback by ID
export const fetchFeedbackById = async (id) => {
  try {
    const response = await getFeedbackById(id);
    return response.data; 
  } catch (error) {
    console.error(`Error fetching feedback with ID ${id}:`, error);
    throw error;
  }
};

// Service to create a new feedback
export const createNewFeedback = async (feedbackData) => {
  try {
    const response = await createFeedback(feedbackData);
    return response.data; 
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
};

// Service to delete a feedback by ID
export const removeFeedback = async (id) => {
  try {
    const response = await deleteFeedback(id);
    return response.data; 
  } catch (error) {
    console.error(`Error deleting feedback with ID ${id}:`, error);
    throw error;
  }
};
