import { appRoutes } from "@/routes/appRoutes";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-200 px-6 py-8">
      <h1 className="text-3xl font-semibold tracking-tight mb-12">
        EMS
      </h1>

      <nav className="space-y-2">
        {appRoutes.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
  key={item.title}
  to={item.path}
  className={({ isActive }) =>
    `w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${
      isActive
        ? "bg-black text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-black hover:translate-x-1"
    }`
  }
>
  <Icon size={20} />
  <span className="font-medium">{item.title}</span>
</NavLink>
          );
        })}
      </nav>
    </aside>
  );
}