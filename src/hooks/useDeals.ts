import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Deal, Risk } from "@/types/deal";

function rowToDeal(row: any): Deal {
  return {
    id: row.id,
    name: row.name,
    location: row.location ?? "",
    status: row.status as Deal["status"],
    verdict: row.verdict as Deal["verdict"],
    valuationLow: row.valuation_low ? Number(row.valuation_low) : undefined,
    valuationHigh: row.valuation_high ? Number(row.valuation_high) : undefined,
    revenue: row.revenue ? Number(row.revenue) : undefined,
    netIncome: row.net_income ? Number(row.net_income) : undefined,
    recurringRevenuePct: row.recurring_revenue_pct ? Number(row.recurring_revenue_pct) : undefined,
    industry: row.industry ?? undefined,
    employees: row.employees ?? undefined,
    yearEstablished: row.year_established ?? undefined,
    risks: (row.risks as Risk[]) ?? [],
    summary: row.summary ?? undefined,
    nextSteps: (row.next_steps as string[]) ?? [],
    cimFilePath: row.cim_file_path ?? undefined,
  };
}

export function useDeals() {
  return useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(rowToDeal);
    },
  });
}

export function useDeal(id: string | undefined) {
  return useQuery({
    queryKey: ["deals", id],
    enabled: !!id && id !== "new",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return rowToDeal(data);
    },
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; industry?: string; location?: string; cimFilePath?: string }) => {
      const { data, error } = await supabase
        .from("deals")
        .insert({
          name: input.name,
          industry: input.industry || null,
          location: input.location || null,
          status: input.cimFilePath ? "analyzing" : "new",
          cim_file_path: input.cimFilePath || null,
        })
        .select()
        .single();
      if (error) throw error;
      return rowToDeal(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

export async function uploadCIM(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("cim-files").upload(path, file);
  if (error) throw error;
  return path;
}
