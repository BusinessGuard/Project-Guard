// ============================================================================
// CENTRALIZED CONFIGURATION - Expert Panels & Validation Rules
// ============================================================================

interface ExpertConfig {
  field: string;
  name: string;
  role: string;
  avatar: string;
}

interface AudienceConfig {
  expertCount: number;
  experts: ExpertConfig[];
  recommendationCount: { min: number; max: number };
  growthPhases: number;
  monthlyProjections: { min: number; max: number };
}

const AUDIENCE_CONFIGS: Record<'venture' | 'bank' | 'corporate', AudienceConfig> = {
  venture: {
    expertCount: 5,
    experts: [
      { field: 'financial', name: 'Michael Chen', role: 'CFO with 20+ years experience', avatar: '💰' },
      { field: 'market', name: 'Sarah Williams', role: 'Senior Market Researcher with 15+ years', avatar: '📊' },
      { field: 'product', name: 'David Park', role: 'VP Product with 12+ years', avatar: '🎯' },
      { field: 'marketing', name: 'Emma Rodriguez', role: 'CMO with 10+ years', avatar: '📢' },
      { field: 'risk', name: 'James Thompson', role: 'Enterprise Risk Consultant with 18+ years', avatar: '⚠️' },
    ],
    recommendationCount: { min: 5, max: 7 },
    growthPhases: 3,
    monthlyProjections: { min: 12, max: 12 },
  },
  bank: {
    expertCount: 5,
    experts: [
      { field: 'credit', name: 'Robert Martinez', role: 'Senior Credit Officer with 25+ years', avatar: '🏦' },
      { field: 'risk', name: 'Patricia Green', role: 'Chief Risk Officer with 20+ years', avatar: '⚠️' },
      { field: 'compliance', name: 'Elena Petrov', role: 'Regulatory Compliance with 18+ years', avatar: '📋' },
      { field: 'financial', name: 'Andrew Foster', role: 'Senior Financial Analyst with 18+ years', avatar: '💰' },
      { field: 'legal', name: 'Margaret Chen', role: 'Banking Law Specialist with 22+ years', avatar: '⚖️' },
    ],
    recommendationCount: { min: 5, max: 6 },
    growthPhases: 3,
    monthlyProjections: { min: 12, max: 12 },
  },
  corporate: {
    expertCount: 5,
    experts: [
      { field: 'procurement', name: 'Jennifer Walsh', role: 'VP Procurement with 15+ years', avatar: '🛒' },
      { field: 'security', name: 'Marcus Johnson', role: 'CISO with 20+ years', avatar: '🔒' },
      { field: 'integration', name: 'Sofia Chen', role: 'Enterprise Architect with 18+ years', avatar: '🔗' },
      { field: 'business', name: 'Thomas Brown', role: 'VP Business Development with 22+ years', avatar: '💼' },
      { field: 'legal', name: 'Rachel Adams', role: 'Corporate Counsel with 16+ years', avatar: '⚖️' },
    ],
    recommendationCount: { min: 5, max: 7 },
    growthPhases: 3,
    monthlyProjections: { min: 12, max: 12 },
  },
};


// ============================================================================
// Helper function to format project input data (reusable across all prompts)
// ============================================================================

