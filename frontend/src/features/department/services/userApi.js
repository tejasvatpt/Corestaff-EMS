import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getUsers = async () => {
  const response = await API.get("/users/");
  return response.data;
};
