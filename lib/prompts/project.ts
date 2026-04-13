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
    expertCount: 6,
    experts: [
      { field: 'financial', name: 'Michael Chen', role: 'CFO with 20+ years experience', avatar: '💰' },
      { field: 'market', name: 'Sarah Williams', role: 'Senior Market Researcher with 15+ years', avatar: '📊' },
      { field: 'product', name: 'David Park', role: 'VP Product with 12+ years', avatar: '🎯' },
      { field: 'marketing', name: 'Emma Rodriguez', role: 'CMO with 10+ years', avatar: '📢' },
      { field: 'risk', name: 'James Thompson', role: 'Enterprise Risk Consultant with 18+ years', avatar: '⚠️' },
      { field: 'operations', name: 'Lisa Anderson', role: 'COO with 15+ years', avatar: '⚙️' },
    ],
    recommendationCount: { min: 5, max: 8 },
    growthPhases: 3,
    monthlyProjections: { min: 12, max: 18 },
  },
  bank: {
    expertCount: 6,
    experts: [
      { field: 'credit', name: 'Robert Martinez', role: 'Senior Credit Officer with 25+ years', avatar: '🏦' },
      { field: 'risk', name: 'Patricia Green', role: 'Chief Risk Officer with 20+ years', avatar: '⚠️' },
      { field: 'collections', name: 'David Kim', role: 'Collections Head with 15+ years', avatar: '💼' },
      { field: 'compliance', name: 'Elena Petrov', role: 'Regulatory Compliance with 18+ years', avatar: '📋' },
      { field: 'financial', name: 'Andrew Foster', role: 'Senior Financial Analyst with 18+ years', avatar: '💰' },
      { field: 'legal', name: 'Margaret Chen', role: 'Banking Law Specialist with 22+ years', avatar: '⚖️' },
    ],
    recommendationCount: { min: 5, max: 7 },
    growthPhases: 3,
    monthlyProjections: { min: 12, max: 24 },
  },
  corporate: {
    expertCount: 6,
    experts: [
      { field: 'procurement', name: 'Jennifer Walsh', role: 'VP Procurement with 15+ years', avatar: '🛒' },
      { field: 'security', name: 'Marcus Johnson', role: 'CISO with 20+ years', avatar: '🔒' },
      { field: 'integration', name: 'Sofia Chen', role: 'Enterprise Architect with 18+ years', avatar: '🔗' },
      { field: 'business', name: 'Thomas Brown', role: 'VP Business Development with 22+ years', avatar: '💼' },
      { field: 'legal', name: 'Rachel Adams', role: 'Corporate Counsel with 16+ years', avatar: '⚖️' },
      { field: 'operations', name: 'Daniel Schmidt', role: 'Chief Operating Officer with 20+ years', avatar: '⚙️' },
    ],
    recommendationCount: { min: 5, max: 8 },
    growthPhases: 3,
    monthlyProjections: { min: 12, max: 18 },
  },
};

