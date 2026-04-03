import { Deal } from "@/types/deal";

export const mockDeals: Deal[] = [
  {
    id: "1",
    name: "Midwest IT Services",
    location: "IL",
    status: "reviewed",
    verdict: "caution",
    valuationLow: 2500000,
    valuationHigh: 4100000,
    revenue: 2444102,
    netIncome: 828627,
    recurringRevenuePct: 80,
    industry: "Managed IT Services",
    employees: 6,
    yearEstablished: 2000,
    risks: [
      { label: "Owner compensation not disclosed", severity: "high" },
      { label: "Cash basis — accrual restatement needed", severity: "high" },
      { label: "Related party lease $36K/yr", severity: "medium" },
      { label: "Revenue declined 2.3% YoY", severity: "medium" },
      { label: "Zero marketing — all growth owner-driven", severity: "medium" },
    ],
    summary:
      "Established managed IT services provider with strong recurring revenue base (80%) and high retention (90%+). However, undisclosed owner compensation and cash-basis accounting require careful due diligence. Revenue shows slight decline at -2.3% YoY.",
    nextSteps: [
      "Request 3 years of tax returns (2018–2020)",
      "Obtain owner W-2 / K-1 compensation details",
      "Review top 21 client contracts",
      "Verify MRR schedule with contract end dates",
      "Get market rent comp for $3K/mo lease",
    ],
  },
  {
    id: "2",
    name: "HVAC Business",
    location: "TX",
    status: "reviewed",
    verdict: "strong",
    valuationLow: 1800000,
    valuationHigh: 2600000,
    revenue: 1950000,
    netIncome: 420000,
    recurringRevenuePct: 45,
    industry: "HVAC / Mechanical",
    employees: 12,
    yearEstablished: 2008,
    risks: [
      { label: "Seasonal revenue concentration", severity: "medium" },
      { label: "Two technicians handle 60% of jobs", severity: "medium" },
    ],
    summary:
      "Well-run HVAC company with solid margins and growing service contract base. R-22 phaseout creates upsell opportunities. Strong local reputation with 4.8★ Google rating.",
    nextSteps: [
      "Review monthly revenue breakdown for seasonality",
      "Verify technician retention and compensation",
      "Assess service contract renewal rates",
    ],
  },
  {
    id: "3",
    name: "Digital Marketing Agency",
    location: "CA",
    status: "analyzing",
    revenue: 890000,
    industry: "Digital Marketing",
  },
];

export const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
};
