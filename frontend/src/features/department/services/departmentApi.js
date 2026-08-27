import api from "@/lib/api";

export const getDepartments = async () => {
  const response = await api.get("/departments");
  return response.data;
};

export const createDepartment = async (department) => {
  const response = await api.post("/departments", department);
  return response.data;
};

export const updateDepartment = async (departmentId, department) => {
  const response = await api.put(
    `/departments/${departmentId}`,
    department
  );
  return response.data;
};

export const deleteDepartment = async (departmentId) => {
  const response = await api.delete(`/departments/${departmentId}`);
  return response.data;
};
