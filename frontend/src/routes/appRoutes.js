import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  FileText,
  Settings,
} from "lucide-react";

import Dashboard from "@/features/dashboard/pages/Dashboard";
import { EmployeePage } from "@/features/employee";
import { DepartmentPage } from "@/features/department";

export const appRoutes = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    element: Dashboard,
  },
  {
    title: "Employees",
    path: "/employees",
    icon: Users,
    element: EmployeePage,
  },
  {
    title: "Departments",
    path: "/departments",
    icon: Building2,
    element: DepartmentPage,
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: CalendarCheck,
    element: null,
  },
  {
    title: "Leave",
    path: "/leave",
    icon: FileText,
    element: null,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    element: null,
  },
];