import { deleteImageByIdApi, fetchAllImagesVideosApi, fetchAllImagesVideosByProductIdApi } from "../api/apiImageVideo";

export const getAllImagesVideos = async () => {
  try {
    const response = await fetchAllImagesVideosApi();
    return response.data?.data?.$values;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

export const getAllImagesVideosByProductId = async (productId) => {
  try {

    const response = await fetchAllImagesVideosByProductIdApi(productId);

    return response.data.data.$values
  } catch (error) {
    console.error('Error fetching images data:', error);
    throw error;
  }
};


export const deleteImageById = (id) => {
  try {

    const response = deleteImageByIdApi(id);
    console.log(response);

    return response.data
  } catch (error) {
    console.error('Delete failed:', error);
    throw error;
  }
};
// export const editQuantity = async (warehouseId, availableQuantity, totalQuantity) => {
//   try {
//     const response = await updateQuantity(warehouseId, availableQuantity, totalQuantity);
//     return response.data;
//   } catch (error) {
//     console.error("Error updating warehouse:", error);
//     throw error;
//   }
// };
