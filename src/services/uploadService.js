import { axiosHelperPrivate } from "../utils/axiosHelper";

export const uploadFilesApi = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const response = await axiosHelperPrivate.post(
    "/uploads/multiple",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};
export const uploadFileApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosHelperPrivate.post("/uploads/single", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
