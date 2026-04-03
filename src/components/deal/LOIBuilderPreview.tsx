import { motion } from "framer-motion";
import { Deal } from "@/types/deal";
import { formatCurrency } from "@/data/mockDeals";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function LOIBuilderPreview({ deal }: { deal: Deal }) {
  const low = deal.valuationLow || 2500000;
  const high = deal.valuationHigh || 4100000;
  const mid = Math.round((low + high) / 2);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Offer Range */}
      <Section title="Suggested Offer Range">
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { label: "Walk-Away", value: formatCurrency(low), multiple: "3.0×", desc: "Below this, seller unlikely to engage" },
              { label: "Target Price", value: formatCurrency(mid), multiple: "4.0×", desc: "Fair value given risk-adjusted earnings", primary: true },
              { label: "Ceiling", value: formatCurrency(high), multiple: "5.0×", desc: "Only if all diligence clears perfectly" },
            ].map((col) => (
              <div key={col.label} className="p-4 text-center">
                <p className="text-[11px] text-muted-foreground mb-1">{col.label}</p>
                <p className={`text-lg font-semibold ${col.primary ? "text-primary" : "text-foreground"}`}>{col.value}</p>
                <p className="text-[11px] text-muted-foreground">{col.multiple} SDE</p>
                <p className="text-[10px] text-muted-foreground mt-2 leading-tight">{col.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Deal Structure */}
      <Section title="Recommended Deal Structure">
        <div className="border border-border rounded-xl bg-card overflow-hidden divide-y divide-border">
          {[
            { component: "Cash at Close", pct: "70%", value: formatCurrency(Math.round(mid * 0.7)), note: "SBA 7(a) eligible — 10% buyer equity required" },
            { component: "Seller Note", pct: "20%", value: formatCurrency(Math.round(mid * 0.2)), note: "3-year term · 6% interest · 6-month standby" },
            { component: "Earnout", pct: "10%", value: formatCurrency(Math.round(mid * 0.1)), note: "Tied to 12-month revenue retention ≥90%" },
          ].map((row) => (
            <div key={row.component} className="flex items-start justify-between px-4 py-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{row.component}</p>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-1 text-muted-foreground">{row.pct}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{row.note}</p>
              </div>
              <p className="text-sm font-semibold text-foreground">{row.value}</p>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3 bg-surface-1">
            <span className="text-sm font-semibold text-foreground">Total Consideration</span>
            <span className="text-sm font-semibold text-foreground">{formatCurrency(mid)}</span>
          </div>
        </div>
      </Section>

      {/* Key Terms */}
      <Section title="Key LOI Terms">
        <div className="border border-border rounded-xl bg-card overflow-hidden divide-y divide-border">
          {[
            { term: "Exclusivity Period", value: "60 days" },
            { term: "Due Diligence Period", value: "45 days from LOI execution" },
            { term: "Working Capital Peg", value: formatCurrency(Math.round(mid * 0.06)) },
            { term: "Seller Transition", value: "90 days post-close, then 6-month advisory" },
            { term: "Non-Compete", value: "3 years, 50-mile radius" },
            { term: "Closing Target", value: "Within 90 days of LOI" },
          ].map((row) => (
            <div key={row.term} className="flex justify-between px-4 py-3">
              <span className="text-sm text-muted-foreground">{row.term}</span>
              <span className="text-sm font-medium text-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Contingencies */}
      <Section title="Standard Contingencies">
        <div className="border border-border rounded-xl p-4 bg-card space-y-2">
          {[
            "Satisfactory completion of financial, legal, and operational due diligence",
            "Buyer securing financing on commercially reasonable terms",
            "No material adverse change in business between signing and close",
            "Successful assignment or transfer of all material contracts and licenses",
            "Landlord consent to lease assignment at current terms",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs text-muted-foreground mt-0.5 shrink-0">{i + 1}.</span>
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}
