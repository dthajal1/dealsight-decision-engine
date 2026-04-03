import { useState } from "react";
import { Upload, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface StepUploadZoneProps {
  label: string;
  description: string;
  isLoading: boolean;
  error: string | null;
  onUpload: (file: File) => void;
  onRetry?: () => void;
}

export function StepUploadZone({ label, description, isLoading, error, onUpload, onRetry }: StepUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (f: File) => {
    if (f.type === "application/pdf" || f.name.endsWith(".pdf")) {
      onUpload(f);
    }
  };

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium text-foreground mb-1">Analyzing document…</p>
        <p className="text-xs text-muted-foreground">This usually takes 15–30 seconds</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="w-6 h-6 text-destructive mb-4" />
        <p className="text-sm font-medium text-foreground mb-1">Analysis failed</p>
        <p className="text-xs text-muted-foreground mb-4 max-w-sm text-center">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-24">
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
        className={`w-full max-w-md border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-muted-foreground hover:bg-muted/30"
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