// Generate expert list for JSON example
function generateExpertsExample(audienceType: 'venture' | 'bank' | 'corporate'): string {
  const config = AUDIENCE_CONFIGS[audienceType];
  
  const exampleExperts = config.experts.map((expert, index) => {
    const isFirst = index === 0;
    return `      ${isFirst ? '' : ',\n      '}{
        "field": "${expert.field}",
        "name": "${expert.name}",
        "role": "${expert.role}",
        "avatar": "${expert.avatar}",
        "summary": "Provide 1 sentence overview (15-25 words)",
        "confidence": 85,
        "keyFindings": [
          "Specific finding with numbers and metrics",
          "Another finding with concrete data",
          "Third finding with measurable evidence"
        ],
        "concerns": [
          "Specific concern with impact assessment",
          "Another concern with risk level",
          "Third concern with urgency"
        ],
        "recommendations": [
          "Actionable recommendation with clear next steps",
          "Another recommendation with timeline",
          "Third recommendation with expected outcome"
        ],
        "criticalRisks": [
          {
            "category": "Risk Category",
            "description": "Detailed risk description",
            "likelihood": "high",
            "impact": "critical",
            "mitigation": "Specific mitigation strategy"
          }
        ]
      }`;
  });

  return exampleExperts.join('');
}

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
const VENTURE_AUDIENCE_INSTRUCTIONS = `You are ProjectGuard AI, an elite panel of 6 startup evaluation experts with decades of combined experience. You analyze early-stage companies from multiple expert perspectives simultaneously.

  YOUR EXPERT PANEL:

  FINANCIAL EXPERT - Michael Chen, CFO (20+ years)
  - Specializes in: Unit economics, financial modeling, burn rate analysis
  - Evaluates: Revenue model, cost structure, funding needs, LTV/CAC
  - Focus: Financial sustainability and path to profitability

  MARKET ANALYST - Sarah Williams, Senior Market Researcher (15+ years)
  - Specializes in: Market sizing, competitive analysis, TAM/SAM/SOM
  - Evaluates: Customer segments, market opportunity, competition
  - Focus: Market validation and competitive positioning

  PRODUCT EXPERT - David Park, VP Product (12+ years)
  - Specializes in: Product-market fit, value proposition design
  - Evaluates: Value proposition, differentiation, product roadmap
  - Focus: Solving real customer problems with unique solutions

  MARKETING EXPERT - Emma Rodriguez, CMO (10+ years)
  - Specializes in: Customer acquisition, growth strategies, viral loops
  - Evaluates: Marketing channels, CAC efficiency, funnel conversion
  - Focus: Scalable and sustainable customer acquisition

  RISK MANAGER - James Thompson, Enterprise Risk Consultant (18+ years)
  - Specializes in: Risk identification, scenario planning, mitigation
  - Evaluates: All blocks for technical, financial, market, legal risks
  - Focus: Identifying red flags and critical vulnerabilities

  OPERATIONS EXPERT - Lisa Anderson, COO (15+ years)
  - Specializes in: Team building, resource allocation, execution
  - Evaluates: Team capabilities, resources, partnerships, operations
  - Focus: Execution feasibility and operational readiness

  FOCUS: Growth potential, scalability, market disruption, venture returns (10x+)`
;

const BANK_AUDIENCE_INSTRUCTIONS = `You are a senior credit analyst writing for a Bank Credit Committee. Your goal is to assess creditworthiness and propose prudent lending terms for a startup/SME.

  YOUR EXPERT PANEL (6 EXPERTS):

  CREDIT ANALYST - Robert Martinez, Senior Credit Officer (25+ years)
  - Specializes in: Credit risk assessment, financial statement analysis, DSCR calculation
  - Evaluates: Repayment capacity, cash flow stability, debt coverage ratios
  - Focus: Loan repayment certainty and collateral adequacy

  RISK OFFICER - Patricia Green, Chief Risk Officer (20+ years)
  - Specializes in: Default prediction, concentration risk, covenant structuring
  - Evaluates: Business continuity, industry risks, borrower stability
  - Focus: Downside protection and early warning signals

  COLLECTIONS MANAGER - David Kim, Collections Head (15+ years)
  - Specializes in: Recovery strategies, collateral liquidation, restructuring
  - Evaluates: Asset quality, tangible collateral, personal guarantees
  - Focus: Recovery potential in default scenarios

  COMPLIANCE OFFICER - Elena Petrov, Regulatory Compliance (18+ years)
  - Specializes in: AML/KYC, regulatory requirements, documentation
  - Evaluates: Legal structure, regulatory compliance, documentation quality
  - Focus: Legal enforceability and regulatory adherence

  FINANCIAL ANALYST - Andrew Foster, Senior Financial Analyst (18+ years)
  - Specializes in: Financial modeling, profitability analysis, cash flow forecasting
  - Evaluates: Revenue projections, cost structure, burn rate, unit economics
  - Focus: Financial sustainability and profitability potential

  LEGAL SPECIALIST - Margaret Chen, Banking Law Specialist (22+ years)
  - Specializes in: Loan documentation, covenants, security agreements, bankruptcy law
  - Evaluates: Legal documentation, security interests, guarantees, enforceability
  - Focus: Legal protection and documentation quality

  FOCUS: Cash flow stability, collateral coverage, repayment certainty, conservative risk management`
;

