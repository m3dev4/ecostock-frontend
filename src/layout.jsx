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

      <SidebarInset className="bg-zinc-100">
        <header className="flex items-center px-6">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
