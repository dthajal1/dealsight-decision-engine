import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/data/mockDeals";
import { Badge } from "@/components/ui/badge";

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
  const key = verdict?.toLowerCase();
  const config: Record<string, { icon: React.ReactNode; label: string; bg: string; text: string }> = {
    strong: { icon: <CheckCircle2 className="w-5 h-5" />, label: "Proceed — Strong Opportunity", bg: "bg-verdict-positive", text: "text-verdict-positive" },
    caution: { icon: <AlertTriangle className="w-5 h-5" />, label: "Proceed with Caution", bg: "bg-verdict-caution", text: "text-verdict-caution" },
    pass: { icon: <XCircle className="w-5 h-5" />, label: "Pass — Too Many Risks", bg: "bg-verdict-negative", text: "text-verdict-negative" },
  };
  // Map "proceed with conditions" → caution
  let c = config[key];
  if (!c) {
    if (key?.includes("proceed")) c = config.caution;
    else if (key?.includes("pass")) c = config.pass;
    else c = config.caution;
  }
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

function flagColor(flag: string): string {
  const f = flag?.toUpperCase() || "";
  if (f === "FLAG" || f === "KEY ISSUE") return "bg-destructive text-destructive-foreground";
  if (["MODERATE CONCERN", "REVIEW REQUIRED", "VERIFY"].includes(f)) return "bg-verdict-caution text-verdict-caution-foreground";
  if (f === "NOTE") return "bg-muted text-muted-foreground";
  if (f === "CLEAN") return "bg-verdict-positive text-verdict-positive-foreground";
  return "bg-muted text-muted-foreground";
}

function FlagBadge({ flag }: { flag: string }) {
  return <Badge className={`${flagColor(flag)} text-[10px] uppercase tracking-wide font-semibold`}>{flag}</Badge>;
}

