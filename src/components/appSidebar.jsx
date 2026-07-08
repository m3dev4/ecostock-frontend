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
      className="m-3 h-[calc(100vh-24px)] rounded-3xl border-0 bg-[#2D2D2D] text-white shadow-2xl"
    >
      {/* HEADER */}
      <SidebarHeader
        className={`pt-7 pb-6 ${collapsed ? "px-0 flex items-center" : "px-6"}`}
      >
        <Link
          to="/"
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400">
            <span className="font-bold text-slate-900">EC</span>
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold tracking-tight">EcoStock</h1>
              <p className="text-xs text-gray-400">Inventory Manager</p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* SEARCH */}
      {!collapsed && (
        <div className="px-5">
          <div className="rounded-xl bg-[#383838] px-4 py-3 text-sm text-gray-500">
            Search...
          </div>
        </div>
      )}

      {/* MENU */}
      <SidebarContent className={`mt-6 ${collapsed ? "px-2" : "px-4"}`}>
        <div className="space-y-2">
          {NavLinks.map((nav) => {
            const active = location.pathname === nav.path;

            return (
              <Link
                key={nav.id}
                to={nav.path}
                title={collapsed ? nav.name : ""}
                className={`
                  flex items-center rounded-xl py-3 transition-all duration-200

                  ${collapsed ? "justify-center px-0" : "gap-3 px-4"}

                  ${
                    active
                      ? "bg-[#3B3B3B] text-white"
                      : "text-gray-400 hover:bg-[#373737] hover:text-white"
                  }
                `}
              >
                <img
                  src={nav.icon}
                  alt={nav.name}
                  className="h-6 w-6 shrink-0"
                />

                {!collapsed && <span className="font-medium">{nav.name}</span>}
              </Link>
            );
          })}
        </div>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="p-4">
        <div className="rounded-2xl bg-[#383838] p-3">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-900">
              M
            </div>

            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium">Mouhamed</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