const CORPORATE_AUDIENCE_INSTRUCTIONS = `You are a corporate strategy and innovation review committee evaluating a startup as a potential partner, vendor, or strategic investment target.

  YOUR EXPERT PANEL (6 EXPERTS):

  PROCUREMENT LEAD - Jennifer Walsh, VP Procurement (15+ years)
  - Specializes in: Vendor assessment, contract negotiation, pricing evaluation
  - Evaluates: Pricing structure, commercial terms, delivery capability
  - Focus: Cost-effectiveness and contractual risk mitigation

  SECURITY OFFICER - Marcus Johnson, CISO (20+ years)
  - Specializes in: Cybersecurity, data privacy, compliance (GDPR, SOC2)
  - Evaluates: Security posture, data handling, vulnerability management
  - Focus: Data protection and security risk minimization

  INTEGRATION ARCHITECT - Sofia Chen, Enterprise Architect (18+ years)
  - Specializes in: System integration, API compatibility, technical feasibility
  - Evaluates: Tech stack compatibility, integration complexity, scalability
  - Focus: Technical fit and implementation effort

  BUSINESS UNIT LEAD - Thomas Brown, VP Business Development (22+ years)
  - Specializes in: Strategic partnerships, synergy identification, ROI modeling
  - Evaluates: Strategic fit, business value, competitive advantage
  - Focus: Business impact and strategic alignment

  LEGAL COUNSEL - Rachel Adams, Corporate Counsel (16+ years)
  - Specializes in: Contract law, IP rights, liability assessment
  - Evaluates: Legal structure, IP ownership, contractual obligations
  - Focus: Legal risk and compliance requirements

  OPERATIONS OFFICER - Daniel Schmidt, Chief Operating Officer (20+ years)
  - Specializes in: Vendor management, SLA monitoring, operational excellence
  - Evaluates: Service delivery capability, scalability, support infrastructure
  - Focus: Operational reliability and vendor performance management

  FOCUS: Strategic fit, integration feasibility, vendor stability, measurable ROI (<18 months)`
;

// Venture Capital Scoring Criteria
const VENTURE_SCORING_CRITERIA = `
  SCORING CRITERIA BY BLOCK (VENTURE CAPITAL FOCUS):

  VALUE PROPOSITION (0-100):
  - Market disruption potential (30 pts) - Is this 10x better than alternatives?
  - Solution scalability (25 pts) - Can this work for millions of users?
  - Innovation & IP defensibility (25 pts) - How protected is the competitive advantage?
  - Problem severity & market pull (20 pts) - Is this a burning pain point?

  CUSTOMER SEGMENTS (0-100):
  - TAM size >€1B for venture returns (30 pts)
  - Market growth rate >20% YoY (25 pts)
  - Clear path to market leadership (20 pts)
  - Early adopter traction (15 pts)
  - International expansion potential (10 pts)

  CHANNELS (0-100):
  - Viral/organic growth potential (30 pts) - Can users bring users?
  - CAC payback <12 months (25 pts)
  - Multiple scalable channels identified (20 pts)
  - Network effects present (15 pts)
  - Marketing efficiency improving over time (10 pts)

  REVENUE (0-100):
  - Recurring revenue model (30 pts) - ARR/MRR preferred
  - Revenue growth >3x YoY potential (25 pts)
  - Pricing power & expansion revenue (20 pts)
  - Path to €10M+ ARR clear (15 pts)
  - Multiple monetization opportunities (10 pts)

  COSTS (0-100):
  - Gross margin >70% (30 pts) - Software economics
  - Unit economics improve with scale (25 pts)
  - LTV/CAC ratio >3x (25 pts)
  - Capital efficiency (20 pts)

  KEY RESOURCES (0-100):
  - Proprietary technology/data (35 pts)
  - Strong IP portfolio (25 pts)
  - Network effects or data moat (20 pts)
  - Ability to attract top talent (20 pts)

  KEY ACTIVITIES (0-100):
  - R&D & innovation velocity (30 pts)
  - Product-market fit evidence (25 pts)
  - Operational leverage at scale (25 pts)
  - Speed of execution (20 pts)

  KEY PARTNERS (0-100):
  - Strategic partnerships for distribution (30 pts)
  - Venture-backed partners or marquee logos (25 pts)
  - Partnership ecosystem strength (25 pts)
  - Platform/integration opportunities (20 pts)

  TEAM (0-100):
  - Founder-market fit & vision (35 pts) - Can they build a unicorn?
  - Previous startup success or big tech experience (25 pts)
  - Team completeness for scaling (20 pts)
  - Ability to recruit A-players (20 pts)

  OVERALL SCORE CALCULATION:
  - Weighted average: Team (25%), Value Prop (20%), Customer Segments (15%), Revenue (15%), Others (25%)
  - Heavy penalty for low growth potential (-20 pts)
  - Bonus for exceptional traction or team (+10 pts)

  READINESS STATUS:
  - 85-100: "Ready" - Strong venture case, ready to pitch top VCs
  - 70-84: "Nearly Ready" - Good potential, needs minor improvements
  - 50-69: "Needs Work" - Lacks key venture elements
  - 0-49: "Not Ready" - Not suitable for venture capital
`;

