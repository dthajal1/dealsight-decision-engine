import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, MinusCircle } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function FinancialScreenPreview() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Screening Verdict */}
      <div className="bg-verdict-caution rounded-xl px-5 py-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-verdict-caution" />
        <div>
          <p className="text-base font-semibold text-verdict-caution">Conditional Pass</p>
          <p className="text-xs text-muted-foreground">Requires owner comp verification and accrual restatement</p>
        </div>
      </div>

      {/* Adjusted Earnings Bridge */}
      <Section title="Adjusted Earnings Bridge">
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {[
              { label: "Reported Net Income", value: "$828,627", type: "base" },
              { label: "Owner compensation add-back", value: "+$145,000", type: "add" },
              { label: "Related party lease adjustment", value: "+$12,000", type: "add" },
              { label: "One-time legal fees", value: "+$18,500", type: "add" },
              { label: "Non-recurring equipment purchase", value: "+$35,000", type: "add" },
              { label: "Market-rate manager salary", value: "−$95,000", type: "sub" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center px-4 py-3">
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className={`text-sm font-medium ${
                  row.type === "add" ? "text-verdict-positive" : row.type === "sub" ? "text-verdict-negative" : "text-foreground"
                }`}>{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center px-4 py-3 bg-surface-1">
              <span className="text-sm font-semibold text-foreground">Adjusted SDE / EBITDA</span>
              <span className="text-sm font-semibold text-foreground">$944,127</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Revenue Quality */}
      <Section title="Revenue Quality">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Recurring Revenue", value: "80%", status: "good" },
            { label: "Client Retention", value: "90%+", status: "good" },
            { label: "Top Client Conc.", value: "18%", status: "ok" },
            { label: "Revenue Trend", value: "−2.3% YoY", status: "warn" },
          ].map((m) => (
            <div key={m.label} className="border border-border rounded-lg p-3 bg-card">
              <p className="text-[11px] text-muted-foreground mb-1">{m.label}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-foreground">{m.value}</p>
                {m.status === "good" && <CheckCircle2 className="w-3 h-3 text-verdict-positive" />}
                {m.status === "warn" && <TrendingDown className="w-3 h-3 text-verdict-negative" />}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Margin Analysis */}
      <Section title="Margin Trends (3-Year)">
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-1">
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase">Metric</th>
                <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase">2020</th>
                <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase">2021</th>
                <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase">2022</th>
                <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-muted-foreground uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { metric: "Revenue", y1: "$2.35M", y2: "$2.50M", y3: "$2.44M", trend: "down" },
                { metric: "Gross Margin", y1: "62%", y2: "64%", y3: "65%", trend: "up" },
                { metric: "SDE Margin", y1: "30%", y2: "33%", y3: "34%", trend: "up" },
                { metric: "EBITDA", y1: "$705K", y2: "$825K", y3: "$829K", trend: "flat" },
              ].map((row) => (
                <tr key={row.metric}>
                  <td className="px-4 py-2.5 font-medium text-foreground">{row.metric}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{row.y1}</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground">{row.y2}</td>
                  <td className="px-4 py-2.5 text-right text-foreground font-medium">{row.y3}</td>
                  <td className="px-4 py-2.5 text-right">
                    {row.trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-verdict-positive inline" />}
                    {row.trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-verdict-negative inline" />}
                    {row.trend === "flat" && <MinusCircle className="w-3.5 h-3.5 text-muted-foreground inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Verification Flags */}
      <Section title="Verification Flags">
        <div className="space-y-2">
          {[
            { icon: AlertTriangle, color: "text-verdict-caution", bg: "bg-verdict-caution", label: "Cash-to-accrual restatement needed", desc: "Revenue timing could shift ±8–12% after conversion" },
            { icon: AlertTriangle, color: "text-verdict-caution", bg: "bg-verdict-caution", label: "Owner draw not separated from salary", desc: "Need W-2 to confirm market-rate compensation" },
            { icon: CheckCircle2, color: "text-verdict-positive", bg: "bg-verdict-positive", label: "Revenue trend consistent with CIM", desc: "YoY decline of −2.3% matches stated figures" },
            { icon: CheckCircle2, color: "text-verdict-positive", bg: "bg-verdict-positive", label: "No outstanding litigation found", desc: "Verified against public records" },
          ].map((flag, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
              <flag.icon className={`w-4 h-4 ${flag.color} shrink-0 mt-0.5`} />
              <div>
                <p className={`text-sm font-medium text-foreground`}>{flag.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{flag.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}
