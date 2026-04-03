import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockDeals } from "@/data/mockDeals";
import { Deal } from "@/types/deal";
import { StepNavigation } from "@/components/deal/StepNavigation";
import { CIMAnalysis } from "@/components/deal/CIMAnalysis";
import { FinancialScreenPreview } from "@/components/deal/FinancialScreenPreview";
import { LOIBuilderPreview } from "@/components/deal/LOIBuilderPreview";
import { DiligencePreview } from "@/components/deal/DiligencePreview";
import { CloseReviewPreview } from "@/components/deal/CloseReviewPreview";
import { ArrowRight, ArrowLeft } from "lucide-react";

const stepLabels = ["CIM Analysis", "Financials", "LOI Builder", "Diligence", "Close"];

const DealPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const isNew = id === "new";
  const deal: Deal | undefined = isNew
    ? { id: "new", name: "New Deal", location: "", status: "new", industry: "" }
    : mockDeals.find((d) => d.id === id);

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Deal not found</p>
          <button onClick={() => navigate("/")} className="text-sm text-primary underline">
            Back to overview
          </button>
        </div>
      </div>
    );
  }

  const stepContent = [
    <CIMAnalysis key="cim" deal={deal} />,
    <FinancialScreenPreview key="fin" />,
    <LOIBuilderPreview key="loi" deal={deal} />,
    <DiligencePreview key="dd" deal={deal} />,
    <CloseReviewPreview key="close" />,
  ];

  const isFirst = activeStep === 0;
  const isLast = activeStep === stepLabels.length - 1;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="mb-4">
          <h1 className="text-base font-semibold text-foreground">{deal.name}</h1>
          {deal.industry && (
            <p className="text-xs text-muted-foreground">{deal.industry} · {deal.location}</p>
          )}
        </div>
        <div className="mb-6">
          <StepNavigation activeStep={activeStep} onStepChange={setActiveStep} hasResults={deal.status === "reviewed"} />
        </div>
        {stepContent[activeStep]}

        {/* Step navigation footer */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          {!isFirst ? (
            <button
              onClick={() => setActiveStep(activeStep - 1)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {stepLabels[activeStep - 1]}
            </button>
          ) : (
            <div />
          )}
          {!isLast && (
            <button
              onClick={() => setActiveStep(activeStep + 1)}
              className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Continue to {stepLabels[activeStep + 1]}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealPage;
