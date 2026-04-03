import { useState } from "react";
import { mockDeals } from "@/data/mockDeals";
import { PipelineColumn } from "@/components/PipelineColumn";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DealStatus } from "@/types/deal";

const Index = () => {
  const [deals] = useState(mockDeals);
  const navigate = useNavigate();

  const grouped = {
    new: deals.filter((d) => d.status === "new"),
    analyzing: deals.filter((d) => d.status === "analyzing"),
    reviewed: deals.filter((d) => d.status === "reviewed"),
  };

  const isEmpty = deals.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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

      <main className="max-w-6xl mx-auto px-6 py-8">
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
          <div className="flex gap-6 overflow-x-auto pb-4">
            {(["new", "analyzing", "reviewed"] as DealStatus[]).map((status) => (
              <PipelineColumn key={status} status={status} deals={grouped[status]} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
