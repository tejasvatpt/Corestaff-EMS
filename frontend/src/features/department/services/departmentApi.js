import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getDepartments = async () => {
  const response = await API.get("/departments");
  return response.data;
};

export const createDepartment = async (department) => {
  const response = await API.post("/departments", department);
  return response.data;
};

export const updateDepartment = async (departmentId, department) => {
  const response = await API.put(
    `/departments/${departmentId}`,
    department
  );
  return response.data;
};

export const deleteDepartment = async (departmentId) => {
  const response = await API.delete(`/departments/${departmentId}`);
  return response.data;
};
