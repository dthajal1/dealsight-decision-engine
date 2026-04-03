import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/data/mockDeals";

// ── Helpers ──

function Section({ title, delay = 0, children }: { title: string; delay?: number; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </motion.div>
  );
}

function VerdictBadge({ verdict, rationale }: { verdict: string; rationale?: string }) {
  const config: Record<string, { icon: React.ReactNode; label: string; bg: string; text: string }> = {
    strong: { icon: <CheckCircle2 className="w-5 h-5" />, label: "Proceed — Strong Opportunity", bg: "bg-verdict-positive", text: "text-verdict-positive" },
    caution: { icon: <AlertTriangle className="w-5 h-5" />, label: "Proceed with Caution", bg: "bg-verdict-caution", text: "text-verdict-caution" },
    pass: { icon: <XCircle className="w-5 h-5" />, label: "Pass — Too Many Risks", bg: "bg-verdict-negative", text: "text-verdict-negative" },
  };
  const c = config[verdict] || config.caution;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${c.bg} ${c.text} rounded-xl px-5 py-4`}>
      <div className="flex items-center gap-3">
        {c.icon}
        <span className="text-base font-semibold">{c.label}</span>
      </div>
      {rationale && <p className="text-xs mt-2 opacity-80">{rationale}</p>}
    </motion.div>
  );
}

function FlagIcon({ flag }: { flag: string }) {
  if (flag === "ok") return <CheckCircle2 className="w-3.5 h-3.5 text-verdict-positive shrink-0" />;
  if (flag === "warn") return <AlertTriangle className="w-3.5 h-3.5 text-verdict-caution shrink-0" />;
  return <XCircle className="w-3.5 h-3.5 text-verdict-negative shrink-0" />;
}

// ── Main Component ──

interface CIMResultsDashboardProps {
  data: any;
}

export function CIMResultsDashboard({ data }: CIMResultsDashboardProps) {
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  if (!data) return null;

  const { meta, key_metrics, cpa_view, ma_view, legal_view, buy_walk_signal, valuation, actionable_items, buyer_questions, missing_info } = data;

  return (
    <div className="space-y-6">
      {/* Verdict */}
      {buy_walk_signal && (
        <VerdictBadge verdict={buy_walk_signal.verdict} rationale={buy_walk_signal.rationale} />
      )}

      {/* Key Metrics Strip */}
      {key_metrics && key_metrics.length > 0 && (
        <Section title="Key Metrics" delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {key_metrics.map((m: any, i: number) => (
              <div key={i} className="border border-border rounded-lg p-3 bg-card">
                <p className="text-[11px] text-muted-foreground mb-1">{m.label}</p>
                <p className="text-sm font-semibold text-foreground">{m.value}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Valuation Range */}
      {valuation && (
        <Section title="Estimated Valuation" delay={0.1}>
          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Conservative</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(valuation.low)}</p>
                <p className="text-[11px] text-muted-foreground">{valuation.low_multiple}</p>
              </div>
              <div className="border-x border-border">
                <p className="text-[11px] text-muted-foreground mb-0.5">Base Case</p>
                <p className="text-lg font-semibold text-primary">{formatCurrency(valuation.mid)}</p>
                <p className="text-[11px] text-muted-foreground">{valuation.mid_multiple}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Aggressive</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(valuation.high)}</p>
                <p className="text-[11px] text-muted-foreground">{valuation.high_multiple}</p>
              </div>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-[10%] right-[10%] bg-primary/15 rounded-full" />
              <div className="absolute inset-y-0 left-[35%] right-[35%] bg-primary/30 rounded-full" />
            </div>
          </div>
        </Section>
      )}

      {/* CPA View */}
      {cpa_view && (
        <Section title={cpa_view.title || "CPA View"} delay={0.15}>
          <div className="border border-border rounded-xl bg-card divide-y divide-border overflow-hidden">
            {cpa_view.items?.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <FlagIcon flag={item.flag} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* M&A View */}
      {ma_view && (
        <Section title={ma_view.title || "M&A View"} delay={0.2}>
          <div className="border border-border rounded-xl bg-card divide-y divide-border overflow-hidden">
            {ma_view.items?.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <FlagIcon flag={item.flag} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Legal View */}
      {legal_view && (
        <Section title={legal_view.title || "Legal View"} delay={0.25}>
          <div className="border border-border rounded-xl bg-card divide-y divide-border overflow-hidden">
            {legal_view.items?.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <FlagIcon flag={item.flag} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Action Items */}
      {actionable_items && actionable_items.length > 0 && (
        <Section title="Action Items" delay={0.3}>
          <div className="border border-border rounded-xl p-4 bg-card space-y-2.5">
            {actionable_items.map((item: string, i: number) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 rounded border-border accent-primary" />
                <span className="text-sm text-foreground group-hover:text-muted-foreground transition-colors">{item}</span>
              </label>
            ))}
          </div>
        </Section>
      )}

      {/* Buyer Questions Accordion */}
      {buyer_questions && buyer_questions.length > 0 && (
        <Section title="Buyer Questions" delay={0.35}>
          <div className="border border-border rounded-xl bg-card overflow-hidden divide-y divide-border">
            {buyer_questions.map((q: any, i: number) => (
              <div key={i}>
                <button
                  onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground pr-4">{q.question}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${expandedQ === i ? "rotate-180" : ""}`} />
                </button>
                {expandedQ === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-4 pb-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">{q.context}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Missing Info Pills */}
      {missing_info && missing_info.length > 0 && (
        <Section title="Missing Information" delay={0.4}>
          <div className="flex flex-wrap gap-2">
            {missing_info.map((item: string, i: number) => (
              <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
