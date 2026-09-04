import {
  LayoutDashboard,
  Home,
  Users,
  Building2,
  CalendarCheck,
  FileText,
  Settings,
} from "lucide-react";

import Dashboard from "@/features/dashboard/pages/Dashboard";
import { EmployeePage } from "@/features/employee";
import { DepartmentPage } from "@/features/department";
import { AttendancePage } from "@/features/attendance";
import { LeavePage } from "@/features/leave";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import EmployeeHomePage from "@/features/employee-home/pages/EmployeeHomePage";

// Navigation links shown in the sidebar for Administrators
export const adminNavRoutes = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    path: "/employees",
    icon: Users,
  },
  {
    title: "Departments",
    path: "/departments",
    icon: Building2,
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: CalendarCheck,
  },
  {
    title: "Leave",
    path: "/leave",
    icon: FileText,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

// Navigation links shown in the sidebar for standard Employees
export const employeeNavRoutes = [
  {
    title: "Home",
    path: "/home",
    icon: Home,
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: CalendarCheck,
  },
  {
    title: "Leave",
    path: "/leave",
    icon: FileText,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

// All route definitions for the router
export const appRoutes = [
  {
    path: "/",
    element: Dashboard,
    adminOnly: true,
  },
  {
    path: "/home",
    element: EmployeeHomePage,
    employeeOnly: false,
  },
  {
    path: "/employees",
    element: EmployeePage,
    adminOnly: true,
  },
  {
    path: "/departments",
    element: DepartmentPage,
    adminOnly: true,
  },
  {
    path: "/attendance",
    element: AttendancePage,
  },
  {
    path: "/leave",
    element: LeavePage,
  },
  {
    path: "/settings",
    element: SettingsPage,
  },
];