function formatProjectInputData(projectData: any) {
  const {
    basicInfo,
    valueProposition,
    customerSegments,
    channels,
    economics,
    team,
    resources,
    competition,
    risks,
    growth,
  } = projectData;

  const cac = channels.cac || 0;
  const ltv =
    economics.arpu && economics.customerLifetime && economics.grossMargin
      ? economics.arpu * economics.customerLifetime * (economics.grossMargin / 100)
      : 0;
  const ltvCacRatio = ltv && cac ? (ltv / cac).toFixed(1) : '0';
  const paybackPeriod = cac && economics.arpu && economics.grossMargin
    ? (cac / (economics.arpu * (economics.grossMargin / 100))).toFixed(1)
    : '0';
  const monthlyBurn = economics.fundingRaised && economics.currentRunway
    ? (economics.fundingRaised / economics.currentRunway).toFixed(0)
    : 0;

  return `PROJECT OVERVIEW:
  Name: ${basicInfo.projectName}
  Industry: ${basicInfo.industry}
  Stage: ${basicInfo.stage}
  Description: ${basicInfo.description}

  BUSINESS MODEL CANVAS:

  1. VALUE PROPOSITION:
  Problem: ${valueProposition.problem}
  Solution: ${valueProposition.solution}
  Uniqueness: ${valueProposition.solutionUniqueness}
  Key Advantages: ${valueProposition.advantages.join(", ")}
  Measurable Value: ${valueProposition.measurableValue}

  2. CUSTOMER SEGMENTS:
  Primary Segment: ${customerSegments.primarySegment}
  Market Size:
    • TAM: ${customerSegments.marketSize.tam} - ${customerSegments.marketSize.tamDescription}
    • SAM: ${customerSegments.marketSize.sam} - ${customerSegments.marketSize.samDescription}
    • SOM: ${customerSegments.marketSize.som} - ${customerSegments.marketSize.somDescription}
  Geography: ${customerSegments.geography.markets.join(", ")} - ${customerSegments.geography.notes}
  Willingness to Pay: ${customerSegments.willingnessToPay.evidence}
  Average Deal Size: €${customerSegments.willingnessToPay.averageDealSize}

  3. CHANNELS & ACQUISITION:
  Acquisition Channels: ${channels.acquisitionChannels.join(", ")}
  Sales Channel: ${channels.salesChannel}
  CAC: €${channels.cac}
  CAC Breakdown: ${channels.cacDescription}
  Marketing Tools: ${channels.marketingTools}
  Marketing Funnel: ${channels.marketingFunnel}

  4. REVENUE MODEL:
  Projected 12m Revenue: €${economics.projectedRevenue12Months}
  Revenue Streams:
  ${economics.revenueStreams.map((s: any) => `  • ${s.type}: ${s.description} (${s.percentage}%)`).join("\n")}
  Pricing Strategy: ${economics.revenuePricing}

  5. UNIT ECONOMICS:
  ARPU: €${economics.arpu}/month
  Customer Lifetime: ${economics.customerLifetime} months
  Gross Margin: ${economics.grossMargin}%
  Contribution Margin: €${economics.contributionMargin}

  CALCULATED METRICS:
  - LTV: €${ltv.toFixed(2)}
  - LTV/CAC: ${ltvCacRatio}x
  - Payback Period: ${paybackPeriod} months
  - Monthly Burn: €${monthlyBurn}

  6. COST STRUCTURE:
  Cost Breakdown: ${economics.costBreakdown}
  Current Runway: ${economics.currentRunway} months

  7. FUNDING:
  Already Raised: €${economics.fundingRaised}
  Funding Sources:
  ${economics.fundingSources.map((s: any) => `  • ${s.type}: €${s.amount}`).join("\n")}
  Amount Seeking: €${economics.amountSeeking}
  Use of Funds:
  ${economics.useOfFunds.map((u: any) => `  • ${u.item}: €${u.amount}`).join("\n")}

  8. TEAM:
  Founder Experience: ${team.founderExperience}
  Key Roles: ${team.keyRoles}
  Specialists: ${team.specialists}
  Team Gaps: ${team.gaps}

  9. KEY RESOURCES & ACTIVITIES:
  Physical Resources: ${resources.existing}
  Needed Resources: ${resources.needed}
  Tech Stack: ${resources.techStack}
  Dependencies: ${resources.dependencies}

  Key Activities:
    • Production: ${resources.activities.production}
    • Innovation: ${resources.activities.innovation}
    • Platform: ${resources.activities.platform}
    • Marketing: ${resources.activities.marketing}
    • Operations: ${resources.activities.operations}

  10. KEY PARTNERS:
  ${resources.partners.map((p: any) => `  • ${p.type}: ${p.name} - ${p.value}`).join("\n")}

  COMPETITIVE ADVANTAGE:
  Direct Competitors: ${competition.directCompetitors}
  Indirect Competitors: ${competition.indirectCompetitors}
  Why Choose Us: ${competition.whyChooseYou}
  Defensibility: ${competition.defensibility}

  RISKS & MITIGATION:
  Technical: ${risks.technical}
  Financial: ${risks.financial}
  Legal: ${risks.legal}
  Market: ${risks.market}
  Team: ${risks.team}
  Mitigation: ${risks.mitigation}

  TRACTION & GROWTH:
  Current Traction: ${growth.traction}
  Scaling Plan: ${growth.scalingPlan}
  New Markets: ${growth.newMarkets}
  Payback Period Forecast: ${growth.paybackPeriod}
  Targets:
    • 12 months: ${growth.targets12Months}
    • 24 months: ${growth.targets24Months}
    • 36 months: ${growth.targets36Months}`;
}

