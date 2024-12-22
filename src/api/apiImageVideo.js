import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/ImageVideo';


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
