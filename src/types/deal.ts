export type DealStatus = "new" | "analyzing" | "reviewed";
export type Verdict = "strong" | "caution" | "pass";

export interface Risk {
  label: string;
  severity: "high" | "medium";
}

export interface Deal {
  id: string;
  name: string;
  location: string;
  status: DealStatus;
  verdict?: Verdict;
  valuationLow?: number;
  valuationHigh?: number;
  revenue?: number;
  netIncome?: number;
  recurringRevenuePct?: number;
  risks?: Risk[];
  summary?: string;
  industry?: string;
  employees?: number;
  yearEstablished?: number;
  nextSteps?: string[];
  analysisStep?: number;
  cimFilePath?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
