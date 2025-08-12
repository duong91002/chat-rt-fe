import axios from "axios";
const BASE_URL = import.meta.env.VITE_BE_URL;
import Cookies from "js-cookie";
export const loginApi = async (body) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, body);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const registerApi = async (body) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, body);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export const getInformationApi = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
