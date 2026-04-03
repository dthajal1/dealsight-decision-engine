import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockDeals } from "@/data/mockDeals";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckCircle2, AlertTriangle, XCircle, Loader2, FileText } from "lucide-react";

const verdictIcons: Record<string, React.ReactNode> = {
  strong: <CheckCircle2 className="w-3.5 h-3.5 text-verdict-positive" />,
  caution: <AlertTriangle className="w-3.5 h-3.5 text-verdict-caution" />,
  pass: <XCircle className="w-3.5 h-3.5 text-verdict-negative" />,
};

export function DealSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (dealId: string) => {
    setOpen(false);
    navigate(`/deal/${dealId}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-surface-1 border border-border rounded-lg px-3 py-1.5 hover:bg-surface-2 transition-colors"
      >
        <span>Search deals…</span>
        <kbd className="pointer-events-none hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search deals by name, industry, location…" />
        <CommandList>
          <CommandEmpty>No deals found.</CommandEmpty>
          <CommandGroup heading="Deals">
            {mockDeals.map((deal) => (
              <CommandItem
                key={deal.id}
                value={`${deal.name} ${deal.industry} ${deal.location}`}
                onSelect={() => handleSelect(deal.id)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <span className="shrink-0">
                  {deal.verdict
                    ? verdictIcons[deal.verdict]
                    : deal.status === "analyzing"
                    ? <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                    : <FileText className="w-3.5 h-3.5 text-muted-foreground" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{deal.name}</p>
                  <p className="text-xs text-muted-foreground">{deal.industry} · {deal.location}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
