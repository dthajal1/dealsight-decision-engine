import { useState } from "react";
import { mockDeals } from "@/data/mockDeals";
import { DealCard } from "@/components/DealCard";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [deals] = useState(mockDeals);
  const navigate = useNavigate();

  const isEmpty = deals.length === 0;

  const totalDeals = deals.length;
  const strongCount = deals.filter((d) => d.verdict === "strong").length;
  const cautionCount = deals.filter((d) => d.verdict === "caution").length;
  const passCount = deals.filter((d) => d.verdict === "pass").length;
  const analyzingCount = deals.filter((d) => d.status === "analyzing").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Page title + action */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Deals</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalDeals} deal{totalDeals !== 1 ? "s" : ""} in pipeline
            </p>
          </div>
          <button
            onClick={() => navigate("/deal/new")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Deal
          </button>
        </div>

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-1 flex items-center justify-center mb-6">
              <Plus className="w-7 h-7 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">No deals yet</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Upload a CIM to get an AI-powered pre-screen verdict in under 60 seconds.
            </p>
            <button
              onClick={() => navigate("/deal/new")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Create your first deal
            </button>
          </motion.div>
        ) : (
          <>
            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-5 mb-6 text-xs"
            >
              {strongCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-verdict-positive" />
                  <span className="text-muted-foreground">{strongCount} Strong</span>
                </div>
              )}
              {cautionCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-verdict-caution" />
                  <span className="text-muted-foreground">{cautionCount} Caution</span>
                </div>
              )}
              {passCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-verdict-negative" />
                  <span className="text-muted-foreground">{passCount} Pass</span>
                </div>
              )}
              {analyzingCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                  <span className="text-muted-foreground">{analyzingCount} Analyzing</span>
                </div>
              )}
            </motion.div>

            {/* Deal List */}
            <div className="rounded-xl border bg-card overflow-hidden">
              {deals.map((deal, i) => (
                <DealCard key={deal.id} deal={deal} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