function Subsection({ title, flag, points }: { title: string; flag?: string; points?: string[] }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {flag && <FlagBadge flag={flag} />}
      </div>
      {points && points.length > 0 && (
        <ul className="space-y-1.5 ml-1">
          {points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
              {pt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function riskLevelColor(level: string): string {
  const l = level?.toLowerCase() || "";
  if (l === "high") return "bg-destructive text-destructive-foreground";
  if (l === "medium") return "bg-verdict-caution text-verdict-caution-foreground";
  if (l === "low") return "bg-verdict-positive text-verdict-positive-foreground";
  if (l.includes("upside")) return "bg-[hsl(175_50%_40%)] text-white";
  return "bg-muted text-muted-foreground";
}

// ── Main Component ──

interface CIMResultsDashboardProps {
  data: any;
}

export function CIMResultsDashboard({ data }: CIMResultsDashboardProps) {
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  if (!data) return null;

  const { key_metrics, cpa_view, ma_view, legal_view, buy_walk_signal, valuation, actionable_items, buyer_questions, missing_info } = data;

  // Normalize key_metrics: can be array or object
  const metricsArray = Array.isArray(key_metrics)
    ? key_metrics
    : key_metrics
      ? Object.entries(key_metrics).map(([k, v]) => ({ label: k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), value: typeof v === "number" ? (v > 10000 ? formatCurrency(v) : v.toString()) : String(v) }))
      : [];

  // Normalize actionable_items: can be array of strings or object with pre_loi/post_loi
  const actionItems: string[] = Array.isArray(actionable_items)
    ? actionable_items
    : actionable_items
      ? [
          ...(actionable_items.pre_loi?.map((i: any) => i.action) || []),
          ...(actionable_items.post_loi?.map((i: any) => i.action) || []),
        ]
      : [];

  return (
    <div className="space-y-6">
      {/* Verdict */}
      {buy_walk_signal && (
        <VerdictBadge verdict={buy_walk_signal.verdict} rationale={buy_walk_signal.rationale} />
      )}

      {/* Key Metrics Strip */}
      {metricsArray.length > 0 && (
        <Section title="Key Metrics" delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {metricsArray.map((m: any, i: number) => (
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
                <p className="text-lg font-semibold text-foreground">{formatCurrency(valuation.low || valuation.implied_value_low)}</p>
                <p className="text-[11px] text-muted-foreground">{valuation.low_multiple || (valuation.multiple_range_low ? `${valuation.multiple_range_low}x` : "")}</p>
              </div>
              <div className="border-x border-border">
                <p className="text-[11px] text-muted-foreground mb-0.5">Base Case</p>
                <p className="text-lg font-semibold text-primary">{formatCurrency(valuation.mid || valuation.implied_value_midpoint)}</p>
                <p className="text-[11px] text-muted-foreground">{valuation.mid_multiple || ""}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Aggressive</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(valuation.high || valuation.implied_value_high)}</p>
                <p className="text-[11px] text-muted-foreground">{valuation.high_multiple || (valuation.multiple_range_high ? `${valuation.multiple_range_high}x` : "")}</p>
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
        <Section title="CPA View" delay={0.15}>
          <div className="border border-border rounded-xl bg-card p-5 space-y-5">
            {cpa_view.revenue_quality && (
              <Subsection title="Revenue Quality" flag={cpa_view.revenue_quality.flag} points={cpa_view.revenue_quality.points} />
            )}
            {cpa_view.margin_ebitda && (
              <Subsection title="Margin & EBITDA" flag={cpa_view.margin_ebitda.flag} points={cpa_view.margin_ebitda.points} />
            )}
            {cpa_view.tax_accounting && (
              <Subsection title="Tax & Accounting" flag={cpa_view.tax_accounting.flag} points={cpa_view.tax_accounting.points} />
            )}
            {/* Fallback for items[] format */}
            {cpa_view.items?.map((item: any, i: number) => (
              <Subsection key={i} title={item.label} flag={item.flag} points={[item.value]} />
            ))}
          </div>
        </Section>
      )}

      {/* M&A View */}
      {ma_view && (
        <Section title="M&A View" delay={0.2}>
          <div className="border border-border rounded-xl bg-card p-5 space-y-5">
            {ma_view.valuation_framing && (
              <Subsection title="Valuation Framing" flag={ma_view.valuation_framing.flag} points={ma_view.valuation_framing.points} />
            )}
            {ma_view.deal_structure && (
              <Subsection title="Deal Structure" points={ma_view.deal_structure.points} />
            )}
            {ma_view.risk_scorecard && ma_view.risk_scorecard.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Risk Scorecard</p>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Risk</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {ma_view.risk_scorecard.map((r: any, i: number) => (
                        <tr key={i}>
                          <td className="px-4 py-2 text-foreground">{r.risk}</td>
                          <td className="px-4 py-2">
                            <Badge className={`${riskLevelColor(r.level)} text-[10px] uppercase font-semibold`}>{r.level}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* Fallback for items[] format */}
            {ma_view.items?.map((item: any, i: number) => (
              <Subsection key={i} title={item.label} flag={item.flag} points={[item.value]} />
            ))}
          </div>
        </Section>
      )}

      {/* Legal View */}
      {legal_view && (
        <Section title="Legal View" delay={0.25}>
          <div className="border border-border rounded-xl bg-card p-5 space-y-5">
            {legal_view.corporate_structure && (
              <Subsection title="Corporate Structure" flag={legal_view.corporate_structure.flag} points={legal_view.corporate_structure.points} />
            )}
            {legal_view.employment_labor && (
              <Subsection title="Employment & Labor" flag={legal_view.employment_labor.flag} points={legal_view.employment_labor.points} />
            )}
            {legal_view.contracts_liabilities && (
              <Subsection title="Contracts & Liabilities" flag={legal_view.contracts_liabilities.flag} points={legal_view.contracts_liabilities.points} />
            )}
            {/* Fallback for items[] format */}
            {legal_view.items?.map((item: any, i: number) => (
              <Subsection key={i} title={item.label} flag={item.flag} points={[item.value]} />
            ))}
          </div>
        </Section>
      )}

      {/* Action Items */}
      {actionItems.length > 0 && (
        <Section title="Action Items" delay={0.3}>
          <div className="border border-border rounded-xl p-4 bg-card space-y-2.5">
            {actionItems.map((item: string, i: number) => (
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
                  <div className="flex items-center gap-2 pr-4">
                    {q.category && <Badge variant="outline" className="text-[10px] shrink-0">{q.category}</Badge>}
                    <span className="text-sm font-medium text-foreground">{q.question}</span>
                  </div>
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
