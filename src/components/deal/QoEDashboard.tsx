import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, CheckCircle2, AlertTriangle, XCircle, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const QOE_WEBHOOK = "https://silmuio.app.n8n.cloud/webhook/qoe-analysis";

// ── Helpers ──

function formatUSD(n: number | undefined | null): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function severityColor(sev: string): string {
  const s = sev?.toUpperCase() || "";
  if (s === "CRITICAL") return "bg-destructive text-destructive-foreground";
  if (s === "HIGH") return "bg-[hsl(25_90%_50%)] text-white";
  if (s === "MEDIUM") return "bg-verdict-caution text-verdict-caution-foreground";
  if (s === "LOW") return "bg-verdict-positive text-verdict-positive-foreground";
  return "bg-muted text-muted-foreground";
}

function priorityColor(pri: string): string {
  const p = pri?.toUpperCase() || "";
  if (p === "HIGH") return "bg-destructive text-destructive-foreground";
  if (p === "MEDIUM") return "bg-verdict-caution text-verdict-caution-foreground";
  if (p === "LOW") return "bg-verdict-positive text-verdict-positive-foreground";
  return "bg-muted text-muted-foreground";
}

function verdictStyle(verdict: string) {
  const v = verdict?.toUpperCase() || "";
  if (v.includes("PROCEED")) return { bg: "bg-verdict-positive", text: "text-verdict-positive", icon: <CheckCircle2 className="w-6 h-6" /> };
  if (v.includes("CAUTION")) return { bg: "bg-verdict-caution", text: "text-verdict-caution-foreground", icon: <AlertTriangle className="w-6 h-6" /> };
  return { bg: "bg-verdict-negative", text: "text-verdict-negative", icon: <XCircle className="w-6 h-6" /> };
}

function locColor(pct: number): string {
  if (pct > 80) return "bg-destructive";
  if (pct > 60) return "bg-verdict-caution";
  return "bg-verdict-positive";
}

function arColor(level: string): string {
  const l = level?.toUpperCase() || "";
  if (l === "HIGH") return "bg-destructive text-destructive-foreground";
  if (l === "MEDIUM") return "bg-verdict-caution text-verdict-caution-foreground";
  return "bg-verdict-positive text-verdict-positive-foreground";
}

function Section({ title, delay = 0, children }: { title: string; delay?: number; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </motion.div>
  );
}

// ── Upload Form ──

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsText(file);
  });
}

