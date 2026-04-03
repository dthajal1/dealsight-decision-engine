import { mockDeals, formatCurrency } from "@/data/mockDeals";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, AlertCircle, BarChart3 } from "lucide-react";

const Index = () => {
  const deals = mockDeals;

  const totalDeals = deals.length;
  const reviewedDeals = deals.filter((d) => d.status === "reviewed");
  const strongCount = deals.filter((d) => d.verdict === "strong").length;
  const cautionCount = deals.filter((d) => d.verdict === "caution").length;
  const passCount = deals.filter((d) => d.verdict === "pass").length;
  const analyzingCount = deals.filter((d) => d.status === "analyzing").length;

  const totalRevenue = deals.reduce((sum, d) => sum + (d.revenue ?? 0), 0);
  const avgRevenue = totalRevenue / deals.filter((d) => d.revenue).length || 0;

  const totalValuationLow = reviewedDeals.reduce((sum, d) => sum + (d.valuationLow ?? 0), 0);
  const totalValuationHigh = reviewedDeals.reduce((sum, d) => sum + (d.valuationHigh ?? 0), 0);

  const totalRisks = deals.reduce((sum, d) => sum + (d.risks?.length ?? 0), 0);
  const highRisks = deals.reduce(
    (sum, d) => sum + (d.risks?.filter((r) => r.severity === "high").length ?? 0),
    0
  );

  const statCards = [
    {
      label: "Total Deals",
      value: totalDeals.toString(),
      sub: `${reviewedDeals.length} reviewed · ${analyzingCount} analyzing`,
      icon: BarChart3,
    },
    {
      label: "Avg Revenue",
      value: formatCurrency(avgRevenue),
      sub: `${formatCurrency(totalRevenue)} total across ${deals.filter((d) => d.revenue).length} deals`,
      icon: TrendingUp,
    },
    {
      label: "Valuation Range",
      value: totalValuationLow > 0 ? `${formatCurrency(totalValuationLow)} – ${formatCurrency(totalValuationHigh)}` : "—",
      sub: `Across ${reviewedDeals.length} reviewed deal${reviewedDeals.length !== 1 ? "s" : ""}`,
      icon: DollarSign,
    },
    {
      label: "Risk Flags",
      value: totalRisks.toString(),
      sub: `${highRisks} high severity`,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-lg font-semibold text-foreground">Portfolio Overview</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            High-level view across all deals in your pipeline
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <stat.icon className="w-4 h-4 text-muted-foreground/50" />
              </div>
              <p className="text-xl font-semibold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Verdict Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <p className="text-xs font-medium text-muted-foreground mb-4">Verdict Breakdown</p>
          <div className="flex items-end gap-6">
            {[
              { label: "Strong", count: strongCount, color: "bg-verdict-positive", textColor: "text-verdict-positive" },
              { label: "Caution", count: cautionCount, color: "bg-verdict-caution", textColor: "text-verdict-caution" },
              { label: "Pass", count: passCount, color: "bg-verdict-negative", textColor: "text-verdict-negative" },
              { label: "Pending", count: totalDeals - strongCount - cautionCount - passCount, color: "bg-border", textColor: "text-muted-foreground" },
            ].map((v) => (
              <div key={v.label} className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${v.color}`} />
                  <span className="text-xs text-muted-foreground">{v.label}</span>
                </div>
                <p className={`text-2xl font-semibold ${v.textColor}`}>{v.count}</p>
              </div>
            ))}
          </div>

          {/* Simple bar */}
          {totalDeals > 0 && (
            <div className="flex h-2 rounded-full overflow-hidden mt-4 bg-surface-1">
              {strongCount > 0 && (
                <div className="bg-verdict-positive" style={{ width: `${(strongCount / totalDeals) * 100}%` }} />
              )}
              {cautionCount > 0 && (
                <div className="bg-verdict-caution" style={{ width: `${(cautionCount / totalDeals) * 100}%` }} />
              )}
              {passCount > 0 && (
                <div className="bg-verdict-negative" style={{ width: `${(passCount / totalDeals) * 100}%` }} />
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
