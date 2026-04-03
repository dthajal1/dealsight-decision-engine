import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DealSearch } from "@/components/DealSearch";
import { ChatSidebar } from "@/components/ChatSidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 px-4">
            <SidebarTrigger className="text-muted-foreground" />
            <div className="flex items-center gap-2">
              <DealSearch />
              <ChatSidebar />
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
