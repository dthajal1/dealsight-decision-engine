import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/types/deal";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, X, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

const suggestions = [
  "Should I pursue this deal?",
  "What is the biggest risk?",
  "What should I verify first?",
  "How does valuation compare to market?",
];

const responses: Record<string, string> = {
  "Should I pursue this deal?":
    "Based on the analysis, this deal has strong fundamentals — 80% recurring revenue and 90%+ retention. However, the undisclosed owner compensation is a significant gap. I'd recommend requesting W-2/K-1 data before making an offer. If owner comp is under $200K, the adjusted EBITDA would support the asking range.",
  "What is the biggest risk?":
    "The biggest risk is **undisclosed owner compensation**. Without knowing how much the owner draws, the true earnings could be significantly different from reported net income of $828K. This directly impacts valuation — every $100K in hidden comp reduces enterprise value by $300K–$500K at typical multiples.",
  "What should I verify first?":
    "Priority verification list:\n1. **Owner W-2/K-1** — critical for true earnings\n2. **Top client contracts** — verify 80% recurring claim\n3. **Cash-to-accrual restatement** — could swing income ±15%\n4. **Related party lease** — $36K/yr, need market comp\n5. **Employee contracts** — any non-competes?",
  "How does valuation compare to market?":
    "At **3.0–5.0× EBITDA**, this is in-line with market for managed IT services businesses with 80%+ recurring revenue. Comparable transactions in 2023–2024 closed at 3.5–4.5× for businesses with similar revenue and margin profiles. The upper end of the range is justified only if recurring revenue and retention claims hold up under diligence.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply =
        responses[text] ||
        "Based on the CIM analysis, this deal shows a solid recurring revenue base but requires careful diligence on owner compensation and accounting method. I'd recommend proceeding to verify financials against actual tax returns before making an offer.";
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: reply },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b flex items-center justify-between bg-card">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">DealSight AI</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-surface-1 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-3">Ask about this deal</p>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-border hover:bg-surface-1 transition-colors text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] text-sm rounded-xl px-3 py-2 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-1 text-foreground"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none [&_p]:m-0 [&_ol]:my-1 [&_li]:my-0">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface-1 text-muted-foreground text-sm rounded-xl px-3 py-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t flex gap-2 bg-card"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 text-sm px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
