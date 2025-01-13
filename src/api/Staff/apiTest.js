import axios from "axios";

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/ApiTest';

export const getPaymentInf = (orderCode, orderType) => {
    return axios.get(`${API_BASE_URL}/Get-Payment-Information`, {
      headers: {
        'accept': '*/*'
      },
      params: {
        orderCode: orderCode,
        orderType: orderType
      }
    });
  };