import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockDeals } from "@/data/mockDeals";
import { Deal } from "@/types/deal";
import { StepNavigation } from "@/components/deal/StepNavigation";
import { CIMAnalysis } from "@/components/deal/CIMAnalysis";
import { FinancialScreenPreview } from "@/components/deal/FinancialScreenPreview";
import { LOIBuilderPreview } from "@/components/deal/LOIBuilderPreview";
import { DiligencePreview } from "@/components/deal/DiligencePreview";
import { CloseReviewPreview } from "@/components/deal/CloseReviewPreview";
import { ArrowRight, ArrowLeft, Upload } from "lucide-react";
import { motion } from "framer-motion";

const stepLabels = ["CIM Analysis", "Financials", "LOI Builder", "Diligence", "Close"];

function NewDealForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) return;
    // In a real app this would create a deal and redirect
    navigate("/deal/1");
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-lg mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-lg font-semibold text-foreground mb-1">New Deal</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Enter basic details and upload a CIM to get an AI analysis.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Business Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Midwest IT Services"
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Industry</label>
                <input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Managed IT Services"
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. IL"
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>

            {/* CIM Upload */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">CIM Document</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging ? "border-primary bg-surface-1" : "border-border hover:border-muted-foreground hover:bg-surface-1"
                }`}
              >
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-foreground mb-0.5">Drop your CIM here</p>
                <p className="text-xs text-muted-foreground">PDF, up to 50MB</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Create Deal & Analyze
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const DealPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  if (id === "new") {
    return <NewDealForm />;
  }

  const deal: Deal | undefined = mockDeals.find((d) => d.id === id);

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
