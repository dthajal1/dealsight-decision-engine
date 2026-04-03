import { LayoutDashboard, Plus, Settings, CheckCircle2, AlertTriangle, XCircle, Loader2, FileText } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { mockDeals } from "@/data/mockDeals";
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

const verdictDot: Record<string, string> = {
  strong: "bg-verdict-positive",
  caution: "bg-verdict-caution",
  pass: "bg-verdict-negative",
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Brand */}
        <div className="px-4 py-5 border-b border-sidebar-border">
          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold text-sidebar-foreground tracking-tight">DealSight</p>
              <p className="text-[11px] text-muted-foreground">AI deal analysis</p>
            </div>
          ) : (
            <p className="text-sm font-bold text-sidebar-foreground text-center">D</p>
          )}
        </div>

        {/* Nav */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    end
                    className="hover:bg-sidebar-accent/50"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Overview</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Deals list */}
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">Deals</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {mockDeals.map((deal) => (
                <SidebarMenuItem key={deal.id}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/deal/${deal.id}`}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      {/* Verdict dot */}
                      <span className={`shrink-0 w-2 h-2 rounded-full mr-2 ${
                        deal.verdict
                          ? verdictDot[deal.verdict]
                          : deal.status === "analyzing"
                          ? "bg-muted-foreground animate-pulse"
                          : "bg-border"
                      }`} />
                      {!collapsed && (
                        <span className="truncate text-sm">{deal.name}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* New Deal button */}
        <div className="px-3 mt-2">
          <button
            onClick={() => navigate("/deal/new")}
            className={`w-full inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity ${
              collapsed ? "justify-center p-2" : "px-3 py-2"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            {!collapsed && "New Deal"}
          </button>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <Settings className="mr-2 h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
