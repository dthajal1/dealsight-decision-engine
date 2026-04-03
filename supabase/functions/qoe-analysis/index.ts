import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const QOE_WEBHOOK = "https://silmuio.app.n8n.cloud/webhook/84b0e808-5789-42e0-bce8-3754b44fa162";
const TIMEOUT_MS = 30_000;

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { csvData, askingPrice } = await req.json();

    if (typeof csvData !== "string" || csvData.trim() === "") {
      return jsonResponse(400, { error: "csvData is required" });
    }

    const askingPriceNumber = Number(askingPrice);
    if (!Number.isFinite(askingPriceNumber) || askingPriceNumber <= 0) {
      return jsonResponse(400, { error: "askingPrice must be a valid positive number" });
    }

    console.log("[qoe-analysis] Received request", {
      csvLength: csvData.length,
      askingPrice: askingPriceNumber,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(QOE_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          csvData,
          askingPrice: askingPriceNumber,
        }),
        signal: controller.signal,
      });

      const raw = await response.text();
      console.log("[qoe-analysis] Upstream status", response.status);
      console.log("[qoe-analysis] Upstream preview", raw.slice(0, 300));

      if (!response.ok) {
        return jsonResponse(response.status, {
          error: raw || `Upstream request failed with status ${response.status}`,
        });
      }

      if (!raw.trim()) {
        return jsonResponse(502, { error: "Webhook returned an empty response" });
      }

      try {
        const parsed = JSON.parse(raw);
        return jsonResponse(200, parsed);
      } catch (parseError) {
        console.error("[qoe-analysis] Invalid JSON from webhook", parseError);
        return jsonResponse(502, {
          error: "Webhook returned invalid JSON",
          raw: raw.slice(0, 500),
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return jsonResponse(504, { error: "Webhook timed out after 30 seconds" });
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("[qoe-analysis] Proxy error", error);
    return jsonResponse(500, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
