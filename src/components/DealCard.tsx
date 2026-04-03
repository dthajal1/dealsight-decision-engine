import { Deal, Verdict } from "@/types/deal";
import { formatCurrency } from "@/data/mockDeals";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle, Loader2 } from "lucide-react";

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

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => navigate(`/deal/${deal.id}`)}
      className="w-full text-left p-5 rounded-xl border bg-card hover:shadow-md hover:border-border/80 transition-all duration-200 group cursor-pointer flex flex-col gap-3"
    >
      {/* Top row: name + status */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{deal.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {deal.industry ? `${deal.industry} · ${deal.location}` : deal.location}
          </p>
        </div>
      </div>

      {/* Verdict or status indicator */}
      <div className="flex items-center justify-between mt-auto">
        {deal.verdict ? (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${verdictConfig[deal.verdict].className}`}
          >
            {verdictConfig[deal.verdict].icon}
            {verdictConfig[deal.verdict].label}
          </span>
        ) : isAnalyzing ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Analyzing…
          </span>
        ) : isPending ? (
          <span className="text-xs text-muted-foreground">Awaiting CIM</span>
        ) : null}

        {deal.valuationLow && deal.valuationHigh && (
          <span className="text-xs text-muted-foreground">
            {formatCurrency(deal.valuationLow)} – {formatCurrency(deal.valuationHigh)}
          </span>
        )}
      </div>
    </motion.button>
  );
}
