import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import DepartmentForm from "../components/DepartmentForm";
import DepartmentTable from "../components/DepartmentTable";
import { useDepartments } from "../hooks/useDepartments";
import {
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../services/departmentApi";

export default function DepartmentPage() {
  const { departments, loading, error, refetch } = useDepartments();

  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState(null);

  const handleAdd = () => {
    setSelectedDepartment(null);
    setOpen(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setOpen(true);
  };

  const handleSubmit = async (departmentData) => {
    try {
      setSaving(true);

      if (selectedDepartment) {
        await updateDepartment(selectedDepartment.id, departmentData);
      } else {
        await createDepartment(departmentData);
      }

      setOpen(false);
      setSelectedDepartment(null);
      refetch();
    } catch (error) {
      console.error("Failed to save department:", error);
      window.alert("Failed to save department.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (department) => {
    const confirmed = window.confirm(
      `Delete ${department.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingDepartmentId(department.id);
      await deleteDepartment(department.id);
      refetch();
    } catch (error) {
      console.error("Failed to delete department:", error);
      window.alert("Failed to delete department.");
    } finally {
      setDeletingDepartmentId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-semibold">
            Departments
          </h1>

          <p className="text-gray-500 mt-2">
            Manage departments used by employees.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="bg-black text-white px-5 py-3 rounded-2xl hover:bg-gray-800 transition"
        >
          + Add Department
        </button>
      </div>

      {loading && (
        <p className="text-gray-500">Loading departments...</p>
      )}

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && departments.length === 0 && (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center">
          <p className="font-medium">No departments yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Add your first department to use it while creating employees.
          </p>
        </div>
      )}

      {!loading && !error && departments.length > 0 && (
        <DepartmentTable
          departments={departments}
          deletingDepartmentId={deletingDepartmentId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedDepartment ? "Edit Department" : "Add Department"}
            </DialogTitle>
          </DialogHeader>

          <DepartmentForm
            key={selectedDepartment?.id || "new"}
            department={selectedDepartment}
            saving={saving}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
