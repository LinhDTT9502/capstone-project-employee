import { toast } from "react-toastify";
import { fetchOrdersAPI } from "../api/apiDashboard";

export const fetchOrders = async () => {
  try {
    const  response = await fetchOrdersAPI();
    // console.log(response);
    return  response.data.data.$values;
  } catch (error) {
    console.error('Error fetching orders:', error);
    toast.error("Error fetching orders: " + error.message);
    throw error;
  }
};

