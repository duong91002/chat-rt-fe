import { axiosHelperPrivate } from "../utils/axiosHelper";

export const createRoomApi = async (body) => {
  const response = await axiosHelperPrivate.post("/rooms", body);
  return response.data;
};
export const getListRoomsApi = async (params) => {
  const response = await axiosHelperPrivate.get("/rooms", {
    params,
  });
  return response.data;
};
export const getRoomByIdApi = async (params) => {
  const response = await axiosHelperPrivate.get(`/rooms/get`, {
    params,
  });
  return response.data;
};
