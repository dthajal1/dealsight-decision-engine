import { LayoutDashboard, Plus, Settings, ChevronsUpDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useDeals } from "@/hooks/useDeals";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const verdictDot: Record<string, string> = {
  strong: "bg-verdict-positive",
  caution: "bg-verdict-caution",
  pass: "bg-verdict-negative",
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { data: deals = [] } = useDeals();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Brand */}
        <div className="px-3 pt-4 pb-3">
          {!collapsed ? (
            <p className="text-[13px] font-semibold text-sidebar-foreground tracking-tight px-1">DealSight</p>
          ) : (
            <p className="text-[13px] font-semibold text-sidebar-foreground text-center">D</p>
          )}
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Nav */}
        <SidebarGroup className="pt-2">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    end
                    className="hover:bg-sidebar-accent"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {!collapsed && <span className="text-[13px]">Overview</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Deals list */}
        <SidebarGroup className="pt-0">
          {!collapsed && (
            <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-3">
              Deals
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {deals.map((deal) => (
                <SidebarMenuItem key={deal.id}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/deal/${deal.id}`}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <span className={`shrink-0 w-1.5 h-1.5 rounded-full mr-2 ${
                        deal.verdict
                          ? verdictDot[deal.verdict] || "bg-border"
                          : deal.status === "analyzing"
                          ? "bg-muted-foreground animate-pulse"
                          : "bg-border"
                      }`} />
                      {!collapsed && (
                        <span className="truncate text-[13px]">{deal.name}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* New Deal button */}
        <div className="px-3 mt-1">
          <button
            onClick={() => navigate("/deal/new")}
            className={`w-full inline-flex items-center gap-2 bg-primary text-primary-foreground text-[13px] font-medium rounded-md hover:opacity-90 transition-opacity ${
              collapsed ? "justify-center p-2" : "px-3 py-1.5"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            {!collapsed && "New Deal"}
          </button>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-2.5"} rounded-md px-2 py-1.5 hover:bg-sidebar-accent transition-colors cursor-pointer`}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center shrink-0">
            <span className="text-[11px] font-semibold text-primary">DU</span>
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-sidebar-foreground truncate leading-tight">Demo User</p>
                <p className="text-[11px] text-muted-foreground truncate leading-tight">demo@dealsight.ai</p>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
