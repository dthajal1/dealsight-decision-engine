// n8n Webhook integration service
// Each step posts to a different webhook URL and returns structured JSON

const WEBHOOK_BASE = "https://kamayani17.app.n8n.cloud/webhook";
const TIMEOUT_MS = 30_000;

export const WEBHOOK_URLS = {
  cimAnalyzer: `${WEBHOOK_BASE}/cim-analyzer`,
  ndaTracker: `${WEBHOOK_BASE}/nda-tracker`,
  preLoi: `${WEBHOOK_BASE}/pre-loi`,
  loiAnchor: `${WEBHOOK_BASE}/loi-anchor`,
  qoe: `${WEBHOOK_BASE}/qoe`,
  agreementReview: `${WEBHOOK_BASE}/agreement-review`,
} as const;

export class WebhookTimeoutError extends Error {
  constructor() {
    super("Request timed out after 30 seconds");
    this.name = "WebhookTimeoutError";
  }
}

async function postWebhook<T = any>(url: string, body: Record<string, any>): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`Webhook returned ${resp.status}: ${text}`);
    }

    return await resp.json();
  } catch (e: any) {
    if (e.name === "AbortError") throw new WebhookTimeoutError();
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/** Read a File as base64 (strips the data:…;base64, prefix) */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// ── Step 1: CIM Analysis ──
export async function analyzeCIM(file: File) {
  const pdf_base64 = await fileToBase64(file);
  return postWebhook(WEBHOOK_URLS.cimAnalyzer, { pdf_base64 });
}

// ── Step 2: NDA / Financial Screen ──
export async function analyzeNDA(file: File) {
  const pdf_base64 = await fileToBase64(file);
  return postWebhook(WEBHOOK_URLS.ndaTracker, { pdf_base64 });
}

// ── Step 3: Pre-LOI / Finance Packet ──
export async function analyzeFinancePacket(file: File) {
  const pdf_base64 = await fileToBase64(file);
  return postWebhook(WEBHOOK_URLS.preLoi, { pdf_base64 });
}

// ── Step 4: LOI Anchor (no file — uses step1 output) ──
export async function generateLOI(step1Output: any) {
  return postWebhook(WEBHOOK_URLS.loiAnchor, { step1_output: step1Output });
}

// ── Step 5: QoE ──
export async function analyzeQoE(file: File) {
  const pdf_base64 = await fileToBase64(file);
  return postWebhook(WEBHOOK_URLS.qoe, { pdf_base64 });
}

// ── Step 6: Agreement Review ──
export async function analyzeAgreement(file: File) {
  const pdf_base64 = await fileToBase64(file);
  return postWebhook(WEBHOOK_URLS.agreementReview, { pdf_base64 });
}