// Common language instruction builder
function getLanguageInstruction(language: string): string {
  const fallbackName = language === 'ru' ? 'RUSSIAN (Русский)' : language === 'en' ? 'ENGLISH' : language.toUpperCase();
  return `CRITICAL LANGUAGE RULES:
    1. Detect the language from the project input data (description, problem, solution, etc.) and respond ENTIRELY in that same language.
       - If the input is clearly in Russian → respond in Russian
       - If the input is clearly in English → respond in English
       - If the input is clearly in Ukrainian → respond in Ukrainian
       - If the language cannot be determined with confidence → respond in ${fallbackName}
       - NEVER mix languages within a single sentence or field

    2. ALL text content MUST be in the detected language:
      - Expert summaries, findings, concerns, recommendations
      - Risk descriptions and mitigation strategies
      - Growth plan phases (names, goals, actions, metrics, budgets, team sizes)
      - Recommendation titles, descriptions, action steps, expected impact
      - Consensus findings (strengths/weaknesses)
      - All narrative text, explanations, and descriptions

    3. EXCEPTIONS — keep these EXACTLY as-is, never translate:
      - Abbreviations and acronyms: SaaS, MVP, CAC, LTV, ARPU, MRR, ARR, EBITDA, DSCR, KYC, AML, GDPR, SOC2, ISO27001, NPS, CRM, API, IP, ROI, TAM, SAM, SOM, B2B, B2C
      - Currency symbols and codes: €, $, %, USD, EUR
      - Numbers and dates
      - Proper names: company names, brand names, person names, product names, trademarks
      - EVERYTHING ELSE must be written in the detected language — no exceptions`;
}

// Audience-specific instructions
const VENTURE_AUDIENCE_INSTRUCTIONS = `You are ProjectGuard AI — a panel of 5 startup evaluation experts. Analyze the project from each expert's perspective simultaneously.

  EXPERT PANEL:
  • Michael Chen (financial) — CFO 20yr: unit economics, LTV/CAC, burn rate, path to profitability
  • Sarah Williams (market) — Researcher 15yr: TAM/SAM/SOM, competitive positioning, market validation
  • David Park (product) — VP Product 12yr: product-market fit, value proposition, differentiation
  • Emma Rodriguez (marketing) — CMO 10yr: CAC efficiency, acquisition channels, funnel conversion
  • James Thompson (risk) — Risk Consultant 18yr: red flags, technical/financial/legal/market risks

  FOCUS: Growth potential, scalability, market disruption, venture returns (10x+)`;

const BANK_AUDIENCE_INSTRUCTIONS = `You are a Bank Credit Committee — 5 senior banking experts assessing creditworthiness and lending terms for a startup/SME.

  EXPERT PANEL:
  • Robert Martinez (credit) — Credit Officer 25yr: repayment capacity, DSCR, cash flow stability
  • Patricia Green (risk) — CRO 20yr: default prediction, concentration risk, early warning signals
  • Elena Petrov (compliance) — Compliance 18yr: AML/KYC, regulatory adherence, documentation
  • Andrew Foster (financial) — Financial Analyst 18yr: revenue projections, burn rate, unit economics
  • Margaret Chen (legal) — Banking Law 22yr: loan docs, covenants, security agreements

  FOCUS: Cash flow stability, collateral coverage, repayment certainty, conservative risk management`;

const CORPORATE_AUDIENCE_INSTRUCTIONS = `You are a Corporate Strategy Committee — 5 senior executives evaluating a startup as a potential partner, vendor, or strategic investment.

  EXPERT PANEL:
  • Jennifer Walsh (procurement) — VP Procurement 15yr: vendor assessment, pricing, contractual risk
  • Marcus Johnson (security) — CISO 20yr: cybersecurity, GDPR/SOC2 compliance, data protection
  • Sofia Chen (integration) — Enterprise Architect 18yr: API compatibility, tech stack fit, scalability
  • Thomas Brown (business) — VP Biz Dev 22yr: strategic fit, synergies, ROI modeling
  • Rachel Adams (legal) — Corporate Counsel 16yr: IP rights, contract law, liability

  FOCUS: Strategic fit, integration feasibility, vendor stability, measurable ROI (<18 months)`;

