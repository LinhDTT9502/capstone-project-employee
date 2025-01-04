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

export const filterProductsByCategoryApi = (categoryId) => {
  const url = `${API_BASE_URL}/filter-sort-products?categoryIds=${categoryId}`;
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

export const updateProductAPI = async (productId, productData, token) => {
  try {
    const url = `${API_BASE_URL}/update-product/${productId}`;
    const formData = new FormData();

    // Append all fields from productData to FormData
    for (const key in productData) {
      if (productData[key] instanceof Array) {
        // If the key is an array (e.g., ProductImages), append each item separately
        productData[key].forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, productData[key]);
      }
    }

    const response = await axios.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    });

    // Return the response data
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
};

export const addProductAPI = async (productData, token) => {
  try {
    const url = `${API_BASE_URL}/add-product`;
    const formData = new FormData();

    // Append all fields from productData to FormData
    for (const key in productData) {
      if (productData[key] instanceof Array) {
        // If the key is an array (e.g., ProductImages), append each item separately
        productData[key].forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, productData[key]);
      }
    }

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        Accept: '*/*',
      },
    });

    // Return the response data
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
};

// Delete product by ID
export const deleteProductAPI = (productId) => {
  return axios.delete(`${API_BASE_URL}/delete-product/${productId}`, {
    headers: {
      "accept": "*/*",
    },
  });
};