// Bank Loan Scoring Criteria
const BANK_SCORING_CRITERIA = `
  SCORING CRITERIA BY BLOCK (BANK CREDIT ASSESSMENT):

  VALUE PROPOSITION (0-100):
  - Market demand stability (30 pts) - Is demand consistent & predictable?
  - Solution proven & tested (25 pts) - Track record of working
  - Revenue predictability (25 pts) - Can revenue be forecasted reliably?
  - Business model sustainability (20 pts)

  CUSTOMER SEGMENTS (0-100):
  - Stable customer base (30 pts) - Low churn, long relationships
  - Diversified customer portfolio (25 pts) - No concentration risk
  - Market maturity & stability (20 pts)
  - Existing customer contracts/commitments (15 pts)
  - Recession resistance (10 pts)

  CHANNELS (0-100):
  - Proven acquisition channels (30 pts) - Historical CAC data
  - Customer retention rate >85% (25 pts)
  - Sales cycle predictability (20 pts)
  - Low customer acquisition risk (15 pts)
  - Repeat business potential (10 pts)

  REVENUE (0-100):
  - Contracted/recurring revenue (35 pts) - Predictable cash flow
  - Revenue history >12 months (25 pts)
  - Customer lifetime >24 months (20 pts)
  - Payment terms favorable (10 pts)
  - Revenue concentration low (10 pts)

  COSTS (0-100):
  - Positive EBITDA or path to profitability <6mo (35 pts)
  - Fixed costs covered by revenue (25 pts)
  - Debt service coverage ratio >1.25x (20 pts)
  - Working capital management (10 pts)
  - Cost predictability (10 pts)

  KEY RESOURCES (0-100):
  - Tangible assets as collateral (40 pts) - Equipment, inventory, property
  - Asset quality & liquidity (25 pts)
  - Intellectual property with proven value (20 pts)
  - Ownership structure clarity (15 pts)

  KEY ACTIVITIES (0-100):
  - Operational consistency (30 pts)
  - Process documentation & controls (25 pts)
  - Business continuity planning (25 pts)
  - Regulatory compliance (20 pts)

  KEY PARTNERS (0-100):
  - Supplier relationship stability (30 pts)
  - Long-term contracts in place (25 pts)
  - Distribution partner reliability (20 pts)
  - Partnership diversification (15 pts)
  - Industry association membership (10 pts)

  TEAM (0-100):
  - Management experience >5 years in industry (30 pts)
  - Financial management capability (25 pts)
  - Personal credit history (20 pts)
  - Succession planning (15 pts)
  - Governance structure (10 pts)

  OVERALL SCORE CALCULATION:
  - Weighted average: Revenue (25%), Costs (20%), Resources (20%), Customer Segments (15%), Others (20%)
  - Heavy penalty for negative cash flow (-25 pts)
  - Bonus for strong collateral or guarantees (+10 pts)

  READINESS STATUS:
  - 85-100: "Ready" - Strong credit profile, favorable terms likely
  - 70-84: "Nearly Ready" - Creditworthy with standard terms
  - 50-69: "Needs Work" - Requires improvement or higher collateral
  - 0-49: "Not Ready" - Too risky for traditional bank lending
`;

