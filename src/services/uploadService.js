import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_BE_URL;

export const uploadFilesApi = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const token = Cookies.get("access_token");
  const res = await axios.post(`${BASE_URL}/uploads/multiple`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const uploadFileApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = Cookies.get("access_token");
  const res = await axios.post(`${BASE_URL}/uploads/single`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
