import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

       <main className="flex-1 p-8">
            <Outlet />
       </main>
      </div>
    </div>
  );
}