// Venture Capital Scoring Criteria
const VENTURE_SCORING_CRITERIA = `
  SCORING (0-100 per block, VENTURE CAPITAL focus):
  • Value Proposition: disruption potential, scalability, IP defensibility, problem severity
  • Customer Segments: TAM >€1B, growth >20% YoY, path to leadership, traction
  • Channels: viral/organic potential, CAC payback <12mo, network effects
  • Revenue: recurring model (MRR/ARR), >3x growth potential, path to €10M+ ARR
  • Costs: gross margin >70%, LTV/CAC >3x, capital efficiency
  • Key Resources: proprietary tech/data, IP moat, talent attraction
  • Key Activities: R&D velocity, PMF evidence, execution speed
  • Key Partners: strategic distribution, marquee logos, platform opportunities
  • Team: founder-market fit, startup experience, completeness for scaling

  WEIGHTS: Team 25%, Value Prop 20%, Customer Segments 15%, Revenue 15%, Others 25%
  READINESS: 85-100 "Ready" | 70-84 "Nearly Ready" | 50-69 "Needs Work" | 0-49 "Not Ready"
`;

// Bank Loan Scoring Criteria
const BANK_SCORING_CRITERIA = `
  SCORING (0-100 per block, BANK CREDIT focus):
  • Value Proposition: demand stability, proven solution, revenue predictability, sustainability
  • Customer Segments: stable base, diversified portfolio, no concentration risk, recession resistance
  • Channels: proven CAC data, retention >85%, predictable sales cycle
  • Revenue: contracted/recurring revenue, history >12mo, customer lifetime >24mo
  • Costs: EBITDA positive or <6mo to profitability, DSCR >1.25x, cost predictability
  • Key Resources: tangible collateral (equipment/inventory), asset quality, ownership clarity
  • Key Activities: operational consistency, process documentation, regulatory compliance
  • Key Partners: supplier stability, long-term contracts, diversified partnerships
  • Team: industry experience >5yr, financial management, personal credit history, governance

  WEIGHTS: Revenue 25%, Costs 20%, Resources 20%, Customer Segments 15%, Others 20%
  READINESS: 85-100 "Ready" | 70-84 "Nearly Ready" | 50-69 "Needs Work" | 0-49 "Not Ready"
`;

// Corporate Partnership Scoring Criteria
const CORPORATE_SCORING_CRITERIA = `
  SCORING (0-100 per block, CORPORATE PARTNERSHIP focus):
  • Value Proposition: strategic fit, integration complexity, ROI clarity, competitive advantage
  • Customer Segments: overlap with corporate base, segment strategic value, geographic alignment
  • Channels: channel compatibility, co-marketing potential, sales process alignment
  • Revenue: commercial terms attractiveness, pricing clarity, contract flexibility
  • Costs: total cost of ownership (implementation + ongoing), hidden costs, exit/lock-in risk
  • Key Resources: tech stack compatibility, GDPR/SOC2/ISO27001 compliance, API quality, scalability
  • Key Activities: SLA quality, support responsiveness, process integration ease
  • Key Partners: existing corporate clients, industry certifications, financial stability
  • Team: enterprise sales experience, account management, vendor stability, technical support

  WEIGHTS: Value Prop 20%, Resources 20%, Costs 15%, Revenue 15%, Others 30%
  READINESS: 85-100 "Ready" | 70-84 "Nearly Ready" | 50-69 "Needs Work" | 0-49 "Not Ready"
`;

// Universal system prompt builder
function buildUniversalSystemPrompt(audienceInstructions: string, scoringCriteria: string, langInstruction: string): string {
  return `${audienceInstructions}

  DATA INTEGRITY & UNCERTAINTY RULES (MANDATORY):
  1. Use ONLY the data explicitly provided by the user/project input. Do NOT invent, assume, estimate, or "fill in" missing details.
     - If a metric/claim is not provided (e.g., revenue, CAC, churn, margins, funnel conversion), treat it as UNKNOWN.
     - Never fabricate numbers, customer counts, benchmarks, partnerships, traction, or timelines.

  2. If the user indicates uncertainty / missing info / "don't know" / "decide later" / "TBD":
     - You MUST explicitly highlight this as an information gap.
     - You MUST pessimize the relevant scores (conservative/worst-case within reason).
     - You MUST carry this uncertainty through the analysis (expert concerns, risks, consensus weaknesses, recommendations).
     - Prefer stating "Not enough information to assess X" over making up a plausible answer.

  3. Evidence standard:
     - When you mention numbers, they must be directly supported by user input.
     - When user input is qualitative only, keep outputs qualitative; do not convert into precise quantitative claims.

  ANALYSIS APPROACH:
  1. Each expert analyzes relevant aspects of the business model
  2. Experts provide independent assessments with confidence levels (0-100)
  3. Identify consensus (where 4+ experts agree) and critical disagreements
  4. Synthesize findings into actionable recommendations with priorities
  5. Generate realistic 3-phase growth roadmap with specific milestones and budgets
  6. Provide detailed financial forecast with 12-month projections

  ${scoringCriteria}

  Be brutally honest but constructive. Focus on actionable insights with specific numbers.

  ${langInstruction}`;
}

