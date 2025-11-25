import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [username, setUsername] = useState("User");
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const u = JSON.parse(userInfo);
        setUser(u);
        if (u.username) setUsername(u.username);
      } catch (err) {
        console.error("Failed to parse user info:", err);
      }
    }
  }, []);
  
  // prefer passportPhoto from personalInfo (Profile Creation) if available
  const getProfileImage = () => {
    try {
      const personalRaw = localStorage.getItem("personalInfo");
      if (personalRaw) {
        const personal = JSON.parse(personalRaw);
        if (personal && personal.passportPhoto) return personal.passportPhoto;
      }
    } catch (err) {
      // ignore
    }

    if (user) return user.avatar || user.photo || user.avatarUrl || null;
    return null;
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="px-8 py-4 flex items-center justify-end shadow-sm" style={{ background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))` }}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white">{username}</span>
            <Avatar className="h-9 w-9">
              {(() => {
                const img = getProfileImage();
                if (img) return <AvatarImage src={img} alt={username} />;
                return (
                  <AvatarFallback className="bg-white text-primary text-xs">
                    {getInitials(username)}
                  </AvatarFallback>
                );
              })()}
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
