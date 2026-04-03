import { motion } from "framer-motion";

// Generic results renderer for steps 2-5 that display raw JSON response
// in a structured way. Each step's webhook returns different shapes,
// so this renders whatever comes back in a readable format.

interface GenericStepResultsProps {
  data: any;
  title?: string;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  );
}

function renderValue(value: any): React.ReactNode {
  if (value === null || value === undefined) return <span className="text-muted-foreground">—</span>;
  if (typeof value === "string") return <span className="text-foreground">{value}</span>;
  if (typeof value === "number") return <span className="text-foreground font-medium">{value}</span>;
  if (typeof value === "boolean") return <span className="text-foreground">{value ? "Yes" : "No"}</span>;
  if (Array.isArray(value)) {
    return (
      <div className="space-y-1.5">
        {value.map((item, i) => (
          <div key={i} className="text-sm">
            {typeof item === "object" ? <ObjectCard data={item} /> : <span className="text-foreground">{String(item)}</span>}
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === "object") return <ObjectCard data={value} />;
  return <span>{String(value)}</span>;
}

function ObjectCard({ data }: { data: Record<string, any> }) {
  return (
    <div className="border border-border rounded-lg p-3 bg-card space-y-2">
      {Object.entries(data).map(([key, val]) => (
        <div key={key}>
          <p className="text-[11px] text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
          <div className="text-sm">{renderValue(val)}</div>
        </div>
      ))}
    </div>
  );
}

export function GenericStepResults({ data, title }: GenericStepResultsProps) {
  if (!data) return null;

  // If it's a simple string or number, just show it
  if (typeof data !== "object") {
    return <p className="text-sm text-foreground">{String(data)}</p>;
  }

  const entries = Object.entries(data).filter(([key]) => key !== "meta" && key !== "status");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {title && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-foreground">{title}</p>
        </div>
      )}
      {entries.map(([key, value], i) => (
        <Section key={key} title={key.replace(/_/g, " ")}>
          <div className="text-sm">{renderValue(value)}</div>
        </Section>
      ))}
    </motion.div>
  );
}
