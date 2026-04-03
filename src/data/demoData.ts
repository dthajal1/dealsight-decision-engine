// Demo data — mimics the n8n cim-analyzer response shape

export const DEMO_CIM_RESPONSE = {
  meta: {
    business_name: "Large Midwest MSA Managed IT Services Provider",
    generated_date: "April 3, 2026",
    classification: "Confidential"
  },
  key_metrics: {
    revenue_latest: 2444102,
    revenue_prior: 2501014,
    net_margin_pct: 33.4,
    recurring_revenue_pct: 80,
    client_retention: "90%+",
    employees: 6,
    top_client_revenue: "$1.22M (50% of total)"
  },
  buy_walk_signal: {
    verdict: "PROCEED WITH CONDITIONS",
    confidence: "MEDIUM",
    rationale: "Strong recurring revenue and exceptional margins offset by significant owner dependency risk. Structure seller note tied to 12-month revenue retention and require minimum 12-month transition period."
  },
  valuation: {
    ebitda_estimate_low: 828627,
    ebitda_estimate_high: 1050000,
    implied_value_low: 3310000,
    implied_value_high: 4970000,
    implied_value_midpoint: 4140000,
    multiple_range_low: 4,
    multiple_range_high: 6
  },
  cpa_view: {
    revenue_quality: {
      flag: "MODERATE CONCERN",
      points: [
        "Revenue declined 2.3% YoY from $2.50M to $2.44M. CIM does not explain the decline — request 3-5 years of financials to determine if this is a trend or one-time event.",
        "Cash-basis accounting creates timing distortions. Deferred revenue from prepaid managed services contracts may be unrecognized. Request accrual-basis restatement.",
        "80% recurring flat-fee revenue is a strong quality indicator. MRR should be independently verified against contract schedules.",
        "Top 21 clients represent ~50% of revenue with 10+ year average tenure. Strong cohort stability but customer concentration risk must be tested."
      ]
    },
    margin_ebitda: {
      flag: "FLAG",
      points: [
        "33.4% net margin is exceptionally high for a 6-person MSP. This likely reflects owner salary-to-profit conversion in an LLC pass-through structure.",
        "Owner drives 85%+ of new business. His compensation, benefits, and personal expenses are likely embedded in operating costs and must be normalized.",
        "Facility rent of $3,000/month paid to Seller is a related-party transaction — verify whether at, above, or below fair market rate.",
        "Low AR balance is consistent with 20-day collection terms. Minimal working capital risk at close."
      ]
    },
    tax_accounting: {
      flag: "NOTE",
      points: [
        "Colorado LLC — confirm whether entity files as partnership, S-corp, or disregarded entity. Tax treatment affects purchase price allocation and depreciation recapture.",
        "Only 2 years of financials presented. Request minimum 3-5 years of tax returns and internally prepared P&Ls.",
        "No depreciation schedules, deferred revenue, or accrued liabilities disclosed. Request full balance sheet and notes to financials."
      ]
    }
  },
  ma_view: {
    valuation_framing: {
      flag: "KEY ISSUE",
      points: [
        "MSPs in this revenue range trade at 4-7x EBITDA. At $2.44M revenue with 33% margins, normalized EBITDA of $400K-$650K implies $1.6M-$4.5M range. Seller has explicitly priced in unrealized growth potential.",
        "Managed services pricing at $85-95/seat vs market rate over $100/seat. Immediate rate increase post-close is realistic and could add $50K-$150K in annual EBITDA.",
        "Buyer should resist paying for unproven upside. Insist on earnout structure for any growth premium above defensible baseline multiple."
      ]
    },
    deal_structure: {
      points: [
        "Asset purchase recommended given LLC structure — protects buyer from legacy liabilities.",
        "Seller transition period is critical. With owner driving 85%+ of new business, minimum 12-18 month transition with non-compete and non-solicitation is essential.",
        "No asking price disclosed in CIM — normal at this stage but price discovery will happen quickly after LOI.",
        "Building owned by Seller, leased back at $3K/month. No real estate complexity in deal. Buyer has optionality to relocate."
      ]
    },
    risk_scorecard: [
      { risk: "Owner dependency", level: "High" },
      { risk: "Customer concentration", level: "Medium" },
      { risk: "Revenue quality", level: "Low" },
      { risk: "Technology/platform risk", level: "Low" },
      { risk: "Staff retention post-close", level: "Medium" },
      { risk: "Growth runway", level: "High Upside" }
    ]
  },
  legal_view: {
    corporate_structure: {
      flag: "VERIFY",
      points: [
        "Seller warrants sole 100% ownership of Colorado LLC. Confirm with current Operating Agreement, Certificate of Good Standing, and state records.",
        "As-is where-is sale language in Ch.1 is a red flag if carried into APA without modification. A properly negotiated APA must include seller representations and warranties.",
        "No mention of IP ownership — tooling, software configurations, and client data must be confirmed as owned by the entity and transferable."
      ]
    },
    employment_labor: {
      flag: "MODERATE CONCERN",
      points: [
        "No employee handbook exists. Creates exposure in disputes over PTO, conduct standards, and termination. Implement compliant handbook pre- or immediately post-close.",
        "Employees have NDAs but no non-competes. In Colorado, non-competes are narrowly enforceable under HB 22-1317 — assess whether NDAs adequately protect the client list.",
        "Seller believes all employees will stay — this is not a legal commitment. Require key-employee retention agreements or escrow holdbacks tied to 90-180 day milestones."
      ]
    },
    contracts_liabilities: {
      flag: "REVIEW REQUIRED",
      points: [
        "Client contracts must be reviewed for assignment clauses. Many MSP agreements prohibit assignment without client consent — change of ownership could trigger termination rights.",
        "Vendor agreements (SonicWALL, Datto, AppRiver) may have assignment restrictions. Partner status and pricing tiers could be at risk upon change of control.",
        "Related-party lease must be formalized with market-rate benchmarking and defined term, renewal options, and rent escalation in a new arms-length agreement."
      ]
    }
  },
  actionable_items: {
    pre_loi: [
      { number: 1, action: "Request full financials 2018-2022. Tax returns, P&Ls, and balance sheets required to validate margin quality and identify trends." },
      { number: 2, action: "Build normalized EBITDA model. Add back owner salary, personal expenses, related-party rent adjustment, and one-time items." },
      { number: 3, action: "Request MRR schedule. Client-by-client monthly recurring revenue breakdown with contract start dates, end dates, and auto-renewal terms." },
      { number: 4, action: "Identify customer concentration. Confirm whether any single client exceeds 10-15% of revenue before anchoring on a valuation range." },
      { number: 5, action: "Determine asking price. Engage advisor to understand Seller pricing expectation and proposed deal structure before investing further diligence." }
    ],
    post_loi: [
      { number: 6, action: "Review all client contracts for assignment clauses. Any change-of-control provision allowing client termination is a material deal risk." },
      { number: 7, action: "Validate related-party lease. Get written lease agreement and independent appraisal of fair market rent." },
      { number: 8, action: "Audit ConnectWise data. Ticket volume, resolution times, and client satisfaction metrics provide objective view of operational health." },
      { number: 9, action: "Structure meaningful transition plan. Negotiate minimum 12-month hands-on transition, 3-year non-compete, and non-solicitation covering all clients and employees." },
      { number: 10, action: "Test pipeline opportunity. The private college prospect (~70 employees) is presented as near-ready — verify proposal status and arrange buyer introduction." },
      { number: 11, action: "Price sensitivity analysis on rate increases. Model revenue impact of raising managed services from $85-95/seat to market rate of $100+." },
      { number: 12, action: "Employee retention strategy. Identify highest-value employees and develop retention agreements with compensation guarantees tied to close." }
    ]
  },
  buyer_questions: [
    { number: 1, category: "FINANCIALS", question: "Can you provide full P&L statements, balance sheets, and tax returns for 2018 through 2023?", context: "CIM shows only 2019-2020 — need 3-5 years to assess trend direction and normalize earnings." },
    { number: 2, category: "FINANCIALS", question: "Revenue declined ~$57K YoY from 2019 to 2020. What drove that decline and has the trend continued or reversed?", context: "Understanding whether decline is COVID-related or structural is critical to valuation." },
    { number: 3, category: "FINANCIALS", question: "The CIM reports 33.4% net income margin — significantly above MSP industry norms. Can you walk through what is and is not included in that figure?", context: "Need to understand if owner salary, vehicle, health insurance, and personal expenses are reflected in operating costs." },
    { number: 4, category: "FINANCIALS", question: "Can you provide a client-level MRR schedule showing each flat-fee contract, monthly rate, contract term, renewal date, and cancellation notice periods?", context: "Required to verify recurring revenue quality and identify at-risk accounts." },
    { number: 5, category: "FINANCIALS", question: "Does any single client represent more than 10% of annual revenue? What would the financial impact be if your top 3 clients did not renew?", context: "Customer concentration is the key risk not quantified in the CIM." },
    { number: 6, category: "CONTRACTS", question: "Do your managed services contracts include assignment or change-of-control clauses requiring client consent upon sale?", context: "Any change-of-control provision allowing termination is a material deal risk affecting price." },
    { number: 7, category: "CONTRACTS", question: "Where is the private college prospect (~70 employees) in the sales process? Would you introduce the buyer before close?", context: "Seller presents this as near-ready — verify and confirm buyer can be introduced pre-close." },
    { number: 8, category: "CONTRACTS", question: "Can you share client churn history for the past 3 years? How many clients left, why, and were any from your top-21 accounts?", context: "90%+ retention is stated but not documented. Need actual churn data." },
    { number: 9, category: "OPERATIONS", question: "How many hours per week do you spend on sales vs delivery? What specifically would a buyer need to do to replace your sales function on day one?", context: "Owner dependency is the highest risk — need a concrete transition plan." },
    { number: 10, category: "OPERATIONS", question: "Are any of your 6 employees critical to day-to-day operations in a way that would be disruptive if they left?", context: "Need to identify key-person risk beyond the owner before structuring retention agreements." },
    { number: 11, category: "OPERATIONS", question: "How are your vendor agreements structured with Datto, SonicWALL, and AppRiver? Do those partnerships include change-of-control provisions?", context: "Vendor partner status and pricing tiers could be at risk upon change of control." },
    { number: 12, category: "TRANSITION", question: "What is your asking price and how did you arrive at it? Is it based on current earnings or does it include a premium for unrealized growth?", context: "CIM explicitly states price reflects explosive growth potential — need to understand the seller's math." },
    { number: 13, category: "TRANSITION", question: "How long are you willing to commit to an active transition role and are you open to a structured earnout tied to revenue retention?", context: "Minimum 12-18 months needed given owner dependency. Earnout aligns incentives." },
    { number: 14, category: "TRANSITION", question: "Is there a written lease currently in place for the facility? Would you commit to a multi-year lease at a fixed rate post-close?", context: "$3K/month related-party lease needs to be formalized with market-rate benchmarking." },
    { number: 15, category: "TRANSITION", question: "Are you willing to sign a non-compete and non-solicitation covering clients and employees? What geographic scope and time period would you accept?", context: "Non-compete is essential given owner drives 85%+ of new business development." }
  ],
  missing_info: [
    "Asking price not disclosed",
    "Only 2 years of financials shown (2019-2020)",
    "No balance sheet provided",
    "No EBITDA breakdown or owner addbacks",
    "Client concentration data not shown",
    "No monthly MRR schedule",
    "No client contract terms or assignment clauses",
    "No employee compensation detail",
    "No vendor contract terms"
  ],
  flag_summary: {
    critical: 2,
    moderate: 3,
    notes: 1
  }
};
