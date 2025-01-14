import { getCustomerChat, getListChat } from "../../api/Coordinator/apiChat";

export const fetchListChat = async () => {
  try {
    const response = await getListChat();
    return response.data.$values;
  } catch (error) {
    console.error('Error fetching orders list:', error);
    throw error;
  }
};

export const fetchCustomerChat = async (chatSessionId ) => {
    try {
      const response = await getCustomerChat(chatSessionId);
      return response.data.$values;
    } catch (error) {
      console.error('Error fetching orders list:', error);
      throw error;
    }
  };