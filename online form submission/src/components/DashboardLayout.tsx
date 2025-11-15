import { Sidebar } from "./Sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-primary text-primary-foreground px-8 py-4 flex items-center justify-end shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">22FYP-09 </span>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary-foreground text-primary text-xs">NH</AvatarFallback>
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
