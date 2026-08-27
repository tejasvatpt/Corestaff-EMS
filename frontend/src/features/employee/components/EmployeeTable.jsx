import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  deletingEmployeeId,
  canManage = false,
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Joining Date</TableHead>
            <TableHead>Status</TableHead>
            {canManage && (
              <TableHead className="w-28 text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                <div>
                  <p className="font-medium">{employee.full_name}</p>
                  <p className="text-sm text-gray-500">
                    User ID: {employee.user_id}
                  </p>
                </div>
              </TableCell>

              <TableCell>{employee.designation || "—"}</TableCell>

              <TableCell>{employee.phone || "—"}</TableCell>

              <TableCell>{employee.joining_date || "—"}</TableCell>

              <TableCell>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    employee.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {employee.status}
                </span>
              </TableCell>

              {canManage && (
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${employee.full_name}`}
                      title="Edit employee"
                      onClick={() => onEdit?.(employee)}
                    >
                      <Pencil className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      aria-label={`Delete ${employee.full_name}`}
                      title="Delete employee"
                      disabled={deletingEmployeeId === employee.id}
                      onClick={() => onDelete?.(employee)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
