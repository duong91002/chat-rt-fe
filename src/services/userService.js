import axios from "axios";
const BASE_URL = import.meta.env.VITE_BE_URL;
import Cookies from "js-cookie";
export const getAllUserApi = async (params) => {
  try {
    const token = Cookies.get("access_token");
    if (token) {
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...params,
        },
      });
      return response.data;
    }
  } catch (err) {
    console.log(err);
  }
};
