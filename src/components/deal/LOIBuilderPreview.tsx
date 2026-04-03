import { motion } from "framer-motion";
import { Deal } from "@/types/deal";
import { formatCurrency } from "@/data/mockDeals";

export function LOIBuilderPreview({ deal }: { deal: Deal }) {
  const mid = deal.valuationLow && deal.valuationHigh
    ? Math.round((deal.valuationLow + deal.valuationHigh) / 2)
    : 3300000;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-base font-semibold text-foreground">LOI Builder</h2>
        <p className="text-xs text-muted-foreground mt-1">Auto-generated valuation range and deal terms</p>
      </div>

      {/* Valuation */}
      <div className="border rounded-lg p-5 bg-card">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Suggested Offer Range</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Conservative</p>
            <p className="text-lg font-semibold text-foreground">{formatCurrency(deal.valuationLow || 2500000)}</p>
            <p className="text-xs text-muted-foreground">3.0× EBITDA</p>
          </div>
          <div className="border-x">
            <p className="text-xs text-muted-foreground mb-1">Recommended</p>
            <p className="text-lg font-semibold text-primary">{formatCurrency(mid)}</p>
            <p className="text-xs text-muted-foreground">4.0× EBITDA</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Aggressive</p>
            <p className="text-lg font-semibold text-foreground">{formatCurrency(deal.valuationHigh || 4100000)}</p>
            <p className="text-xs text-muted-foreground">5.0× EBITDA</p>
          </div>
        </div>
      </div>

      {/* Deal Terms */}
      <div className="border rounded-lg p-5 bg-card">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Suggested Deal Structure</h3>
        <div className="space-y-3">
          {[
            { label: "Cash at Close (75%)", value: formatCurrency(Math.round(mid * 0.75)) },
            { label: "Seller Note (20%)", value: `${formatCurrency(Math.round(mid * 0.2))} — 3yr term, 6% interest` },
            { label: "Earnout (5%)", value: `${formatCurrency(Math.round(mid * 0.05))} — 12mo revenue retention >90%` },
            { label: "Working Capital Peg", value: formatCurrency(Math.round(mid * 0.25 / 4)) },
          ].map((term) => (
            <div key={term.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{term.label}</span>
              <span className="font-medium text-foreground">{term.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
