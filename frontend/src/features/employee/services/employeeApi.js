import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const getEmployees = async () => {
  const response = await API.get("/employees");
  return response.data;
};

export const createEmployee = async (employee) => {
  const response = await API.post("/employees", employee);
  return response.data;
};


export const updateEmployee = async (employeeId, employeeData) => {
  const response = await API.put(
    `/employees/${employeeId}`,
    employeeData
  );

  return response.data;
};

export const deleteEmployee = async (employeeId) => {
  const response = await API.delete(`/employees/${employeeId}`);
  return response.data;
};
