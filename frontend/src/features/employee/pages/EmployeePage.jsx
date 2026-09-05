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
import { useAuth } from "@/features/auth";

export default function EmployeePage() {
  const { employees, loading, error, refetch } = useEmployees();
  const { isAdmin } = useAuth();

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">
            Employees
          </h1>

          <p className="text-sm text-[#86868B] mt-1">
            Manage your organization's directory and onboard team members.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setSelectedEmployee(null);
              setOpen(true);
            }}
            className="bg-[#1D1D1F] hover:bg-[#424245] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm"
          >
            + Onboard Employee
          </button>
        )}
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
  canManage={isAdmin}
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
