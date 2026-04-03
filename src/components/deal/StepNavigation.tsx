import { cn } from "@/lib/utils";

const steps = [
  { label: "CIM Analysis" },
  { label: "Financials" },
  { label: "LOI Builder" },
  { label: "Diligence" },
  { label: "Close" },
];

interface StepNavigationProps {
  activeStep: number;
  onStepChange: (step: number) => void;
  hasResults: boolean;
}

export function StepNavigation({ activeStep, onStepChange, hasResults }: StepNavigationProps) {
  return (
    <nav className="border-b border-border">
      <div className="flex gap-0 overflow-x-auto -mb-px">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => onStepChange(i)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
              activeStep === i
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {step.label}
            {/* Active indicator */}
            {activeStep === i && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-foreground rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
