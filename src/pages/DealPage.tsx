import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDeal, useCreateDeal, uploadCIM } from "@/hooks/useDeals";
import { StepNavigation } from "@/components/deal/StepNavigation";
import { CIMResultsDashboard } from "@/components/deal/CIMResultsDashboard";
import { GenericStepResults } from "@/components/deal/GenericStepResults";
import { StepUploadZone } from "@/components/deal/StepUploadZone";
import { QoEDashboard } from "@/components/deal/QoEDashboard";
import { DEMO_CIM_RESPONSE } from "@/data/demoData";
import { DEMO_FINANCIALS_RESPONSE, DEMO_LOI_RESPONSE, DEMO_CLOSE_RESPONSE } from "@/data/demoStepData";
import { ArrowRight, ArrowLeft, Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const stepLabels = ["CIM Analysis", "Financials", "LOI Builder", "Diligence", "Close"];

// ── New Deal Form ──

function NewDealForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const createDeal = useCreateDeal();

  const handleFile = (f: File) => {
    if (f.type === "application/pdf" || f.name.endsWith(".pdf")) {
      setFile(f);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      let cimFilePath: string | undefined;
      if (file) {
        cimFilePath = await uploadCIM(file);
      }
      const deal = await createDeal.mutateAsync({ name, industry, location, cimFilePath });
      // Navigate with the file in state so DealView can auto-analyze
      navigate(`/deal/${deal.id}`, { state: { pendingFile: file ? true : false } });
    } catch (e: any) {
      toast.error(e.message || "Failed to create deal");
    }
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
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".pdf";
                  input.onchange = (e) => {
                    const f = (e.target as HTMLInputElement).files?.[0];
                    if (f) handleFile(f);
                  };
                  input.click();
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging ? "border-primary bg-primary/5" : file ? "border-primary/50 bg-primary/5" : "border-border hover:border-muted-foreground hover:bg-muted/30"
                }`}
              >
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                {file ? (
                  <>
                    <p className="text-sm font-medium text-foreground mb-0.5">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-foreground mb-0.5">Drop your CIM here</p>
                    <p className="text-xs text-muted-foreground">PDF, up to 20MB</p>
                  </>
                )}
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
              disabled={!name.trim() || createDeal.isPending}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {createDeal.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  Create Deal & Analyze
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Step State Types ──

interface StepState {
  data: any | null;
  loading: boolean;
  error: string | null;
  file: File | null;
}

const emptyStep = (): StepState => ({ data: null, loading: false, error: null, file: null });

// ── Deal View (existing deal) ──

function DealView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const { data: deal, isLoading } = useDeal(id);

  // Per-step state: [cim, financials/nda, loi, diligence/qoe, close/agreement]
  const [steps, setSteps] = useState<StepState[]>([
    emptyStep(), emptyStep(), emptyStep(), emptyStep(), emptyStep(),
  ]);

  // Shift+D demo mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "D") {
        setSteps((prev) => {
          const next = [...prev];
          next[0] = { data: DEMO_CIM_RESPONSE, loading: false, error: null, file: null };
          return next;
        });
        toast.success("Demo data loaded for Step 1");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const updateStep = useCallback((index: number, patch: Partial<StepState>) => {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  }, []);

  // Retry stores the last file used
  const retryRef = useRef<{ step: number; file: File | null }>({ step: 0, file: null });

  const handleStepUpload = useCallback(async (stepIndex: number, file: File, apiFn: (f: File) => Promise<any>) => {
    retryRef.current = { step: stepIndex, file };
    updateStep(stepIndex, { loading: true, error: null, file });
    try {
      const result = await apiFn(file);
      if (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {
        console.warn("[DealPage] Empty API response — falling back to demo data");
        if (stepIndex === 0) {
          updateStep(stepIndex, { data: DEMO_CIM_RESPONSE, loading: false });
          toast.info("API returned empty response — showing demo data");
          return;
        }
      }
      updateStep(stepIndex, { data: result, loading: false });
    } catch (e: any) {
      if (stepIndex === 0) {
        console.warn("[DealPage] API error — falling back to demo data:", e.message);
        updateStep(stepIndex, { data: DEMO_CIM_RESPONSE, loading: false });
        toast.info("API unavailable — showing demo data");
        return;
      }
      updateStep(stepIndex, { loading: false, error: e.message || "Unknown error" });
    }
  }, [updateStep]);

  const handleRetry = useCallback(() => {
    const { step, file } = retryRef.current;
    if (file) {
      const fns = [analyzeCIM, analyzeNDA, analyzeFinancePacket, () => Promise.resolve(null), analyzeQoE, analyzeAgreement];
      handleStepUpload(step, file, fns[step]);
    }
  }, [handleStepUpload]);

  // Step 3 (LOI) auto-triggers when step1 data is available
  const handleLOILoad = useCallback(async () => {
    if (steps[2].data || steps[2].loading) return;
    const step1Data = steps[0].data;
    if (!step1Data) return;
    updateStep(2, { loading: true, error: null });
    try {
      const result = await generateLOI(step1Data);
      updateStep(2, { data: result, loading: false });
    } catch (e: any) {
      updateStep(2, { loading: false, error: e.message || "Unknown error" });
    }
  }, [steps, updateStep]);

  // Auto-load LOI when navigating to step 3
  useEffect(() => {
    if (activeStep === 2 && steps[0].data && !steps[2].data && !steps[2].loading) {
      handleLOILoad();
    }
  }, [activeStep, steps, handleLOILoad]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

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

  // Determine what to show per step
  const renderStep = (index: number) => {
    const s = steps[index];

    switch (index) {
      case 0: // CIM Analysis
        if (s.data) return <CIMResultsDashboard data={s.data} />;
        return (
          <StepUploadZone
            label="Upload CIM document"
            description="Drag & drop a PDF or click to browse"
            isLoading={s.loading}
            error={s.error}
            onUpload={(file) => handleStepUpload(0, file, analyzeCIM)}
            onRetry={handleRetry}
          />
        );

      case 1: // Financials / NDA
        if (s.data) return <GenericStepResults data={s.data} title="Financial Screening Complete" />;
        return (
          <StepUploadZone
            label="Upload NDA or Finance Packet"
            description="PDF document for financial screening"
            isLoading={s.loading}
            error={s.error}
            onUpload={(file) => handleStepUpload(1, file, analyzeNDA)}
            onRetry={handleRetry}
          />
        );

      case 2: // LOI Builder
        if (s.data) return <GenericStepResults data={s.data} title="LOI Anchor Analysis" />;
        if (s.loading) {
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary mb-4" />
              <p className="text-sm font-medium text-foreground">Generating LOI anchor…</p>
              <p className="text-xs text-muted-foreground">Using CIM analysis to calculate terms</p>
            </motion.div>
          );
        }
        if (s.error) {
          return (
            <StepUploadZone
              label=""
              description=""
              isLoading={false}
              error={s.error}
              onUpload={() => {}}
              onRetry={() => handleLOILoad()}
            />
          );
        }
        if (!steps[0].data) {
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
              <p className="text-sm text-muted-foreground">Complete CIM Analysis first to generate LOI anchor</p>
            </motion.div>
          );
        }
        return null;

      case 3: // Diligence / QoE
        return <QoEDashboard />;

      case 4: // Close / Agreement
        if (s.data) return <GenericStepResults data={s.data} title="Agreement Review Complete" />;
        return (
          <StepUploadZone
            label="Upload Purchase Agreement"
            description="PDF document for closing review"
            isLoading={s.loading}
            error={s.error}
            onUpload={(file) => handleStepUpload(4, file, analyzeAgreement)}
            onRetry={handleRetry}
          />
        );

      default:
        return null;
    }
  };

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

        {/* Demo mode hint */}
        <div className="mb-2">
          <p className="text-[10px] text-muted-foreground/50">Press Shift+D to load demo data</p>
        </div>

        <div className="mb-6">
          <StepNavigation activeStep={activeStep} onStepChange={setActiveStep} hasResults={!!steps[0].data} />
        </div>

        {renderStep(activeStep)}

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
}

// ── Router Entry ──

const DealPage = () => {
  const { id } = useParams();
  if (id === "new") return <NewDealForm />;
  return <DealView />;
};

export default DealPage;
