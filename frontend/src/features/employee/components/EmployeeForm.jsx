import { useState } from "react";
import { createEmployee, updateEmployee } from "../services/employeeApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDepartments } from "@/features/department/hooks/useDepartments";
import { useUsers } from "@/features/employee/hooks/useUsers";

const emptyForm = {
  user_id: "",
  department_id: "",
  full_name: "",
  designation: "",
  phone: "",
  joining_date: "",
};

const getInitialForm = (employee) => {
  if (!employee) {
    return emptyForm;
  }

  return {
    user_id: employee.user_id ? String(employee.user_id) : "",
    department_id: employee.department_id
      ? String(employee.department_id)
      : "",
    full_name: employee.full_name || "",
    designation: employee.designation || "",
    phone: employee.phone || "",
    joining_date: employee.joining_date || "",
  };
};

export default function EmployeeForm({ employee, onSuccess }) {
  const [form, setForm] = useState(() => getInitialForm(employee));

const { departments, loading: departmentsLoading } = useDepartments();
const { users, loading: usersLoading } = useUsers();
const isEditing = Boolean(employee?.id);


const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
};


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const employeeData = {
      ...form,
      user_id: Number(form.user_id),
      department_id: form.department_id
        ? Number(form.department_id)
        : null,
    };

    if (isEditing) {
      await updateEmployee(employee.id, employeeData);
    } else {
      await createEmployee(employeeData);
    }

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Failed to save employee:", error);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />
      </div>

      <div>
        <Label htmlFor="designation">Designation</Label>
        <Input
          id="designation"
          name="designation"
          value={form.designation}
          onChange={handleChange}
          placeholder="Software Engineer"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone number"
        />
      </div>

      <div>
  <Label htmlFor="department_id">Department</Label>

  <select
    id="department_id"
    name="department_id"
    value={form.department_id}
    onChange={handleChange}
    required
    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
    disabled={departmentsLoading}
  >
    <option value="">
      {departmentsLoading
        ? "Loading departments..."
        : "Select department"}
    </option>

    {departments.map((department) => (
      <option key={department.id} value={department.id}>
        {department.name}
      </option>
    ))}
  </select>
</div>

      <div>
  <Label htmlFor="user_id">User</Label>

  <select
    id="user_id"
    name="user_id"
    value={form.user_id}
    onChange={handleChange}
    required
    disabled={usersLoading}
    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
  >
    <option value="">
      {usersLoading ? "Loading users..." : "Select user"}
    </option>

    {users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.username} — {user.email}
      </option>
    ))}
  </select>
</div>

      <div>
        <Label htmlFor="joining_date">Joining Date</Label>
        <Input
          id="joining_date"
          name="joining_date"
          type="date"
          value={form.joining_date}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? "Update Employee" : "Create Employee"}
      </Button>
    </form>
  );
}
