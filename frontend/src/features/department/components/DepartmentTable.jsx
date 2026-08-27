import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DepartmentTable({
  departments,
  deletingDepartmentId,
  onEdit,
  onDelete,
  canManage = false,
}) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead className="w-24">ID</TableHead>
            {canManage && (
              <TableHead className="w-28 text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {departments.map((department) => (
            <TableRow
              key={department.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                <p className="font-medium">{department.name}</p>
              </TableCell>

              <TableCell>{department.id}</TableCell>

              {canManage && (
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${department.name}`}
                      title="Edit department"
                      onClick={() => onEdit(department)}
                    >
                      <Pencil className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      aria-label={`Delete ${department.name}`}
                      title="Delete department"
                      disabled={deletingDepartmentId === department.id}
                      onClick={() => onDelete(department)}
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
