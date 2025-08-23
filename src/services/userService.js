import { axiosHelperPrivate } from "../utils/axiosHelper";

export const getAllUserApi = async (params) => {
  const response = await axiosHelperPrivate.get("/users", { params });
  return response.data;
};
