import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export function FinancialScreenPreview() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-base font-semibold text-foreground">Financial Screen</h2>
        <p className="text-xs text-muted-foreground mt-1">Upload financials to reconcile against CIM claims</p>
      </div>

      {/* Adjusted Earnings Preview */}
      <div className="border rounded-lg p-5 bg-card">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Adjusted Earnings Preview</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reported Net Income</span>
            <span className="font-medium text-foreground">$828,627</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">+ Owner compensation addback</span>
            <span className="font-medium text-verdict-positive">+$145,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">+ Related party lease adjustment</span>
            <span className="font-medium text-verdict-positive">+$12,000</span>
          </div>
          <div className="border-t pt-3 flex justify-between text-sm">
            <span className="font-semibold text-foreground">Estimated Adjusted EBITDA</span>
            <span className="font-semibold text-foreground">$985,627</span>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="space-y-2">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-verdict-caution-bg">
          <AlertTriangle className="w-4 h-4 text-verdict-caution shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-verdict-caution">Cash-to-accrual restatement needed</p>
            <p className="text-xs text-muted-foreground mt-0.5">Revenue timing could shift ±8-12% after conversion</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-lg bg-verdict-caution-bg">
          <AlertTriangle className="w-4 h-4 text-verdict-caution shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-verdict-caution">Owner draw not separated from salary</p>
            <p className="text-xs text-muted-foreground mt-0.5">Need W-2 to confirm market-rate compensation</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-lg bg-verdict-positive-bg">
          <CheckCircle2 className="w-4 h-4 text-verdict-positive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-verdict-positive">Revenue trend consistent with CIM</p>
            <p className="text-xs text-muted-foreground mt-0.5">YoY decline of -2.3% matches stated figures</p>
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className="bg-verdict-caution-bg rounded-xl p-5 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Screening Result</p>
        <p className="text-lg font-semibold text-verdict-caution">Conditional Pass</p>
        <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">
          Financial screen requires owner compensation verification and accrual restatement before proceeding to LOI.
        </p>
      </div>
    </motion.div>
  );
}
