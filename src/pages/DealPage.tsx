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
import { ArrowLeft } from "lucide-react";

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
            Back to pipeline
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate("/")}
              className="p-1.5 rounded-md hover:bg-surface-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-foreground">{deal.name}</h1>
              {deal.industry && (
                <p className="text-xs text-muted-foreground">{deal.industry} · {deal.location}</p>
              )}
            </div>
          </div>
          <StepNavigation activeStep={activeStep} onStepChange={setActiveStep} hasResults={deal.status === "reviewed"} />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-6">{stepContent[activeStep]}</main>
    </div>
  );
};

export default DealPage;