// Main system prompt selector
export function getSystemPrompt(audienceType: 'venture' | 'bank' | 'corporate' = 'venture', language: string = 'ru' ): string {
  const langInstruction = getLanguageInstruction(language);
  
  let audienceInstructions: string;
  let scoringCriteria: string;
  
  switch (audienceType) {
    case 'venture':
      audienceInstructions = VENTURE_AUDIENCE_INSTRUCTIONS;
      scoringCriteria = VENTURE_SCORING_CRITERIA;
      break;
    case 'bank':
      audienceInstructions = BANK_AUDIENCE_INSTRUCTIONS;
      scoringCriteria = BANK_SCORING_CRITERIA;
      break;
    case 'corporate':
      audienceInstructions = CORPORATE_AUDIENCE_INSTRUCTIONS;
      scoringCriteria = CORPORATE_SCORING_CRITERIA;
      break;
    default:
      audienceInstructions = VENTURE_AUDIENCE_INSTRUCTIONS;
      scoringCriteria = VENTURE_SCORING_CRITERIA;
  }
  
  return buildUniversalSystemPrompt(audienceInstructions, scoringCriteria, langInstruction);
}


export function createProjectPrompt(projectData: any, audienceType: 'venture' | 'bank' | 'corporate' = 'venture') {
  const projectInput = formatProjectInputData(projectData);
  const config = AUDIENCE_CONFIGS[audienceType];
  const expertNames = config.experts.map(e => `${e.name} (${e.field})`).join(', ');
  const expertFields = config.experts.map(e => e.field).join(', ');

  return `Analyze this startup from ALL ${config.expertCount} expert perspectives defined in your system instructions.

  ${projectInput}

  Return ONLY valid JSON (no markdown) matching this structure exactly:
  ${ANALYSIS_JSON_STRUCTURE}

  REQUIRED QUANTITIES:
  • experts.list: ${config.expertCount} objects — ${expertNames}
    Each expert fields: field(${expertFields}), name, role, avatar, summary(15-25w), confidence(70-95), keyFindings(3-5), concerns(3-5), recommendations(3-5), criticalRisks(1-3 objects with category/description/likelihood/impact/mitigation)
  • recommendations.list: ${config.recommendationCount.min}-${config.recommendationCount.max} objects
    Each: id, priority(CRITICAL/HIGH/MEDIUM/LOW), category, title, description(30-50w), actionSteps(4-6), expectedImpact, effort, timeline, expertsSupporting(2-4)
  • growthPlan.phases: ${config.growthPhases} phases (phase1/phase2/phase3)
    Each: name, duration, goals(4-6), keyActions(5-7), budget(€), teamSize, successMetrics(4-6)
  • financialForecast.monthlyProjections: ${config.monthlyProjections.min}-${config.monthlyProjections.max} months
    Each: month, revenue, costs, profit, customers, mrr, runway
  • consensus: topStrengths & topWeaknesses (3-7 each, with specific metrics)

  All numbers must be realistic and grounded in the provided data. Pure JSON only.`;
}

