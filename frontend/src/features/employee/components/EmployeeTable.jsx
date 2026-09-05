import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Mail, Building2 } from "lucide-react";

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  deletingEmployeeId,
  canManage = false,
}) {
  return (
    <div className="bg-white rounded-3xl border border-[#D2D2D7] overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#D2D2D7] bg-[#FBFBFD] hover:bg-[#FBFBFD]">
            <TableHead className="font-semibold text-xs text-[#6E6E73] uppercase tracking-wider py-4 pl-6">
              Employee
            </TableHead>
            <TableHead className="font-semibold text-xs text-[#6E6E73] uppercase tracking-wider">
              Department
            </TableHead>
            <TableHead className="font-semibold text-xs text-[#6E6E73] uppercase tracking-wider">
              Designation
            </TableHead>
            <TableHead className="font-semibold text-xs text-[#6E6E73] uppercase tracking-wider">
              Phone
            </TableHead>
            <TableHead className="font-semibold text-xs text-[#6E6E73] uppercase tracking-wider">
              Joined
            </TableHead>
            {canManage && (
              <TableHead className="font-semibold text-xs text-[#6E6E73] uppercase tracking-wider w-24 text-right pr-6">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={canManage ? 6 : 5}
                className="text-center py-12 text-sm text-[#86868B]"
              >
                No employees found. Click "Add Employee" to onboard your team.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow
                key={employee.id}
                className="border-b border-[#F5F5F7] last:border-none hover:bg-[#FBFBFD] transition-colors"
              >
                <TableCell className="pl-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center font-medium text-xs text-[#1D1D1F]">
                      {employee.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#1D1D1F]">
                        {employee.full_name}
                      </p>
                      {employee.email && (
                        <p className="text-xs text-[#86868B] flex items-center gap-1">
                          <Mail size={11} />
                          <span>{employee.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm text-[#6E6E73]">
                  {employee.department_name ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F5F7] text-xs font-medium text-[#1D1D1F] border border-[#E5E5EA]">
                      <Building2 size={11} className="text-[#86868B]" />
                      {employee.department_name}
                    </span>
                  ) : (
                    <span className="text-[#86868B] text-xs">—</span>
                  )}
                </TableCell>

                <TableCell className="text-sm font-medium text-[#1D1D1F]">
                  {employee.designation || "—"}
                </TableCell>

                <TableCell className="text-sm text-[#6E6E73]">
                  {employee.phone || "—"}
                </TableCell>

                <TableCell className="text-sm text-[#6E6E73]">
                  {employee.joining_date || "—"}
                </TableCell>

                {canManage && (
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${employee.full_name}`}
                        title="Edit employee"
                        onClick={() => onEdit?.(employee)}
                        className="hover:bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] rounded-xl"
                      >
                        <Pencil className="size-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${employee.full_name}`}
                        title="Delete employee"
                        disabled={deletingEmployeeId === employee.id}
                        onClick={() => onDelete?.(employee)}
                        className="hover:bg-red-50 text-[#86868B] hover:text-red-600 rounded-xl"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
