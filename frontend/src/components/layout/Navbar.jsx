import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8">
      <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3 w-96">
        <Search size={18} className="text-gray-500" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-300">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar>
            <AvatarFallback>T</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold">Tejasva</h3>
            <p className="text-sm text-gray-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}