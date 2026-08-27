import { Bell, Search, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth";

export default function Navbar() {
  const { user, logout } = useAuth();

  const displayName = user?.username || "User";
  const roleLabel = user?.role === "admin" ? "Administrator" : "Employee";
  const initial = displayName.charAt(0).toUpperCase();

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

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 cursor-pointer outline-none">
            <Avatar>
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>

            <div className="text-left">
              <h3 className="font-semibold">{displayName}</h3>
              <p className="text-sm text-gray-500">
                {roleLabel}
              </p>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* DropdownMenuLabel renders a Base UI GroupLabel, which throws
                unless it is inside a Group. */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                {user?.email || displayName}
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={logout}>
              <LogOut size={16} />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
