import { Home, User, FileText, Upload, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard Home" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/documents", icon: Upload, label: "Upload Documents" },
];

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear both localStorage and sessionStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userInfo");

    toast.success("Logged out successfully!", { id: "logout-success" });

    // Redirect to login page
    navigate("/");
  };

  return (
    <aside className="w-56 sidebar-gradient border-r border-sidebar-border h-screen flex flex-col shadow-lg">
      <div className="p-4 flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold">AF</div>
        <div className="text-white font-semibold">App Forms</div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2.5 sidebar-item rounded-lg transition-colors hover:opacity-95"
              activeClassName="bg-white/10 text-white font-medium"
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 sidebar-item rounded-lg transition-colors bg-white/6 w-full hover:opacity-95"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};
