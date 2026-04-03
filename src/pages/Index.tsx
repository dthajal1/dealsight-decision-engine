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
  const pendingCount = deals.filter((d) => d.status === "new").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">DealSight</h1>
            <p className="text-xs text-muted-foreground">AI-powered deal analysis</p>
          </div>
          <button
            onClick={() => navigate("/deal/new")}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Deal
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
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
            {/* Summary Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-6 mb-8 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Deals</span>
                <span className="font-semibold text-foreground">{totalDeals}</span>
              </div>
              <div className="w-px h-4 bg-border" />
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
              {pendingCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-border" />
                  <span className="text-muted-foreground">{pendingCount} Pending</span>
                </div>
              )}
            </motion.div>

            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map((deal, i) => (
                <DealCard key={deal.id} deal={deal} index={i} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
