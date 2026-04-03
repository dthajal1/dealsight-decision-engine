import { useState, useCallback } from "react";
import { Deal } from "@/types/deal";
import { formatCurrency } from "@/data/mockDeals";
import { motion } from "framer-motion";
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Building2,
  Percent,
} from "lucide-react";

// Upload Zone
function UploadZone({ onUpload }: { onUpload: () => void }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24"
    >
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); onUpload(); }}
        onClick={onUpload}
        className={`w-full max-w-md border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging ? "border-primary bg-surface-1 scale-[1.02]" : "border-border hover:border-muted-foreground hover:bg-surface-1"
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm font-medium text-foreground mb-1">Upload CIM document</p>
        <p className="text-xs text-muted-foreground">Drag & drop a PDF or click to browse</p>
      </div>
      <p className="text-xs text-muted-foreground mt-4">Any broker format, any length — analyzed in under 60 seconds</p>
    </motion.div>
  );
}

// Analysis Progress
const analysisSteps = [
  "Extracting financial statements",
  "Identifying risk factors",
  "Calculating valuation range",
  "Assessing owner dependency",
  "Generating report",
];

function AnalysisProgress({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const stableOnComplete = useCallback(onComplete, []);

  useState(() => {
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      if (step >= analysisSteps.length) {
        clearInterval(timer);
        setTimeout(stableOnComplete, 600);
      } else {
        setCurrent(step);
      }
    }, 1000);
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-sm font-medium text-foreground">Analyzing CIM...</p>
        </div>
        <div className="space-y-3">
          {analysisSteps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              {i < current ? (
                <CheckCircle2 className="w-4 h-4 text-verdict-positive shrink-0" />
              ) : i === current ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-border shrink-0" />
              )}
              <span className={`text-sm ${i <= current ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Verdict Badge
function VerdictBadge({ verdict }: { verdict: "strong" | "caution" | "pass" }) {
  const config = {
    strong: { icon: <CheckCircle2 className="w-5 h-5" />, label: "Proceed — Strong Opportunity", bg: "bg-verdict-positive", text: "text-verdict-positive" },
    caution: { icon: <AlertTriangle className="w-5 h-5" />, label: "Proceed with Caution", bg: "bg-verdict-caution", text: "text-verdict-caution" },
    pass: { icon: <XCircle className="w-5 h-5" />, label: "Pass — Too Many Risks", bg: "bg-verdict-negative", text: "text-verdict-negative" },
  };
  const c = config[verdict];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${c.bg} ${c.text} rounded-xl px-5 py-4 flex items-center gap-3`}
    >
      {c.icon}
      <span className="text-base font-semibold">{c.label}</span>
    </motion.div>
  );
}

// Section wrapper
function Section({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </motion.div>
  );
}

// Main CIM Analysis Component
export function CIMAnalysis({ deal }: { deal: Deal }) {
  const hasResults = deal.status === "reviewed" && deal.verdict;
  const [phase, setPhase] = useState<"upload" | "analyzing" | "results">(
    hasResults ? "results" : "upload"
  );

  const handleUpload = useCallback(() => setPhase("analyzing"), []);
  const handleComplete = useCallback(() => setPhase("results"), []);

  if (phase === "upload") return <UploadZone onUpload={handleUpload} />;
  if (phase === "analyzing") return <AnalysisProgress onComplete={handleComplete} />;

  const revenueGrowth = -2.3;
  const grossMargin = 65;
  const ebitdaMargin = deal.revenue && deal.netIncome ? Math.round((deal.netIncome / deal.revenue) * 100) : 34;

  return (
    <div className="space-y-6">
      {/* Verdict */}
      {deal.verdict && <VerdictBadge verdict={deal.verdict} />}

      {/* Business Snapshot */}
      <Section title="Business Snapshot" delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Building2, label: "Industry", value: deal.industry || "—" },
            { icon: Users, label: "Employees", value: deal.employees ? `${deal.employees}` : "—" },
            { icon: Calendar, label: "Est.", value: deal.yearEstablished ? `${deal.yearEstablished}` : "—" },
            { icon: Percent, label: "Recurring Rev", value: deal.recurringRevenuePct ? `${deal.recurringRevenuePct}%` : "—" },
          ].map((m) => (
            <div key={m.label} className="border border-border rounded-lg p-3 bg-card">
              <div className="flex items-center gap-1.5 mb-1">
                <m.icon className="w-3 h-3 text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground">{m.label}</p>
              </div>
              <p className="text-sm font-semibold text-foreground">{m.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Financial Overview */}
      <Section title="Financial Overview" delay={0.1}>
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
            {[
              { label: "Revenue", value: deal.revenue ? formatCurrency(deal.revenue) : "—", sub: null },
              { label: "Net Income", value: deal.netIncome ? formatCurrency(deal.netIncome) : "—", sub: deal.revenue && deal.netIncome ? `${ebitdaMargin}% margin` : null },
              { label: "Gross Margin", value: `${grossMargin}%`, sub: "vs. 55% industry avg" },
              { label: "YoY Growth", value: `${revenueGrowth}%`, sub: "declining", negative: true },
            ].map((m) => (
              <div key={m.label} className="p-4">
                <p className="text-[11px] text-muted-foreground mb-1">{m.label}</p>
                <p className={`text-lg font-semibold ${(m as any).negative ? "text-verdict-negative" : "text-foreground"}`}>{m.value}</p>
                {m.sub && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    {(m as any).negative ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                    {m.sub}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Valuation Range */}
      {deal.valuationLow && deal.valuationHigh && (
        <Section title="Estimated Valuation" delay={0.15}>
          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Conservative</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(deal.valuationLow)}</p>
                <p className="text-[11px] text-muted-foreground">3.0× SDE</p>
              </div>
              <div className="border-x border-border">
                <p className="text-[11px] text-muted-foreground mb-0.5">Base Case</p>
                <p className="text-lg font-semibold text-primary">{formatCurrency(Math.round((deal.valuationLow + deal.valuationHigh) / 2))}</p>
                <p className="text-[11px] text-muted-foreground">4.0× SDE</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Aggressive</p>
                <p className="text-lg font-semibold text-foreground">{formatCurrency(deal.valuationHigh)}</p>
                <p className="text-[11px] text-muted-foreground">5.0× SDE</p>
              </div>
            </div>
            <div className="relative h-2 bg-surface-1 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-[10%] right-[10%] bg-primary/15 rounded-full" />
              <div className="absolute inset-y-0 left-[35%] right-[35%] bg-primary/30 rounded-full" />
            </div>
          </div>
        </Section>
      )}

      {/* Risk Flags */}
      {deal.risks && deal.risks.length > 0 && (
        <Section title={`Risk Flags (${deal.risks.length})`} delay={0.2}>
          <div className="space-y-2">
            {deal.risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border bg-card">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                    risk.severity === "high"
                      ? "bg-verdict-negative text-verdict-negative"
                      : "bg-verdict-caution text-verdict-caution"
                  }`}
                >
                  {risk.severity.toUpperCase()}
                </span>
                <span className="text-sm text-foreground">{risk.label}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Business Summary */}
      {deal.summary && (
        <Section title="AI Summary" delay={0.25}>
          <p className="text-sm text-muted-foreground leading-relaxed border border-border rounded-xl p-4 bg-card">{deal.summary}</p>
        </Section>
      )}

      {/* Next Steps */}
      {deal.nextSteps && deal.nextSteps.length > 0 && (
        <Section title="Recommended Next Steps" delay={0.3}>
          <div className="border border-border rounded-xl p-4 bg-card space-y-2.5">
            {deal.nextSteps.map((step, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 rounded border-border accent-primary" />
                <span className="text-sm text-foreground group-hover:text-muted-foreground transition-colors">{step}</span>
              </label>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
