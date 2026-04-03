import { Deal, DealStatus } from "@/types/deal";
import { DealCard } from "./DealCard";

const columnConfig: Record<DealStatus, { title: string; description: string }> = {
  new: { title: "New Deals", description: "Awaiting CIM upload" },
  analyzing: { title: "In Analysis", description: "AI processing" },
  reviewed: { title: "Reviewed", description: "Ready for decision" },
};

export function PipelineColumn({ status, deals }: { status: DealStatus; deals: Deal[] }) {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{columnConfig[status].title}</h3>
          <span className="text-xs text-muted-foreground bg-surface-2 px-2 py-0.5 rounded-full">
            {deals.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{columnConfig[status].description}</p>
      </div>
      <div className="space-y-2">
        {deals.map((deal, i) => (
          <DealCard key={deal.id} deal={deal} index={i} />
        ))}
      </div>
    </div>
  );
}
