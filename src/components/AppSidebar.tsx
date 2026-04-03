import { LayoutDashboard, Plus, Settings, ChevronDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { mockDeals } from "@/data/mockDeals";
import { Verdict } from "@/types/deal";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const verdictDot: Record<Verdict, string> = {
  strong: "bg-verdict-positive",
  caution: "bg-verdict-caution",
  pass: "bg-verdict-negative",
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const deals = mockDeals;
  const isDealsActive = currentPath === "/" || currentPath.startsWith("/deal/");
  const activeDealId = currentPath.startsWith("/deal/")
    ? currentPath.split("/deal/")[1]
    : null;

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

        {/* New Deal button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => navigate("/deal/new")}
            className={`w-full inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity ${
              collapsed ? "justify-center p-2" : "px-3 py-2"
            }`}
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && "New Deal"}
          </button>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Deals with sub-items */}
              <Collapsible defaultOpen={isDealsActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={`w-full ${isDealsActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50"}`}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">Deals</span>
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {/* All Deals link */}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <NavLink
                              to="/"
                              end
                              className="hover:bg-sidebar-accent/50 text-muted-foreground"
                              activeClassName="text-sidebar-primary font-medium"
                            >
                              <span className="text-xs">All Deals</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        {/* Individual deals */}
                        {deals.map((deal) => {
                          const isActive = activeDealId === deal.id;
                          return (
                            <SidebarMenuSubItem key={deal.id}>
                              <SidebarMenuSubButton asChild>
                                <NavLink
                                  to={`/deal/${deal.id}`}
                                  end
                                  className="hover:bg-sidebar-accent/50 text-muted-foreground"
                                  activeClassName="text-sidebar-primary font-medium bg-sidebar-accent"
                                >
                                  <span className="flex items-center gap-2 min-w-0">
                                    {deal.verdict ? (
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${verdictDot[deal.verdict]}`} />
                                    ) : deal.status === "analyzing" ? (
                                      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-muted-foreground animate-pulse" />
                                    ) : (
                                      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-border" />
                                    )}
                                    <span className="text-xs truncate">{deal.name}</span>
                                  </span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-muted-foreground hover:text-foreground">
              <Settings className="mr-2 h-4 w-4" />
              {!collapsed && <span>Settings</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
