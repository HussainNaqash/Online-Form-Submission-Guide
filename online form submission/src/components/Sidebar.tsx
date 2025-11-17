import { Home, User, FileText, Upload, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard Home" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/applications", icon: FileText, label: "View Applications" },
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
    <aside className="w-56 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground rounded-lg transition-colors hover:bg-sidebar-accent"
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground rounded-lg transition-colors hover:bg-sidebar-accent w-full"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};
