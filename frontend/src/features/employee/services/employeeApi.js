import api from "@/lib/api";

export const getEmployees = async () => {
  const response = await api.get("/employees");
  return response.data;
};

export const createEmployee = async (employee) => {
  const response = await api.post("/employees", employee);
  return response.data;
};


export const updateEmployee = async (employeeId, employeeData) => {
  const response = await api.put(
    `/employees/${employeeId}`,
    employeeData
  );

  return response.data;
};

export const deleteEmployee = async (employeeId) => {
  const response = await api.delete(`/employees/${employeeId}`);
  return response.data;
};
