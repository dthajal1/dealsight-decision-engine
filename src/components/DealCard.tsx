import { Deal, Verdict } from "@/types/deal";
import { formatCurrency } from "@/data/mockDeals";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const verdictConfig: Record<Verdict, { icon: React.ReactNode; label: string; className: string }> = {
  strong: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    label: "Strong",
    className: "bg-verdict-positive-bg text-verdict-positive",
  },
  caution: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    label: "Caution",
    className: "bg-verdict-caution-bg text-verdict-caution",
  },
  pass: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: "Pass",
    className: "bg-verdict-negative-bg text-verdict-negative",
  },
};

export function DealCard({ deal, index }: { deal: Deal; index: number }) {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => navigate(`/deal/${deal.id}`)}
      className="w-full text-left p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {deal.name}
            <span className="text-muted-foreground font-normal"> ({deal.location})</span>
          </p>
          {deal.industry && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{deal.industry}</p>
          )}
        </div>
        {deal.status === "analyzing" && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Analyzing</span>
          </div>
        )}
      </div>

      {deal.verdict && (
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${verdictConfig[deal.verdict].className}`}
          >
            {verdictConfig[deal.verdict].icon}
            {verdictConfig[deal.verdict].label}
          </span>
          {deal.valuationLow && deal.valuationHigh && (
            <span className="text-xs text-muted-foreground">
              {formatCurrency(deal.valuationLow)} – {formatCurrency(deal.valuationHigh)}
            </span>
          )}
        </div>
      )}
    </motion.button>
  );
}
