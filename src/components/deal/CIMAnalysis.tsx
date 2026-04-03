import { useState, useEffect, useRef } from "react";
import { Deal, ChatMessage } from "@/types/deal";
import { formatCurrency } from "@/data/mockDeals";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Send,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

// Upload Zone
function UploadZone({ onUpload }: { onUpload: () => void }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24"
    >
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); onUpload(); }}
        onClick={onUpload}
        className={`w-full max-w-md border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging ? "border-primary bg-surface-1 scale-[1.02]" : "border-border hover:border-muted-foreground hover:bg-surface-1"
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm font-medium text-foreground mb-1">Upload CIM document</p>
        <p className="text-xs text-muted-foreground">Drag & drop a PDF or click to browse</p>
      </div>
      <p className="text-xs text-muted-foreground mt-4">Any broker format, any length — analyzed in under 60 seconds</p>
    </motion.div>
  );
}

// Analysis Progress
const analysisSteps = [
  "Extracting financials",
  "Detecting risks",
  "Calculating valuation",
  "Generating report",
];

function AnalysisProgress({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev >= analysisSteps.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <p className="text-sm font-medium text-foreground">Analyzing CIM...</p>
        </div>
        <div className="space-y-3">
          {analysisSteps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex items-center gap-3"
            >
              {i < current ? (
                <CheckCircle2 className="w-4 h-4 text-verdict-positive shrink-0" />
              ) : i === current ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-border shrink-0" />
              )}
              <span className={`text-sm ${i <= current ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Verdict Badge
function VerdictBadge({ verdict }: { verdict: "strong" | "caution" | "pass" }) {
  const config = {
    strong: { icon: <CheckCircle2 className="w-6 h-6" />, label: "Proceed — Strong Opportunity", bg: "bg-verdict-positive-bg", text: "text-verdict-positive" },
    caution: { icon: <AlertTriangle className="w-6 h-6" />, label: "Proceed with Caution", bg: "bg-verdict-caution-bg", text: "text-verdict-caution" },
    pass: { icon: <XCircle className="w-6 h-6" />, label: "Pass — Too Many Risks", bg: "bg-verdict-negative-bg", text: "text-verdict-negative" },
  };
  const c = config[verdict];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${c.bg} ${c.text} rounded-xl p-6 flex items-center gap-4`}
    >
      {c.icon}
      <span className="text-lg font-semibold">{c.label}</span>
    </motion.div>
  );
}

// Chat Panel
function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Should I buy this?",
    "What is the biggest risk?",
    "What should I verify next?",
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responses: Record<string, string> = {
        "Should I buy this?":
          "Based on the analysis, this deal has strong fundamentals — 80% recurring revenue and 90%+ retention. However, the undisclosed owner compensation is a significant gap. I'd recommend requesting W-2/K-1 data before making an offer. If owner comp is under $200K, the adjusted EBITDA would support the asking range.",
        "What is the biggest risk?":
          "The biggest risk is **undisclosed owner compensation**. Without knowing how much the owner draws, the true earnings could be significantly different from reported net income of $828K. This directly impacts valuation — every $100K in hidden comp reduces enterprise value by $300K-$500K at typical multiples.",
        "What should I verify next?":
          "Priority verification list:\n1. **Owner W-2/K-1** — critical for true earnings\n2. **Top client contracts** — verify 80% recurring claim\n3. **Cash-to-accrual restatement** — could swing income ±15%\n4. **Related party lease** — $36K/yr, need market comp\n5. **Employee contracts** — any non-competes?",
      };
      const reply = responses[text] || "Based on the CIM analysis, this deal shows a solid recurring revenue base but requires careful diligence on owner compensation and accounting method. I'd recommend proceeding to the financial screen step to validate these numbers against actual tax returns.";
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="border rounded-xl bg-card flex flex-col h-[500px]">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Ask about this deal</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">Suggested questions</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="w-full text-left text-sm px-3 py-2 rounded-lg border hover:bg-surface-1 transition-colors text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] text-sm rounded-lg px-3 py-2 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-1 text-foreground"
              }`}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface-1 text-muted-foreground text-sm rounded-lg px-3 py-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
        className="p-3 border-t flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this deal..."
          className="flex-1 text-sm px-3 py-2 rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

// Main CIM Analysis Component
export function CIMAnalysis({ deal }: { deal: Deal }) {
  const hasResults = deal.status === "reviewed" && deal.verdict;
  const [phase, setPhase] = useState<"upload" | "analyzing" | "results">(
    hasResults ? "results" : "upload"
  );

  const handleUpload = useCallback(() => setPhase("analyzing"), []);
  const handleComplete = useCallback(() => setPhase("results"), []);

  if (phase === "upload") return <UploadZone onUpload={handleUpload} />;
  if (phase === "analyzing") return <AnalysisProgress onComplete={handleComplete} />;

  // Results
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Verdict */}
        {deal.verdict && <VerdictBadge verdict={deal.verdict} />}

        {/* Key Metrics */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4">
          {[
            { label: "Revenue", value: deal.revenue ? formatCurrency(deal.revenue) : "—" },
            { label: "Net Income", value: deal.netIncome ? formatCurrency(deal.netIncome) : "—" },
            { label: "Recurring Revenue", value: deal.recurringRevenuePct ? `${deal.recurringRevenuePct}%` : "—" },
          ].map((m) => (
            <div key={m.label} className="border rounded-lg p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
              <p className="text-xl font-semibold text-foreground">{m.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Risks */}
        {deal.risks && deal.risks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="text-sm font-semibold text-foreground mb-3">Risk Flags</h3>
            <div className="space-y-2">
              {deal.risks.map((risk, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg border bg-card">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                      risk.severity === "high"
                        ? "bg-verdict-negative-bg text-verdict-negative"
                        : "bg-verdict-caution-bg text-verdict-caution"
                    }`}
                  >
                    {risk.severity.toUpperCase()}
                  </span>
                  <span className="text-sm text-foreground">{risk.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Valuation Range */}
        {deal.valuationLow && deal.valuationHigh && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="text-sm font-semibold text-foreground mb-3">Valuation Range</h3>
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">Conservative</span>
                <span className="text-xs text-muted-foreground">Aggressive</span>
              </div>
              <div className="relative h-2 bg-surface-2 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-[15%] right-[15%] bg-primary/20 rounded-full" />
                <div className="absolute inset-y-0 left-[40%] right-[40%] bg-primary/40 rounded-full" />
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <p className="text-xs text-muted-foreground">Low</p>
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(deal.valuationLow)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Base</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(Math.round((deal.valuationLow + deal.valuationHigh) / 2))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">High</p>
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(deal.valuationHigh)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary */}
        {deal.summary && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h3 className="text-sm font-semibold text-foreground mb-3">Business Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed border rounded-lg p-4 bg-card">{deal.summary}</p>
          </motion.div>
        )}

        {/* Next Steps */}
        {deal.nextSteps && deal.nextSteps.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h3 className="text-sm font-semibold text-foreground mb-3">DD Checklist</h3>
            <div className="border rounded-lg p-4 bg-card space-y-2">
              {deal.nextSteps.map((step, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" className="mt-1 rounded border-border" />
                  <span className="text-sm text-foreground group-hover:text-muted-foreground transition-colors">{step}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Panel */}
      <div className="lg:col-span-1">
        <ChatPanel />
      </div>
    </div>
  );
}

// Need useCallback import
import { useCallback } from "react";