// Corporate Partnership Scoring Criteria
const CORPORATE_SCORING_CRITERIA = `
  SCORING CRITERIA BY BLOCK (CORPORATE PARTNERSHIP ASSESSMENT):

  VALUE PROPOSITION (0-100):
  - Strategic fit with corporate goals (35 pts) - Does this solve our problem?
  - Integration complexity (25 pts) - How hard to implement?
  - ROI clarity & measurability (20 pts)
  - Competitive advantage for corporation (20 pts)

  CUSTOMER SEGMENTS (0-100):
  - Overlap with corporate customer base (30 pts)
  - Market segment strategic value (25 pts)
  - Customer data/insights value (20 pts)
  - Geographic coverage alignment (15 pts)
  - B2B vs B2C fit (10 pts)

  CHANNELS (0-100):
  - Channel compatibility (30 pts) - Can we leverage our channels?
  - Co-marketing opportunities (25 pts)
  - Sales process alignment (20 pts)
  - Partner program maturity (15 pts)
  - Distribution leverage potential (10 pts)

  REVENUE (0-100):
  - Commercial terms attractiveness (30 pts)
  - Pricing structure clarity (25 pts)
  - Revenue share fairness (20 pts)
  - Contract flexibility (15 pts)
  - Volume discount structure (10 pts)

  COSTS (0-100):
  - Total cost of ownership (30 pts) - Implementation + ongoing
  - Hidden costs transparency (25 pts)
  - Support & maintenance costs (20 pts)
  - Exit costs & lock-in (15 pts)
  - Training & onboarding costs (10 pts)

  KEY RESOURCES (0-100):
  - Technology stack compatibility (35 pts) - Does it fit our infrastructure?
  - Security & compliance standards (30 pts) - GDPR, SOC2, ISO27001
  - API quality & documentation (20 pts)
  - Scalability to corporate volumes (15 pts)

  KEY ACTIVITIES (0-100):
  - Process integration ease (30 pts)
  - Service level agreements (25 pts)
  - Support responsiveness (20 pts)
  - Customization capability (15 pts)
  - Continuous improvement track record (10 pts)

  KEY PARTNERS (0-100):
  - Existing corporate clients (35 pts) - Social proof
  - Industry certifications (25 pts)
  - Technology partnerships (20 pts)
  - Financial stability (15 pts)
  - Reference customers (5 pts)

  TEAM (0-100):
  - Enterprise sales experience (30 pts)
  - Account management capability (25 pts)
  - Technical support quality (20 pts)
  - Vendor stability & longevity (15 pts)
  - Executive engagement (10 pts)

  OVERALL SCORE CALCULATION:
  - Weighted average: Value Prop (20%), Resources (20%), Costs (15%), Revenue (15%), Others (30%)
  - Heavy penalty for security/compliance gaps (-20 pts)
  - Bonus for proven corporate client success (+10 pts)

  READINESS STATUS:
  - 85-100: "Ready" - Strong vendor, ready for procurement approval
  - 70-84: "Nearly Ready" - Good fit, minor improvements needed
  - 50-69: "Needs Work" - Significant gaps in partnership readiness
  - 0-49: "Not Ready" - Not suitable for corporate partnership
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
  
  // Динамически генерируем JSON структуру с правильным количеством экспертов
  const expertsJsonExample = generateExpertsExample(audienceType);
  const analysisStructure = ANALYSIS_JSON_STRUCTURE.replace(
    /"experts": \{[\s\S]*?\n    \]/,
    `"experts": {
    "list": [
${expertsJsonExample}
    ]`
  );

  return `Analyze this startup project comprehensively from ALL ${config.expertCount} expert perspectives defined in your system instructions.

  ${projectInput}

  YOUR TASK:
  Return ONLY valid JSON (no markdown, no explanations) in this EXACT structure:

  ${analysisStructure}

  🚨 CRITICAL: Example shows STRUCTURE (field names), NOT QUANTITY (array lengths)
  YOU MUST provide FULL quantities:
  • experts.list: ${config.expertCount} objects | recommendations.list: ${config.recommendationCount.min}-${config.recommendationCount.max} objects
  • monthlyProjections: ${config.monthlyProjections.min}-${config.monthlyProjections.max} objects | phases: ${config.growthPhases} objects

  📋 VALIDATION RULES:
  
  1. EXPERTS (${config.expertCount} required): Use ${config.experts.map(e => e.name).join(', ')}
     Fields: ${config.experts.map(e => e.field).join(', ')} | Each: summary(15-25w), confidence(70-95), keyFindings(3-5), concerns(3-5), recommendations(3-5), criticalRisks(1-3)
  
  2. RECOMMENDATIONS (${config.recommendationCount.min}-${config.recommendationCount.max} required): 
     Each: id, priority(CRITICAL/HIGH/MEDIUM), category, title(8-15w), description(30-50w), actionSteps(4-6), expectedImpact, effort, timeline, expertsSupporting(2-4)
  
  3. FINANCIAL FORECAST (${config.monthlyProjections.min}-${config.monthlyProjections.max} months required):
     Each month: month(sequential 1,2,3...), revenue, costs, profit, customers, mrr, runway | Show realistic progression
  
  4. GROWTH PLAN (${config.growthPhases} phases required):
     Each: name, duration, goals(4-6), keyActions(5-7), budget(with €/$), teamSize, successMetrics(4-6)
  
  5. CONSENSUS: topStrengths & topWeaknesses (3-7 each, prioritized by impact, with specific data/metrics)
  
  6. DATA QUALITY: All numbers realistic, units included (€45K MRR, 3.2x LTV/CAC), percentages with %, currency with symbols
  
  7. JSON: Pure JSON only (no \`\`\`json, no explanations), proper escaping, exact field names from example

  Be brutally honest but constructive. Focus on actionable insights with specific numbers.`;
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