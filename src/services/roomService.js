import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BE_URL;

export const createRoomApi = async (body) => {
  console.log(body);
  try {
    const token = Cookies.get("access_token");
    if (token) {
      const response = await axios.post(`${BASE_URL}/rooms`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
  } catch (err) {
    console.log(err);
  }
};
export const getListRoomsApi = async () => {
  try {
    const token = Cookies.get("access_token");
    if (token) {
      const response = await axios.get(`${BASE_URL}/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
  } catch (err) {
    console.log(err);
  }
};
export const getRoomByIdApi = async (userChooseId) => {
  try {
    const token = Cookies.get("access_token");
    if (token) {
      const response = await axios.get(
        `${BASE_URL}/rooms/get?receiverId=${userChooseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    }
  } catch (err) {
    console.log(err);
  }
};
