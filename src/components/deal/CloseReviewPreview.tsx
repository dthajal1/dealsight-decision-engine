import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, FileText, Clock, Shield } from "lucide-react";

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function CloseReviewPreview() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Agreement Clause Flags */}
      <Section title="Purchase Agreement — Key Clause Review" icon={Shield}>
        <div className="space-y-2">
          {[
            { clause: "Non-Compete Scope", issue: "5-year term exceeds industry standard of 2–3 years. Recommend negotiating to 3 years.", severity: "high" },
            { clause: "Working Capital Peg", issue: "Peg methodology not specified — default calculation favors seller. Define NWC components explicitly.", severity: "high" },
            { clause: "Earnout Structure", issue: "Revenue target lacks customer churn adjustment. Add retention-based trigger.", severity: "medium" },
            { clause: "Indemnification Cap", issue: "Capped at 15% of purchase price — below 20% market standard. Negotiate up.", severity: "medium" },
            { clause: "Reps & Warranties", issue: "Standard scope and survival period (18 months). No unusual exclusions.", severity: "low" },
            { clause: "Basket / Deductible", issue: "Mini-basket at 0.5% of purchase price — within normal range.", severity: "low" },
          ].map((flag, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
              {flag.severity === "high" ? (
                <AlertTriangle className="w-4 h-4 text-verdict-negative shrink-0 mt-0.5" />
              ) : flag.severity === "medium" ? (
                <AlertTriangle className="w-4 h-4 text-verdict-caution shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-verdict-positive shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{flag.clause}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{flag.issue}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                flag.severity === "high" ? "bg-verdict-negative text-verdict-negative"
                : flag.severity === "medium" ? "bg-verdict-caution text-verdict-caution"
                : "bg-verdict-positive text-verdict-positive"
              }`}>
                {flag.severity.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Closing Checklist */}
      <Section title="Closing Checklist" icon={FileText}>
        <div className="border border-border rounded-xl bg-card overflow-hidden divide-y divide-border">
          {[
            { item: "Final purchase agreement execution", status: "pending" },
            { item: "SBA loan commitment letter", status: "pending" },
            { item: "Landlord lease assignment consent", status: "pending" },
            { item: "Escrow deposit funded", status: "pending" },
            { item: "Working capital peg calculation finalized", status: "pending" },
            { item: "Employee communication plan approved", status: "pending" },
            { item: "Insurance policies transferred / new policies bound", status: "pending" },
            { item: "All licenses and permits transferred", status: "pending" },
            { item: "Seller note and security agreement signed", status: "pending" },
            { item: "Funds wired / closing statement executed", status: "pending" },
          ].map((row, i) => (
            <label key={i} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-surface-1 transition-colors">
              <input type="checkbox" className="rounded border-border accent-primary" />
              <span className="text-sm text-foreground">{row.item}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Transition Plan */}
      <Section title="Post-Close Transition Plan" icon={Clock}>
        <div className="border border-border rounded-xl bg-card overflow-hidden divide-y divide-border">
          {[
            {
              phase: "Week 1–2",
              title: "Day-One Readiness",
              tasks: "Owner introduces buyer to all key accounts and vendors. Employee town hall. Transfer banking, credentials, and system access."
            },
            {
              phase: "Week 3–4",
              title: "Knowledge Transfer",
              tasks: "Document all SOPs, pricing logic, and client-specific requirements. Shadow owner on sales calls and client management."
            },
            {
              phase: "Month 2–3",
              title: "Owner Steps Back",
              tasks: "Owner transitions to advisory role (10 hrs/week). Buyer assumes primary client relationships. Weekly check-ins on open items."
            },
            {
              phase: "Month 4–6",
              title: "Full Handoff",
              tasks: "Owner available for consultation as needed. All systems, processes, and relationships fully transitioned. Earnout tracking begins."
            },
          ].map((p, i) => (
            <div key={i} className="px-4 py-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-1 text-muted-foreground">{p.phase}</span>
                <p className="text-sm font-medium text-foreground">{p.title}</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed ml-[52px]">{p.tasks}</p>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}
