import { cn } from "@/lib/utils";

const steps = [
  { label: "CIM Analysis", tag: "Live" },
  { label: "Financial Screen", tag: "Preview" },
  { label: "LOI Builder", tag: "Preview" },
  { label: "Diligence", tag: "Preview" },
  { label: "Close Review", tag: "Preview" },
];

interface StepNavigationProps {
  activeStep: number;
  onStepChange: (step: number) => void;
  hasResults: boolean;
}

export function StepNavigation({ activeStep, onStepChange, hasResults }: StepNavigationProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto">
      {steps.map((step, i) => (
        <button
          key={i}
          onClick={() => onStepChange(i)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors",
            activeStep === i
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-1"
          )}
        >
          {step.label}
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full",
              activeStep === i
                ? "bg-primary-foreground/20 text-primary-foreground"
                : i === 0 && hasResults
                  ? "bg-verdict-positive-bg text-verdict-positive"
                  : "bg-surface-2 text-muted-foreground"
            )}
          >
            {i === 0 && hasResults ? "Done" : step.tag}
          </span>
        </button>
      ))}
    </nav>
  );
}
