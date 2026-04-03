import { Deal, Verdict } from "@/types/deal";
import { formatCurrency } from "@/data/mockDeals";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, Loader2, AlertCircle, ChevronRight } from "lucide-react";

const verdictConfig: Record<Verdict, { icon: React.ReactNode; label: string; className: string }> = {
  strong: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    label: "Strong",
    className: "bg-verdict-positive text-verdict-positive",
  },
  caution: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: "Caution",
    className: "bg-verdict-caution text-verdict-caution",
  },
  pass: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: "Pass",
    className: "bg-verdict-negative text-verdict-negative",
  },
};

export function DealCard({ deal, index }: { deal: Deal; index: number }) {
  const navigate = useNavigate();

  const isAnalyzing = deal.status === "analyzing";
  const isPending = deal.status === "new" && !deal.verdict;
  const riskCount = deal.risks?.length ?? 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      onClick={() => navigate(`/deal/${deal.id}`)}
      className="w-full text-left px-5 py-4 border-b border-border hover:bg-surface-1 transition-colors group cursor-pointer flex items-center gap-4"
    >
      {/* Verdict indicator dot */}
      <div className="shrink-0">
        {deal.verdict ? (
          <span
            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${verdictConfig[deal.verdict].className}`}
          >
            {verdictConfig[deal.verdict].icon}
          </span>
        ) : isAnalyzing ? (
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-surface-1">
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          </span>
        ) : (
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-surface-1 border border-dashed border-border">
            <span className="w-2 h-2 rounded-full bg-border" />
          </span>
        )}
      </div>

      {/* Deal info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm text-foreground truncate">{deal.name}</p>
          <span className="text-xs text-muted-foreground shrink-0">{deal.location}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {deal.industry}
          {isAnalyzing && " · Analyzing…"}
          {isPending && " · Awaiting CIM"}
        </p>
      </div>

      {/* Metrics */}
      <div className="hidden sm:flex items-center gap-6 shrink-0">
        {deal.revenue ? (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-sm font-medium text-foreground">{formatCurrency(deal.revenue)}</p>
          </div>
        ) : (
          <div className="w-20" />
        )}

        {deal.valuationLow && deal.valuationHigh ? (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Valuation</p>
            <p className="text-sm font-medium text-foreground">
              {formatCurrency(deal.valuationLow)} – {formatCurrency(deal.valuationHigh)}
            </p>
          </div>
        ) : (
          <div className="w-28" />
        )}

        {riskCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{riskCount} flag{riskCount !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0" />
    </motion.button>
  );
}
