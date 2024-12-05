import { createNewUser, getAllUser } from "../api/apiManageUser";

export const fetchAllUsers = async () => {
  try {
    const  response = await getAllUser();
    return  response.data.data.$values;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (data) => {
  try {
    const  response = await createNewUser(data);
    return  response.data.data.$values;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};