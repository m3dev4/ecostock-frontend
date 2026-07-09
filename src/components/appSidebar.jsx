import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { NavLinks } from "@/constants/navLinks";

const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="m-3 h-[calc(100vh-24px)] rounded-2xl border border-border bg-card text-foreground"
    >
      {/* HEADER */}
      <SidebarHeader
        className={`pt-7 pb-6 ${collapsed ? "px-0 flex items-center" : "px-6"}`}
      >
        <Link
          to="/"
          className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
            <span className="font-bold text-primary-foreground">EC</span>
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-base font-semibold tracking-tight text-foreground">
                EcoStock
              </h1>
              <p className="text-xs text-muted-foreground">Inventory Manager</p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent className={`mt-4 ${collapsed ? "px-2" : "px-3"}`}>
        <div className="space-y-1">
          {NavLinks.map((nav) => {
            const active = location.pathname === nav.path;

            return (
              <Link
                key={nav.id}
                to={nav.path}
                title={collapsed ? nav.name : ""}
                className={`
                  flex items-center rounded-lg py-2.5 transition-colors duration-150
                  ${collapsed ? "justify-center px-0" : "gap-3 px-3"}
                  ${
                    active
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <img
                  src={nav.icon}
                  alt={nav.name}
                  className={`h-4 w-4 shrink-0 ${active ? "opacity-100" : "opacity-50"}`}
                />

                {!collapsed && <span className="text-sm">{nav.name}</span>}
              </Link>
            );
          })}
        </div>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="p-3">
        <div className={`flex items-center rounded-lg border border-border p-2.5 ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            M
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Mouhamed</p>
              <p className="text-xs text-muted-foreground truncate">Administrator</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;