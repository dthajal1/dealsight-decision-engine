// Demo data for Financials (Step 2 / NDA)
export const DEMO_FINANCIALS_RESPONSE = {
  summary: "Financial screening complete. The seller's financials show a healthy business with consistent revenue growth over 3 years, though some normalization adjustments are needed.",
  revenue_analysis: {
    trailing_12m_revenue: 2444102,
    revenue_growth_yoy: -2.3,
    revenue_trend: "Slight decline — largely attributed to loss of one mid-size client in Q3. Core MRR remained stable.",
    revenue_mix: {
      recurring: "80% ($1.96M)",
      project_based: "15% ($366K)",
      hardware_resale: "5% ($122K)"
    }
  },
  profitability: {
    gross_margin: "68.2%",
    operating_margin: "38.1%",
    net_margin: "33.4%",
    owner_compensation: "$185,000 (salary + benefits + personal expenses run through business)",
    adjusted_ebitda: "$816,000 (after normalizing owner comp to $120K market rate)"
  },
  balance_sheet_flags: [
    { item: "Accounts Receivable", value: "$48,200", note: "Low AR — 20-day average collection. Healthy." },
    { item: "Related-Party Lease", value: "$36,000/yr", note: "Seller-owned building. Lease at $3K/month — verify market rate." },
    { item: "No Long-Term Debt", value: "$0", note: "Business is debt-free. Clean capital structure." },
    { item: "Deferred Revenue", value: "Unknown", note: "Cash-basis accounting — prepaid contracts may create unrecognized deferred revenue." }
  ],
  normalization_adjustments: [
    { category: "Owner Salary", adjustment: "+$65,000", rationale: "Owner takes $185K; market replacement is $120K" },
    { category: "Vehicle Expenses", adjustment: "+$12,000", rationale: "Personal vehicle expensed through business" },
    { category: "One-Time Legal", adjustment: "+$8,500", rationale: "Non-recurring legal fees from 2020 contract dispute" },
    { category: "Related-Party Rent", adjustment: "-$6,000", rationale: "Below-market rent adjustment to fair value ($3.5K/mo)" }
  ],
  recommendation: "Financials are fundamentally sound. Key action: request accrual-basis restatement and 5-year tax returns to confirm trend stability. Normalized EBITDA supports a 4-6x multiple valuation range."
};

// Demo data for LOI Builder (Step 3)
export const DEMO_LOI_RESPONSE = {
  loi_summary: "Letter of Intent anchor terms generated based on CIM analysis and financial screening.",
  proposed_terms: {
    purchase_price: {
      range_low: 3200000,
      range_high: 4200000,
      recommended: 3700000,
      basis: "4.5x normalized EBITDA of $816K. Conservative given owner-dependency risk."
    },
    deal_structure: {
      type: "Asset Purchase",
      rationale: "LLC structure — asset purchase protects buyer from legacy liabilities and allows step-up in basis."
    },
    payment_structure: [
      { component: "Cash at Close", amount: 2590000, percentage: "70%", note: "Standard for deals in this size range" },
      { component: "Seller Note", amount: 740000, percentage: "20%", note: "3-year term, 5% interest, subordinated. Tied to revenue retention milestones." },
      { component: "Earnout", amount: 370000, percentage: "10%", note: "Paid over 24 months based on client retention >90% and revenue growth >3%" }
    ],
    transition: {
      seller_role: "Consulting — 20 hrs/week for 12 months, then 10 hrs/week for 6 months",
      non_compete: "3 years, 100-mile radius, covering managed IT services",
      non_solicitation: "3 years — clients and employees"
    }
  },
  key_conditions: [
    "Satisfactory completion of Quality of Earnings analysis",
    "Review and assignment of all client contracts without material adverse change",
    "Key employee retention agreements signed pre-close",
    "Related-party lease formalized at fair market rate",
    "Seller representations and warranties covering financials, contracts, and employee matters",
    "No material adverse change between LOI signing and close"
  ],
  negotiation_notes: [
    "Seller likely expects $4M+ given CIM language about 'explosive growth potential.' Anchor low and justify with owner-dependency discount.",
    "Earnout structure protects buyer if seller's sales relationships don't transfer. Make sure earnout metrics are objective and measurable.",
    "Seller note tied to retention creates alignment during transition. Include acceleration clause if seller breaches non-compete."
  ],
  estimated_timeline: {
    loi_to_signing: "2-3 weeks",
    due_diligence: "45-60 days",
    closing: "30 days post-diligence",
    total: "90-120 days from LOI execution"
  }
};

// Demo data for Close (Step 5)
export const DEMO_CLOSE_RESPONSE = {
  agreement_summary: "Purchase agreement review complete. Key terms and risk areas identified for final negotiation.",
  closing_checklist: {
    completed: [
      "Asset Purchase Agreement draft reviewed",
      "Seller representations and warranties — standard coverage confirmed",
      "Non-compete and non-solicitation terms agreed (3 years, 100mi radius)",
      "Transition consulting agreement drafted (12+6 months)"
    ],
    pending: [
      "Client contract assignments — 8 of 21 contracts reviewed, 13 remaining",
      "Key employee retention agreements — 2 of 4 signed",
      "Related-party lease — new arms-length agreement pending seller signature",
      "Escrow terms — holdback amount and release conditions under negotiation",
      "Final working capital target — awaiting closing-date balance sheet"
    ],
    blocked: [
      "Vendor partner transfers (Datto, SonicWALL) — require change-of-control applications submitted 30 days before close",
      "Insurance policy assignments — E&O and cyber policies need buyer endorsement"
    ]
  },
  risk_items: [
    { risk: "Client consent gap", severity: "HIGH", detail: "13 client contracts not yet reviewed for assignment clauses. Any refusal to consent could reduce deal value." },
    { risk: "Vendor partner status", severity: "MEDIUM", detail: "Datto and SonicWALL partner tiers may reset upon ownership change, affecting margins by $20-40K/year." },
    { risk: "Working capital variance", severity: "MEDIUM", detail: "Closing-date balance sheet could shift purchase price by ±$50K depending on AR and prepaid balances." },
    { risk: "Employee departure", severity: "LOW", detail: "2 of 4 key employees have signed retention agreements. Remaining 2 are in final negotiation." }
  ],
  recommended_closing_terms: {
    escrow_holdback: "$370,000 (10% of purchase price) held for 12 months to cover indemnification claims",
    working_capital_peg: "$65,000 target — dollar-for-dollar adjustment at close",
    indemnification_cap: "$740,000 (20% of purchase price) with 18-month survival period",
    basket: "$37,000 (1% mini-basket before claims are payable)"
  },
  next_steps: [
    "Complete remaining 13 client contract reviews — target: 5 business days",
    "Submit Datto and SonicWALL change-of-control applications",
    "Finalize key employee #3 and #4 retention agreements",
    "Schedule closing-date balance sheet preparation with seller's accountant",
    "Confirm title/lien search on any transferred assets",
    "Set closing date — target: 30 days from today pending contract reviews"
  ]
};
