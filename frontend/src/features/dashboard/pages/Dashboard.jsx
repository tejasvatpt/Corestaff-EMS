import DashboardCard from "../components/DashboardCard";import {
  Users,
  Building2,
  CalendarCheck,
  FileText,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-4xl font-semibold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <DashboardCard
          title="Employees"
          value="245"
          icon={Users}
        />

        <DashboardCard
          title="Departments"
          value="12"
          icon={Building2}
        />

        <DashboardCard
          title="Attendance"
          value="93%"
          icon={CalendarCheck}
        />

        <DashboardCard
          title="Leave Requests"
          value="18"
          icon={FileText}
        />
      </div>
    </div>
  );
}