// JSON structure for analysis response (reusable across all expert types)
const ANALYSIS_JSON_STRUCTURE = `{
  "scores": {
    "overall": 82,
    "readiness": "Nearly Ready",
    "blocks": {
      "valueProposition": 88,
      "customerSegments": 75,
      "channels": 68,
      "revenue": 85,
      "costs": 90,
      "keyResources": 78,
      "keyActivities": 82,
      "keyPartners": 70,
      "team": 75
    }
  },
  "benchmark": {
    "percentile": 24,
    "betterThan": 76
  },
  "consensus": {
    "findings": {
      "topStrengths": [
        "[Key strength with specific metric or evidence]",
        "[Key strength with specific metric or evidence]",
        "[Key strength with specific metric or evidence]"
      ],
      "topWeaknesses": [
        "[Key weakness with specific impact assessment]",
        "[Key weakness with specific impact assessment]",
        "[Key weakness with specific impact assessment]"
      ]
    }
  },
  "experts": {
    "list": [
      {
        "field": "financial",
        "name": "Michael Chen",
        "role": "CFO with 20+ years experience",
        "avatar": "💰",
        "summary": "[1-sentence expert overview, 15-25 words]",
        "confidence": 92,
        "keyFindings": [
          "[Specific finding with numbers and metrics]",
          "[Specific finding with numbers and metrics]",
          "[Specific finding with numbers and metrics]"
        ],
        "concerns": [
          "[Specific concern with impact assessment]",
          "[Specific concern with impact assessment]",
          "[Specific concern with impact assessment]"
        ],
        "recommendations": [
          "[Actionable recommendation with clear next steps]",
          "[Actionable recommendation with clear next steps]",
          "[Actionable recommendation with clear next steps]"
        ],
        "criticalRisks": [
          {
            "category": "[Risk category]",
            "description": "[Detailed risk description with impact]",
            "likelihood": "high",
            "impact": "critical",
            "mitigation": "[Specific mitigation strategy with timeline]"
          }
        ]
      }
    ]
  },
  "recommendations": {
    "list": [
      {
        "id": "rec-1",
        "priority": "CRITICAL",
        "category": "team",
        "title": "[Recommendation title, 8-15 words]",
        "description": "[Problem statement and solution, 30-50 words]",
        "actionSteps": [
          "[Concrete action step with specifics]",
          "[Concrete action step with specifics]",
          "[Concrete action step with specifics]",
          "[Concrete action step with specifics]",
          "[Concrete action step with specifics]"
        ],
        "expectedImpact": "[Score change + business outcome + timeline]",
        "effort": "High",
        "timeline": "8 weeks",
        "expertsSupporting": ["marketing", "operations", "financial"]
      }
    ]
  },
  "growthPlan": {
    "phases": {
      "phase1": {
        "name": "[Phase name]",
        "duration": "Months 1-3",
        "goals": [
          "[Specific goal with measurable target]",
          "[Specific goal with measurable target]",
          "[Specific goal with measurable target]",
          "[Specific goal with measurable target]"
        ],
        "keyActions": [
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]"
        ],
        "budget": "€27,000",
        "teamSize": "[N] founders + [N] developers + [roles]",
        "successMetrics": [
          "[Metric with target value]",
          "[Metric with target value]",
          "[Metric with target value]",
          "[Metric with target value]",
          "[Metric with target value]"
        ]
      },
      "phase2": {
        "name": "[Phase name]",
        "duration": "Months 4-9",
        "goals": [
          "[Specific goal with measurable target]",
          "[Specific goal with measurable target]",
          "[Specific goal with measurable target]",
          "[Specific goal with measurable target]"
        ],
        "keyActions": [
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]"
        ],
        "budget": "€81,000",
        "teamSize": "[N] founders + [N] developers + [roles]",
        "successMetrics": [
          "[Metric with target value]",
          "[Metric with target value]",
          "[Metric with target value]",
          "[Metric with target value]",
          "[Metric with target value]"
        ]
      },
      "phase3": {
        "name": "[Phase name]",
        "duration": "Months 10-18",
        "goals": [
          "[Specific goal with measurable target]",
          "[Specific goal with measurable target]",
          "[Specific goal with measurable target]",
          "[Specific goal with measurable target]"
        ],
        "keyActions": [
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]",
          "[Concrete action with owner or tool]"
        ],
        "budget": "€243,000",
        "teamSize": "[N] founders + [N] developers + [roles]",
        "successMetrics": [
          "[Metric with target value]",
          "[Metric with target value]",
          "[Metric with target value]",
          "[Metric with target value]",
          "[Metric with target value]"
        ]
      }
    }
  },
  "financialForecast": {
    "unitEconomics": {
      "ltv": 1782,
      "cac": 55,
      "ltvCacRatio": 32.4,
      "paybackPeriod": 0.6,
      "grossMargin": 80,
      "churnRate": 15
    },
    "breakEven": {
      "month": 16,
      "customers": 90,
      "mrr": 8910
    },
    "monthlyProjections": [
      {
        "month": 1,
        "revenue": 2475,
        "costs": 7000,
        "profit": -4525,
        "customers": 25,
        "mrr": 2475,
        "runway": 14
      }
    ]
  }
}`;