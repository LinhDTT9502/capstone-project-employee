import axios from 'axios';

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/ImageVideo';


export const fetchAllImagesVideosApi = () => {
  return axios.get(`${API_BASE_URL}/list-all-image-in-products`, {
    headers: {
      "accept": "*/*",
    },
  });
};

export const fetchAllImagesVideosByProductIdApi = (productId) => {

  return axios.get(`${API_BASE_URL}/list-all-image-of-a-product/${productId}`, {
    headers: {
      "accept": "*/*",
    },
  });
};

export const deleteImageByIdApi = (id) => {

  return axios.delete(`${API_BASE_URL}/delete-image-video-by-id/${id}`, {
    headers: {
      "accept": "*/*",
    },
  });
};
