import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EmployeeTable from "../components/EmployeeTable";
import EmployeeForm from "../components/EmployeeForm";
import { useEmployees } from "../hooks/useEmployees";
import { deleteEmployee } from "../services/employeeApi";

export default function EmployeePage() {
  const { employees, loading, error, refetch } = useEmployees();

 const [open, setOpen] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState(null);
const [deletingEmployeeId, setDeletingEmployeeId] = useState(null);

const handleDelete = async (employee) => {
  const confirmed = window.confirm(
    `Delete ${employee.full_name}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    setDeletingEmployeeId(employee.id);
    await deleteEmployee(employee.id);
    refetch();
  } catch (error) {
    console.error("Failed to delete employee:", error);
    window.alert("Failed to delete employee.");
  } finally {
    setDeletingEmployeeId(null);
  }
};

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-semibold">
            Employees
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all employees from one place.
          </p>
        </div>

        <button
          onClick={() => {
  setSelectedEmployee(null);
  setOpen(true);
}}
          className="bg-black text-white px-5 py-3 rounded-2xl hover:bg-gray-800 transition"
        >
          + Add Employee
        </button>
      </div>

      {loading && (
        <p className="text-gray-500">Loading employees...</p>
      )}

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <EmployeeTable
  employees={employees}
  onEdit={(employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  }}
  onDelete={handleDelete}
  deletingEmployeeId={deletingEmployeeId}
/>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
  {selectedEmployee ? "Edit Employee" : "Add Employee"}
</DialogTitle>
          </DialogHeader>

        <EmployeeForm
  key={selectedEmployee?.id || "new"}
  employee={selectedEmployee}
  onSuccess={() => {
    setOpen(false);
    setSelectedEmployee(null);
    refetch();
  }}
/>
        </DialogContent>
      </Dialog>
    </div>
  );
}
