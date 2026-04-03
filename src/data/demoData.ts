// Demo data loaded via Shift+D — mimics the n8n cim-analyzer response shape

export const DEMO_CIM_RESPONSE = {
  meta: {
    business_name: "Midwest IT Services (Demo)",
    industry: "Managed IT Services",
    location: "Chicago, IL",
    year_established: 2000,
    employees: 6,
  },
  key_metrics: [
    { label: "Revenue", value: "$2.44M" },
    { label: "Net Income", value: "$829K" },
    { label: "Gross Margin", value: "65%" },
    { label: "Recurring Revenue", value: "80%" },
    { label: "Employees", value: "6" },
    { label: "YoY Growth", value: "-2.3%" },
  ],
  cpa_view: {
    title: "CPA Financial Review",
    items: [
      { label: "Cash vs Accrual", value: "Cash basis — restatement needed", flag: "warn" },
      { label: "Owner Compensation", value: "Not disclosed — request W-2/K-1", flag: "warn" },
      { label: "Tax Returns", value: "3 years provided, consistent", flag: "ok" },
      { label: "Related-party Transactions", value: "$36K/yr lease to owner entity", flag: "warn" },
    ],
  },
  ma_view: {
    title: "M&A Advisory View",
    items: [
      { label: "Customer Concentration", value: "Top client 18% — moderate risk", flag: "warn" },
      { label: "Recurring Revenue", value: "80% MRR with 90%+ retention", flag: "ok" },
      { label: "Growth Trajectory", value: "Flat to slightly declining", flag: "warn" },
      { label: "Owner Dependency", value: "High — owner handles all sales", flag: "warn" },
      { label: "Market Position", value: "Strong local brand, 20+ year track record", flag: "ok" },
    ],
  },
  legal_view: {
    title: "Legal Review",
    items: [
      { label: "Corporate Structure", value: "LLC — clean formation docs", flag: "ok" },
      { label: "Litigation", value: "No pending or threatened claims found", flag: "ok" },
      { label: "Employee Agreements", value: "Non-competes not verified for all staff", flag: "warn" },
      { label: "IP / Licenses", value: "All vendor certifications current", flag: "ok" },
    ],
  },
  buy_walk_signal: {
    verdict: "caution",
    rationale: "Solid recurring revenue base but owner dependency, undisclosed comp, and cash-basis accounting create material risk. Proceed with focused diligence.",
  },
  valuation: {
    low: 2500000,
    mid: 3300000,
    high: 4100000,
    low_multiple: "3.0× SDE",
    mid_multiple: "4.0× SDE",
    high_multiple: "5.0× SDE",
  },
  actionable_items: [
    "Request 3 years of tax returns (2020–2022)",
    "Obtain owner W-2 / K-1 compensation details",
    "Review top 10 client contracts with renewal dates",
    "Verify MRR schedule with churn data",
    "Get independent market rent comp for related-party lease",
    "Request accounts receivable aging report",
  ],
  buyer_questions: [
    {
      question: "What is the owner's actual W-2 compensation vs. distributions?",
      context: "Owner comp is the single biggest variable in adjusted EBITDA. Without this, valuation could swing ±$300K.",
    },
    {
      question: "What happens to the top 3 clients if ownership changes?",
      context: "Owner handles all client relationships. Need to assess transfer risk and whether contracts have change-of-control provisions.",
    },
    {
      question: "Can you provide a 24-month MRR cohort analysis?",
      context: "CIM claims 90%+ retention but no supporting data. Need to verify actual churn and expansion revenue.",
    },
    {
      question: "What is the market rate for the related-party lease?",
      context: "$3K/mo may be above or below market — impacts adjusted earnings and ongoing OpEx.",
    },
  ],
  missing_info: [
    "Owner W-2 / K-1",
    "Accrual-basis financials",
    "Client contract details",
    "AR aging report",
    "Employee agreements",
    "Lease market comp",
  ],
};