function QoEUploadForm({ onResult, onError }: { onResult: (data: any) => void; onError: (err: string) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [askingPrice, setAskingPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const addFiles = (newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).filter(f => f.name.endsWith(".csv"));
    if (arr.length === 0) { toast.error("Only .csv files are accepted"); return; }
    setFiles(prev => [...prev, ...arr]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0 || !askingPrice) {
      toast.error("Please provide at least one CSV file and asking price");
      return;
    }

    setLoading(true);
    try {
      const csvTexts = await Promise.all(files.map(readFileAsText));
      const combinedCsv = csvTexts.join("\n");

      console.log("[QoE] Files:", files.map(f => f.name));
      console.log("[QoE] Combined CSV length:", combinedCsv.length);
      console.log("[QoE] Asking price:", askingPrice);

      const formData = new FormData();
      formData.append("csvData", combinedCsv);
      formData.append("askingPrice", askingPrice);

      const resp = await fetch(QOE_WEBHOOK, {
        method: "POST",
        body: formData,
      });

      console.log("[QoE] Response status:", resp.status);
      const text = await resp.text();
      console.log("[QoE] Raw response length:", text.length);
      console.log("[QoE] Raw response preview:", text.slice(0, 300));

      if (!resp.ok) {
        throw new Error(`Request failed: ${resp.status} - ${text.slice(0, 200)}`);
      }

      if (!text || text.trim() === "") {
        throw new Error("Webhook returned an empty response");
      }

      const data = JSON.parse(text);
      console.log("[QoE] Parsed data:", data);
      onResult(data);
    } catch (e: any) {
      console.error("[QoE] Error:", e);
      onError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium text-foreground">Analyzing financials…</p>
        <p className="text-xs text-muted-foreground mt-1">This may take up to 30 seconds</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto space-y-5">
      <div>
        <label className="block text-xs font-medium text-foreground mb-1.5">QuickBooks Export (.csv)</label>
        <div
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".csv";
            input.onchange = (e) => {
              const f = (e.target as HTMLInputElement).files?.[0];
              if (f) setFile(f);
            };
            input.click();
          }}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            file ? "border-primary/50 bg-primary/5" : "border-border hover:border-muted-foreground hover:bg-muted/30"
          }`}
        >
          <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
          {file ? (
            <>
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </>
          ) : (
            <>
              <p className="text-sm text-foreground">Drop CSV file here or click to browse</p>
              <p className="text-xs text-muted-foreground">.csv files only</p>
            </>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-1.5">Asking Price (USD)</label>
        <input
          type="number"
          value={askingPrice}
          onChange={(e) => setAskingPrice(e.target.value)}
          placeholder="e.g. 4000000"
          className="w-full text-sm px-3 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!file || !askingPrice}
        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        Run Analysis
      </button>
    </motion.div>
  );
}

// ── Results Dashboard ──

function QoEResults({ data, onReset }: { data: any; onReset: () => void }) {
  const vs = verdictStyle(data.verdict || "");
  const locPct = parseFloat(data.working_capital?.loc_utilization) || 0;

  return (
    <div className="space-y-6">
      {/* Verdict Banner */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${vs.bg} ${vs.text} rounded-xl px-5 py-5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {vs.icon}
            <div>
              <span className="text-lg font-bold">{data.verdict}</span>
              {data.verdict_reason && <p className="text-xs mt-1 opacity-80">{data.verdict_reason}</p>}
            </div>
          </div>
          {data.company_name && <span className="text-sm font-medium opacity-80">{data.company_name}</span>}
        </div>
      </motion.div>

      {/* Key Metrics Row */}
      <Section title="Key Metrics" delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="border border-border rounded-lg p-4 bg-card">
            <p className="text-[11px] text-muted-foreground mb-1">Normalized EBITDA</p>
            <p className="text-lg font-semibold text-foreground">{formatUSD(data.normalized_ebitda)}</p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <p className="text-[11px] text-muted-foreground mb-1">Deal Multiple</p>
            <p className="text-lg font-semibold text-foreground">
              {data.valuation?.multiple_on_normalized_ebitda != null ? `${data.valuation.multiple_on_normalized_ebitda}x` : "—"}
            </p>
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <p className="text-[11px] text-muted-foreground mb-1">AR at Risk</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-foreground">{formatUSD(data.working_capital?.ar_at_risk)}</p>
              {data.working_capital?.ar_risk_level && (
                <Badge className={`${arColor(data.working_capital.ar_risk_level)} text-[10px]`}>
                  {data.working_capital.ar_risk_level}
                </Badge>
              )}
            </div>
            {data.working_capital?.flags && data.working_capital.flags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {data.working_capital.flags.map((f: string, i: number) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{f}</span>
                ))}
              </div>
            )}
          </div>
          <div className="border border-border rounded-lg p-4 bg-card">
            <p className="text-[11px] text-muted-foreground mb-1">LOC Utilization</p>
            <p className="text-lg font-semibold text-foreground">{locPct}%</p>
            <Progress value={locPct} className={`h-1.5 mt-2 ${locColor(locPct)}`} />
          </div>
        </div>
      </Section>

      {/* EBITDA Bridge */}
      {data.ebitda_bridge && (
        <Section title="EBITDA Bridge" delay={0.1}>
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Item</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="text-center px-4 py-2 text-xs font-medium text-muted-foreground">Direction</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.ebitda_bridge.adjustments?.map((adj: any, i: number) => (
                  <tr key={i}>
                    <td className="px-4 py-2 text-foreground">{adj.category}</td>
                    <td className="px-4 py-2 text-foreground">{adj.item}</td>
                    <td className="px-4 py-2 text-right font-mono text-foreground">{formatUSD(adj.amount)}</td>
                    <td className="px-4 py-2 text-center">
                      <Badge variant="outline" className="text-[10px]">{adj.direction}</Badge>
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{adj.rationale}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-border">
                <tr className="bg-muted/30">
                  <td colSpan={2} className="px-4 py-2 text-sm font-bold text-foreground">Reported EBITDA</td>
                  <td className="px-4 py-2 text-right font-mono font-bold text-foreground">{formatUSD(data.ebitda_bridge.reported_ebitda)}</td>
                  <td colSpan={2} />
                </tr>
                <tr className="bg-muted/30">
                  <td colSpan={2} className="px-4 py-2 text-sm font-bold text-primary">Normalized EBITDA</td>
                  <td className="px-4 py-2 text-right font-mono font-bold text-primary">{formatUSD(data.ebitda_bridge.normalized_ebitda)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </Section>
      )}

      {/* Valuation */}
      {data.valuation && (
        <Section title="Valuation" delay={0.15}>
          <div className="border border-border rounded-xl p-5 bg-card space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Asking Price</p>
                <p className="text-base font-semibold text-foreground">{formatUSD(data.valuation.asking_price)}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Multiple (Reported)</p>
                <p className="text-base font-semibold text-foreground">
                  {data.valuation.multiple_on_reported_ebitda != null ? `${data.valuation.multiple_on_reported_ebitda}x` : "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">Multiple (Normalized)</p>
                <p className="text-base font-semibold text-primary">
                  {data.valuation.multiple_on_normalized_ebitda != null ? `${data.valuation.multiple_on_normalized_ebitda}x` : "—"}
                </p>
              </div>
            </div>
            {data.valuation.assessment && (
              <p className="text-sm text-muted-foreground border-t border-border pt-3">{data.valuation.assessment}</p>
            )}
          </div>
        </Section>
      )}

      {/* Red Flags */}
      {data.red_flags && data.red_flags.length > 0 && (
        <Section title="Red Flags" delay={0.2}>
          <div className="space-y-2">
            {data.red_flags.map((flag: any, i: number) => (
              <div key={i} className="border border-border rounded-lg px-4 py-3 bg-card flex items-start gap-3">
                <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`${severityColor(flag.severity)} text-[10px]`}>{flag.severity}</Badge>
                    {flag.category && <span className="text-[10px] text-muted-foreground uppercase">{flag.category}</span>}
                  </div>
                  <p className="text-sm text-foreground">{flag.finding}</p>
                  {flag.financial_impact && (
                    <p className="text-xs text-muted-foreground mt-1">Impact: {flag.financial_impact}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Green Flags */}
      {data.green_flags && data.green_flags.length > 0 && (
        <Section title="Green Flags" delay={0.25}>
          <div className="space-y-2">
            {data.green_flags.map((flag: any, i: number) => (
              <div key={i} className="border border-border rounded-lg px-4 py-3 bg-card flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-verdict-positive shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">{typeof flag === "string" ? flag : flag.finding || flag.text || JSON.stringify(flag)}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Recommended Actions */}
      {data.recommended_actions && data.recommended_actions.length > 0 && (
        <Section title="Recommended Actions" delay={0.3}>
          <div className="space-y-2">
            {data.recommended_actions.map((item: any, i: number) => (
              <div key={i} className="border border-border rounded-lg px-4 py-3 bg-card flex items-start gap-3">
                <span className="text-xs font-mono text-muted-foreground mt-0.5 shrink-0">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.priority && <Badge className={`${priorityColor(item.priority)} text-[10px]`}>{item.priority}</Badge>}
                  </div>
                  <p className="text-sm text-foreground">{typeof item === "string" ? item : item.action || item.text || JSON.stringify(item)}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Executive Summary */}
      {data.executive_summary && (
        <Section title="Executive Summary" delay={0.35}>
          <div className="border border-border rounded-xl p-5 bg-card">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{data.executive_summary}</p>
          </div>
        </Section>
      )}

      {/* Reset */}
      <div className="pt-4">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Run new analysis
        </button>
      </div>
    </div>
  );
}

// ── Main Export ──

export function QoEDashboard() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto text-center py-16">
        <XCircle className="w-8 h-8 text-destructive mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-2">Analysis Failed</p>
        <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted rounded-lg p-3 text-left">{error}</p>
        <button
          onClick={() => { setError(null); setResult(null); }}
          className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </button>
      </motion.div>
    );
  }

  if (result) {
    return <QoEResults data={result} onReset={() => setResult(null)} />;
  }

  return <QoEUploadForm onResult={setResult} onError={setError} />;
}
