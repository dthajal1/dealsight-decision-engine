import { motion } from "framer-motion";
import { AlertTriangle, FileText } from "lucide-react";

export function CloseReviewPreview() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-base font-semibold text-foreground">Close Review</h2>
        <p className="text-xs text-muted-foreground mt-1">Agreement clause flags and transition plan</p>
      </div>

      {/* Key Clause Flags */}
      <div className="border rounded-lg p-5 bg-card">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Key Clause Flags</h3>
        <div className="space-y-3">
          {[
            { clause: "Non-compete scope", issue: "5-year term exceeds industry standard (2-3 years)", severity: "high" },
            { clause: "Working capital peg", issue: "Peg methodology not specified — default favors seller", severity: "high" },
            { clause: "Earnout structure", issue: "Revenue target lacks customer churn adjustment", severity: "medium" },
            { clause: "Reps & warranties", issue: "Standard scope — no unusual exclusions", severity: "low" },
          ].map((flag, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                flag.severity === "high" ? "text-verdict-negative" : flag.severity === "medium" ? "text-verdict-caution" : "text-verdict-positive"
              }`} />
              <div>
                <p className="text-sm font-medium text-foreground">{flag.clause}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{flag.issue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transition Plan */}
      <div className="border rounded-lg p-5 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transition Plan Snippet</h3>
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            <span className="font-medium text-foreground">Phase 1 (Days 1-30):</span> Owner introduction to all key accounts. Transfer of vendor relationships and access credentials. Employee communication plan execution.
          </p>
          <p>
            <span className="font-medium text-foreground">Phase 2 (Days 31-90):</span> Owner transitions to advisory role. New owner assumes primary client relationships. Knowledge transfer documentation completed.
          </p>
          <p>
            <span className="font-medium text-foreground">Phase 3 (Days 91-180):</span> Owner available for consultation as needed. All systems and processes fully transitioned.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
