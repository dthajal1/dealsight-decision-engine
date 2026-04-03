import { motion } from "framer-motion";
import { Deal } from "@/types/deal";
import { AlertTriangle, CheckCircle2, Circle, FileText, Users, DollarSign, Scale, ShieldCheck } from "lucide-react";

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

function ChecklistItem({ text, done, note }: { text: string; done: boolean; note?: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group py-2">
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-verdict-positive shrink-0 mt-0.5" />
      ) : (
        <Circle className="w-4 h-4 text-border shrink-0 mt-0.5 group-hover:text-muted-foreground transition-colors" />
      )}
      <div className="flex-1">
        <span className={`text-sm ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>{text}</span>
        {note && <p className="text-[11px] text-muted-foreground mt-0.5">{note}</p>}
      </div>
    </label>
  );
}

export function DiligencePreview({ deal }: { deal: Deal }) {
  const risks = deal.risks || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Risk Summary */}
      {risks.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Top Risks ({risks.length})
          </h3>
          <div className="space-y-2">
            {risks.map((risk, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border bg-card">
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${risk.severity === "high" ? "text-verdict-negative" : "text-verdict-caution"}`} />
                <div className="flex-1">
                  <span className="text-sm text-foreground">{risk.label}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  risk.severity === "high" ? "bg-verdict-negative text-verdict-negative" : "bg-verdict-caution text-verdict-caution"
                }`}>
                  {risk.severity.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Diligence */}
      <Section title="Financial Diligence" icon={DollarSign}>
        <div className="border border-border rounded-xl p-4 bg-card divide-y divide-border">
          <ChecklistItem done={true} text="Tax returns — 3 years (2020–2022)" note="Received and reviewed. Matches CIM within 3%." />
          <ChecklistItem done={false} text="Owner W-2 / K-1 compensation breakdown" note="Critical — required to validate adjusted EBITDA." />
          <ChecklistItem done={false} text="Accrual-basis financial restatement" note="Currently cash-basis. Restatement could shift revenue ±8–12%." />
          <ChecklistItem done={false} text="Accounts receivable aging report" note="Verify collectability and DSO trends." />
          <ChecklistItem done={false} text="Debt schedule and payoff amounts" note="Confirm all liabilities are captured in CIM." />
        </div>
      </Section>

      {/* Customer Diligence */}
      <Section title="Customer & Revenue" icon={Users}>
        <div className="border border-border rounded-xl p-4 bg-card divide-y divide-border">
          <ChecklistItem done={false} text="Top 10 client contracts with terms and renewal dates" note="Verify 80% recurring revenue claim." />
          <ChecklistItem done={false} text="Customer concentration analysis" note="Largest client = 18% of revenue. Need top 20 breakdown." />
          <ChecklistItem done={false} text="MRR schedule with churn data" note="CIM claims 90%+ retention — verify with actual data." />
          <ChecklistItem done={false} text="Pipeline and backlog review" note="Any signed contracts not yet reflected in revenue?" />
        </div>
      </Section>

      {/* Legal */}
      <Section title="Legal & Compliance" icon={Scale}>
        <div className="border border-border rounded-xl p-4 bg-card divide-y divide-border">
          <ChecklistItem done={false} text="Corporate formation and governance docs" />
          <ChecklistItem done={false} text="Employee agreements and non-competes" note="6 employees — verify all have signed agreements." />
          <ChecklistItem done={false} text="Related party transactions review" note="$36K/yr lease — need independent market comp." />
          <ChecklistItem done={false} text="Pending or threatened litigation search" note="Check state and federal court records." />
          <ChecklistItem done={false} text="Licenses, permits, and regulatory compliance" />
        </div>
      </Section>

      {/* Operational */}
      <Section title="Operational" icon={ShieldCheck}>
        <div className="border border-border rounded-xl p-4 bg-card divide-y divide-border">
          <ChecklistItem done={false} text="Technology stack and systems audit" note="Document all tools, licenses, and access credentials." />
          <ChecklistItem done={false} text="Key person dependency assessment" note="Owner handles all sales — transition risk is high." />
          <ChecklistItem done={false} text="Insurance policies review" note="E&O, general liability, cyber — verify coverage adequacy." />
          <ChecklistItem done={false} text="Lease terms and facility condition" note="Current lease expires in 14 months." />
        </div>
      </Section>
    </motion.div>
  );
}
