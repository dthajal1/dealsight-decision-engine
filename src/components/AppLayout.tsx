import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DealSearch } from "@/components/DealSearch";
import { ChatSidebar } from "@/components/ChatSidebar";
import { Sparkles } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center justify-between border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 px-4">
            <SidebarTrigger className="text-muted-foreground" />
            <div className="flex items-center gap-2">
              <DealSearch />
              <button
                onClick={() => setChatOpen((v) => !v)}
                className={`p-1.5 rounded-md transition-colors ${chatOpen ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}
                title="AI Assistant"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </header>
          <div className="flex-1 flex min-h-0">
            <main className="flex-1 overflow-y-auto">{children}</main>
            <ChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
