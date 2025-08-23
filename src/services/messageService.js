import { axiosHelperPrivate } from "../utils/axiosHelper";

export const getListChatInRoomsApi = async (params) => {
  const response = await axiosHelperPrivate.get("/chats", { params });
  return response;
};
