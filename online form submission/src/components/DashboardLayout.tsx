import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user.username) setUsername(user.username);
      } catch (err) {
        console.error("Failed to parse user info:", err);
      }
    }
  }, []);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-primary text-primary-foreground px-8 py-4 flex items-center justify-end shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{username}</span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary-foreground text-primary text-xs">
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
