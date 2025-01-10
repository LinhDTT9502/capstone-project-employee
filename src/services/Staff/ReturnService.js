import { getListReturn } from "../../api/Staff/apiReturn";

export const getListOrderReturn = async () => {
  try {
    const response = await getListReturn();
    return response.data.$values; 
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// export const updateRefund = async (data, token) => {
//   try {
//     const response = await updateRefundApi(data, token);
//     return response; 
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     throw error;
//   }
// };
