import { motion } from "framer-motion";
import { Deal } from "@/types/deal";
import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";

export function DiligencePreview({ deal }: { deal: Deal }) {
  const risks = deal.risks || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-base font-semibold text-foreground">Due Diligence</h2>
        <p className="text-xs text-muted-foreground mt-1">Key risks and verification checklist</p>
      </div>

      {/* Top Risks */}
      <div className="border rounded-lg p-5 bg-card">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Top Risks Summary</h3>
        <div className="space-y-3">
          {(risks.length > 0 ? risks.slice(0, 4) : [
            { label: "Owner dependency risk", severity: "high" as const },
            { label: "Cash basis accounting", severity: "high" as const },
            { label: "Revenue concentration", severity: "medium" as const },
          ]).map((risk, i) => (
            <div key={i} className="flex items-center gap-3">
              <AlertTriangle className={`w-4 h-4 shrink-0 ${risk.severity === "high" ? "text-verdict-negative" : "text-verdict-caution"}`} />
              <span className="text-sm text-foreground">{risk.label}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-auto ${
                risk.severity === "high" ? "bg-verdict-negative-bg text-verdict-negative" : "bg-verdict-caution-bg text-verdict-caution"
              }`}>
                {risk.severity.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="border rounded-lg p-5 bg-card">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Verification Checklist</h3>
        <div className="space-y-2.5">
          {[
            { text: "Tax returns (3 years)", done: true },
            { text: "Owner compensation breakdown", done: false },
            { text: "Customer contracts — top 10", done: false },
            { text: "Employee agreements & non-competes", done: false },
            { text: "Lease agreements & related party transactions", done: false },
            { text: "Insurance policies review", done: false },
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              {item.done ? (
                <CheckCircle2 className="w-4 h-4 text-verdict-positive shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-border shrink-0 group-hover:text-muted-foreground transition-colors" />
              )}
              <span className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{item.text}</span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
