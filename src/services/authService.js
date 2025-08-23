import { axiosHelperPublic, axiosHelperPrivate } from "../utils/axiosHelper";

export const loginApi = async (body) => {
  const response = await axiosHelperPublic.post("/auth/login", body);
  return response.data;
};

export const registerApi = async (body) => {
  const response = await axiosHelperPublic.post("/auth/register", body);
  return response.data;
};
export const getInformationApi = async () => {
  const response = await axiosHelperPrivate.get("/auth/me");
  return response.data;
};
