import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "./components/appSidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="bg-background">
        <header className="flex items-center gap-3 px-6 py-3.5 border-b border-border bg-background">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" />
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-medium text-muted-foreground">EcoStock</span>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;