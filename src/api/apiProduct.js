import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Product';

export const searchProducts = (keywords) => {
  const url = `${API_BASE_URL}/search-products`;
  return axios.get(url, {
    params: { keywords },
    headers: {
      'accept': '*/*'
    }
  });
};

export const getProductColor = (productCode) => {
  const url = `${API_BASE_URL}/list-colors-of-product/${productCode}`;
  return axios.get(url, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const getProductSize = (productCode, color) => {
  const url = `${API_BASE_URL}/list-sizes-of-product/${productCode}?color=${color}`;
  return axios.get(url, {
    headers: {
      'accept': '*/*'
    }
  });
};


export const getProductByProductCode = (productCode, color, size, condition) => {
  const url = `${API_BASE_URL}/get-product-by-product-code/${productCode}?color=${color}&size=${size}&condition=${condition}`;
  return axios.get(url, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const getProductByProductCodeAPI = (productCode) => {
  const url = `${API_BASE_URL}/get-product-by-product-code/${productCode}`;
  return axios.get(url, {
    headers: {
      'accept': '*/*'
    }
  });
};


export const getAllProductsAPI = () => {
  const url = `${API_BASE_URL}/list-all-products`;
  return axios.get(url, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const changeProductStatusAPI = (productId) => {
  const url = `${API_BASE_URL}/active-deactive-product/${productId}`;
  return axios.delete(url, {
    headers: {
      'accept': '*/*'
    }
  });
};