import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * TODO (you will provide later):
 * - Replace/update prompts + schema as needed.
 * - Optionally validate the model's JSON against a schema (zod / JSON Schema).
 */
// Extracted from `prompts/EXAMPLE 1.md` and split into system + user prompt.
const SYSTEM_PROMPT = `
You are ProjectGuard AI, an elite panel of 6 startup evaluation experts who collectively analyze early-stage companies. You provide honest, data-driven assessments to help founders improve their businesses.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR EXPERT PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 **FINANCIAL EXPERT** - Maria Rodriguez, CFO & Financial Advisor
Background: 20+ years as CFO at 3 unicorn startups, advised 100+ early-stage companies
Expertise: Unit economics, financial modeling, burn rate optimization, fundraising strategy
Philosophy: "Show me the numbers. Cash is king, profitability is queen."
Focus Areas:
- Revenue model viability and scalability
- Cost structure efficiency
- Unit economics (LTV, CAC, payback period)
- Path to profitability
- Funding needs and runway
- Financial risk assessment

Evaluation Criteria:
✓ LTV/CAC ratio > 3 (excellent), 1-3 (acceptable), < 1 (critical issue)
✓ Gross margin > 70% for SaaS, > 40% for marketplace
✓ Payback period < 12 months
✓ Runway > 18 months
✓ Revenue growth realistic (not hockey stick without evidence)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 **MARKET ANALYST** - David Chen, Senior Market Researcher
Background: 15+ years analyzing startup markets, worked at CB Insights and Gartner
Expertise: Market sizing (TAM/SAM/SOM), competitive analysis, customer segmentation
Philosophy: "The market doesn't care about your product. Your product must care about the market."
Focus Areas:
- Market size and growth potential
- Customer segment definition and reachability
- Competitive landscape and positioning
- Market validation evidence
- Geographic expansion opportunities
- Market timing and trends

Evaluation Criteria:
✓ TAM > €500M (venture-scale opportunity)
✓ Customer segment clearly defined (not "everyone")
✓ Evidence of customer validation (LOIs, pilot customers, surveys)
✓ Competitive advantage articulated
✓ Market methodology transparent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **PRODUCT EXPERT** - Sarah Thompson, VP Product
Background: 12+ years building products at top startups (Stripe, Notion, Linear)
Expertise: Product-market fit, value proposition design, user experience, product roadmap
Philosophy: "Fall in love with the problem, not your solution."
Focus Areas:
- Problem-solution fit
- Value proposition clarity and uniqueness
- Product differentiation vs competitors
- Technical feasibility
- User experience and design
- Product roadmap realism

Evaluation Criteria:
✓ Problem is painful, frequent, and clearly articulated
✓ Solution is 10x better than alternatives (not just 2x)
✓ Unique value proposition (not "we're cheaper" or "better UX")
✓ Evidence of product-market fit (retention, NPS, testimonials)
✓ Defensibility through network effects, data, or technology

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 **MARKETING EXPERT** - Alex Kumar, Growth Marketing Director
Background: 10+ years scaling startups from 0 to millions of users, ex-Head of Growth at Uber
Expertise: Customer acquisition, growth hacking, viral loops, marketing funnels
Philosophy: "Distribution > Product. The best product without users is worthless."
Focus Areas:
- Customer acquisition channels
- CAC efficiency and scalability
- Marketing funnel optimization
- Growth strategy and tactics
- Brand positioning
- Viral/referral mechanics

Evaluation Criteria:
✓ CAC < 1/3 of LTV (sustainable unit economics)
✓ Multiple acquisition channels identified (not relying on one)
✓ Evidence of channel validation (tests, pilot campaigns)
✓ Realistic conversion rates (not "we'll convert at 10%")
✓ Scalable channels (not just founder's network)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ **RISK MANAGER** - James Foster, Enterprise Risk Consultant
Background: 18+ years in startup risk assessment, former VC partner, advised 200+ companies
Expertise: Risk identification, scenario planning, red flag detection, mitigation strategies
Philosophy: "Hope is not a strategy. Identify risks early, mitigate proactively."
Focus Areas:
- Technical risks (can it be built?)
- Financial risks (will funding run out?)
- Market risks (will customers buy?)
- Team risks (can they execute?)
- Legal/regulatory risks
- Competitive risks

Evaluation Criteria:
✓ Critical risks identified and acknowledged
✓ Mitigation plans in place
✓ Realistic about challenges
✓ No "it will go viral" or "we have no competitors" delusions
✓ Contingency planning for worst-case scenarios

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚙️ **OPERATIONS EXPERT** - Lisa Wang, COO & Operations Consultant
Background: 15+ years scaling startup operations, took 2 companies from 10 to 500+ employees
Expertise: Team building, resource allocation, process design, operational efficiency
Philosophy: "Strategy without execution is hallucination."
Focus Areas:
- Team capabilities and gaps
- Founder/leadership quality
- Resource sufficiency
- Partnership strategy
- Operational readiness
- Execution track record

Evaluation Criteria:
✓ Team has relevant expertise
✓ Founders have complementary skills
✓ Key hires identified and planned
✓ Resources aligned with goals
✓ Evidence of execution (not just ideas)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANALYSIS METHODOLOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Each expert independently evaluates relevant blocks (1-9 scale per block)
2. Experts provide specific findings (not generic advice like "improve marketing")
3. Experts identify concerns and red flags
4. Experts give concrete, actionable recommendations
5. Experts state confidence level (0-100) based on data quality
6. Panel identifies consensus (where experts agree) and disagreements
7. Final scores weighted by expert confidence

SCORING PHILOSOPHY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- 90-100: Exceptional - Top 5% of startups, investor-ready
- 80-89:  Excellent - Strong fundamentals, minor improvements needed
- 70-79:  Good - Solid foundation, some gaps to address
- 60-69:  Fair - Viable but needs significant work
- 50-59:  Weak - Major issues, pivot may be needed
- 0-49:   Critical - Fundamental problems, high risk of failure

RESPONSE REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Be specific: "Your CAC of €75 is too high for €50 ARPU" not "reduce CAC"
✓ Use data: Reference numbers from project description
✓ Be honest: Don't sugarcoat critical issues
✓ Be constructive: Every criticism must include actionable solution
✓ Be realistic: Don't suggest "raise $10M" if not investor-ready
✓ Show work: Explain reasoning behind scores
✓ Prioritize: Focus on biggest levers for improvement

You MUST respond in valid JSON format exactly matching the schema provided in the user prompt.
`.trim();

const USER_PROMPT_PREFIX = `
Analyze this startup project comprehensively from all 6 expert perspectives.

Below is the startup/project input to analyze (it replaces the sample in EXAMPLE 1).
`.trim();

const USER_PROMPT_SUFFIX = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Provide a comprehensive analysis in EXACT JSON format. Each expert must:

1. Evaluate relevant blocks (0-100 score per block)
2. Provide specific findings (reference actual data from above)
3. List concrete concerns (not generic statements)
4. Give actionable recommendations (with specific steps)
5. State confidence level (0-100) based on data completeness

Also generate:
- Consensus findings (where experts agree)
- Growth roadmap (3 phases: Months 1-3, 4-6, 7-12)
- Financial forecast (12-month projections)
- Prioritized recommendations

RESPOND IN THIS EXACT JSON STRUCTURE:

{
  "overallScore": <number 0-100>,
  "investmentReadiness": "<ready|nearly-ready|needs-work|not-ready>",

  "blockScores": {
    "valueProposition": <0-100>,
    "customerSegments": <0-100>,
    "channels": <0-100>,
    "revenue": <0-100>,
    "costs": <0-100>,
    "keyResources": <0-100>,
    "keyActivities": <0-100>,
    "keyPartners": <0-100>,
    "team": <0-100>
  },

  "expertInsights": {
    "financialExpert": {
      "summary": "<2-3 sentence executive summary>",
      "keyFindings": [
        "<specific finding 1>",
        "<specific finding 2>",
        "<specific finding 3>"
      ],
      "concerns": [
        "<specific concern 1>",
        "<specific concern 2>",
        "<specific concern 3>"
      ],
      "recommendations": [
        "<actionable recommendation 1>",
        "<actionable recommendation 2>",
        "<actionable recommendation 3>"
      ],
      "confidence": <0-100>,
      "blocksAnalyzed": ["revenue", "costs"]
    },

    "marketAnalyst": {
      "summary": "<executive summary>",
      "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"],
      "concerns": ["<concern 1>", "<concern 2>", "<concern 3>"],
      "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"],
      "confidence": <0-100>,
      "blocksAnalyzed": ["customerSegments", "valueProposition"]
    },

    "productExpert": {
      "summary": "<executive summary>",
      "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"],
      "concerns": ["<concern 1>", "<concern 2>", "<concern 3>"],
      "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"],
      "confidence": <0-100>,
      "blocksAnalyzed": ["valueProposition"]
    },

    "marketingExpert": {
      "summary": "<executive summary>",
      "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"],
      "concerns": ["<concern 1>", "<concern 2>", "<concern 3>"],
      "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"],
      "confidence": <0-100>,
      "blocksAnalyzed": ["channels"]
    },

    "riskManager": {
      "summary": "<executive summary>",
      "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"],
      "criticalRisks": [
        {
          "category": "<technical|financial|market|team|legal>",
          "description": "<specific risk>",
          "likelihood": "<low|medium|high>",
          "impact": "<low|medium|high|critical>",
          "mitigation": "<specific mitigation strategy>"
        }
      ],
      "concerns": ["<concern 1>", "<concern 2>"],
      "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"],
      "confidence": <0-100>,
      "blocksAnalyzed": ["all"]
    },

    "opsExpert": {
      "summary": "<executive summary>",
      "keyFindings": ["<finding 1>", "<finding 2>", "<finding 3>"],
      "concerns": ["<concern 1>", "<concern 2>", "<concern 3>"],
      "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"],
      "confidence": <0-100>,
      "blocksAnalyzed": ["team", "keyResources", "keyActivities", "keyPartners"]
    }
  },

  "consensusFindings": {
    "topStrengths": [
      "<strength that 4+ experts agree on>",
      "<another strength>"
    ],
    "topWeaknesses": [
      "<weakness that 4+ experts agree on>",
      "<another weakness>"
    ],
    "criticalActions": [
      "<must-fix before launch action 1>",
      "<must-fix before launch action 2>",
      "<must-fix before launch action 3>"
    ],
    "disagreements": [
      {
        "topic": "<topic experts disagree on>",
        "expertOpinions": [
          {"expert": "financialExpert", "opinion": "<their take>"},
          {"expert": "marketAnalyst", "opinion": "<different take>"}
        ]
      }
    ]
  },

  "growthPlan": {
    "phase1": {
      "name": "Validation & MVP",
      "duration": "Months 1-3",
      "goals": [
        "<specific measurable goal 1>",
        "<specific measurable goal 2>",
        "<specific measurable goal 3>"
      ],
      "keyActions": [
        "<action 1>",
        "<action 2>",
        "<action 3>",
        "<action 4>",
        "<action 5>"
      ],
      "budget": "€<amount>",
      "teamSize": "<number> people",
      "successMetrics": [
        "<metric 1: target>",
        "<metric 2: target>"
      ]
    },

    "phase2": {
      "name": "Launch & Early Growth",
      "duration": "Months 4-6",
      "goals": ["<goal 1>", "<goal 2>", "<goal 3>"],
      "keyActions": ["<action 1>", "<action 2>", "<action 3>", "<action 4>", "<action 5>"],
      "budget": "€<amount>",
      "teamSize": "<number> people",
      "successMetrics": ["<metric: target>", "<metric: target>"]
    },

    "phase3": {
      "name": "Scale & Optimization",
      "duration": "Months 7-12",
      "goals": ["<goal 1>", "<goal 2>", "<goal 3>"],
      "keyActions": ["<action 1>", "<action 2>", "<action 3>", "<action 4>", "<action 5>"],
      "budget": "€<amount>",
      "teamSize": "<number> people",
      "successMetrics": ["<metric: target>", "<metric: target>"]
    },

    "milestones": [
      {
        "month": 2,
        "title": "<milestone title>",
        "description": "<what needs to be achieved>",
        "kpis": [
          {"metric": "<metric name>", "target": "<target value>"}
        ]
      },
      {
        "month": 4,
        "title": "<milestone title>",
        "description": "<description>",
        "kpis": [{"metric": "<metric>", "target": "<value>"}]
      },
      {
        "month": 6,
        "title": "<milestone>",
        "description": "<description>",
        "kpis": [{"metric": "<metric>", "target": "<value>"}]
      },
      {
        "month": 9,
        "title": "<milestone>",
        "description": "<description>",
        "kpis": [{"metric": "<metric>", "target": "<value>"}]
      },
      {
        "month": 12,
        "title": "<milestone>",
        "description": "<description>",
        "kpis": [{"metric": "<metric>", "target": "<value>"}]
      }
    ]
  },

  "recommendations": [
    {
      "id": "rec-1",
      "priority": "<CRITICAL|HIGH|MEDIUM|LOW>",
      "category": "<which block this relates to>",
      "title": "<concise title>",
      "description": "<detailed description>",
      "actionSteps": [
        "<concrete step 1>",
        "<concrete step 2>",
        "<concrete step 3>"
      ],
      "expectedImpact": "<what will improve and by how much>",
      "effort": "<Low|Medium|High>",
      "timeline": "<timeframe like '2-4 weeks'>",
      "expertsSupporting": ["<expert1>", "<expert2>"]
    }
  ],

  "financialForecast": {
    "unitEconomics": {
      "ltv": <number>,
      "cac": <number>,
      "ltvCacRatio": <number>,
      "paybackPeriod": <number months>,
      "assumptions": "<brief explanation of how calculated>"
    },

    "breakEvenAnalysis": {
      "breakEvenMonth": <month number>,
      "revenueAtBreakEven": <amount>,
      "customersAtBreakEven": <number>,
      "assumptions": "<brief explanation>"
    },

    "monthlyProjections": [
      {
        "month": 1,
        "revenue": <amount>,
        "costs": <amount>,
        "profit": <amount>,
        "customers": <number>,
        "mrr": <amount>,
        "runway": <months remaining>
      }
    ]
  }
}

CRITICAL REQUIREMENTS:
- Use actual numbers and data from the project description
- Be specific: "Your CAC of €450 is X% of your ARPU" not "CAC is high"
- Reference real competitors mentioned
- Flag missing data explicitly
- Don't be afraid to give low scores if warranted
- Every criticism must have an actionable solution
- Growth plan must be realistic based on current stage and resources
- Financial forecast must use actual numbers provided

BEGIN ANALYSIS NOW.
`.trim();

const OpenAIRequestSchema = z.object({
  /**
   * `projects.id` (UUID). We fetch the project from DB and build the prompt input from it.
   */
  projectId: z.string().uuid(),
});

// Test-only GET endpoint guard (so it can't be exposed accidentally).
// Set `PROJECTGUARD_ENABLE_OPENAI_TEST_GET=true` to enable.
const EnableTestGetSchema = z.literal("true");

const ProjectIdSchema = z.string().uuid();

function formatOptional(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
}

function projectToPromptInput(project: Record<string, unknown>): string {
  const lines: string[] = [];

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("PROJECT OVERVIEW");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push(`Project ID: ${formatOptional(project.id)}`);
  lines.push(`Name: ${formatOptional(project.name)}`);
  if (project.industry) lines.push(`Industry: ${formatOptional(project.industry)}`);
  if (project.stage) lines.push(`Stage: ${formatOptional(project.stage)}`);
  if (project.description) lines.push(`Description: ${formatOptional(project.description)}`);

  lines.push("");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  lines.push("BUSINESS MODEL CANVAS (DATA FROM DB)");
  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  lines.push("");
  lines.push("1️⃣ VALUE PROPOSITION");
  if (project.value_prop_problem) lines.push(`Problem Being Solved:\n${formatOptional(project.value_prop_problem)}`);
  if (project.value_prop_solution) lines.push(`\nSolution:\n${formatOptional(project.value_prop_solution)}`);
  if (project.value_prop_uniqueness) lines.push(`\nUnique Differentiation:\n${formatOptional(project.value_prop_uniqueness)}`);
  if (project.value_prop_measurable) lines.push(`\nMeasurable Value Created:\n${formatOptional(project.value_prop_measurable)}`);

  lines.push("");
  lines.push("2️⃣ CUSTOMER SEGMENTS");
  if (project.customer_primary_segment) {
    lines.push(`Primary Target Segment:\n${formatOptional(project.customer_primary_segment)}`);
  }
  if (project.customer_tam || project.customer_sam || project.customer_som) {
    lines.push("\nMarket Size:");
    if (project.customer_tam) lines.push(`- TAM: ${formatOptional(project.customer_tam)}`);
    if (project.customer_sam) lines.push(`- SAM: ${formatOptional(project.customer_sam)}`);
    if (project.customer_som) lines.push(`- SOM: ${formatOptional(project.customer_som)}`);
  }
  if (project.customer_geography) lines.push(`\nGeography:\n${formatOptional(project.customer_geography)}`);
  if (project.customer_wtp) lines.push(`\nWillingness to Pay:\n${formatOptional(project.customer_wtp)}`);
  if (project.customer_avg_check !== null && project.customer_avg_check !== undefined) {
    lines.push(`\nAverage Deal Size (customer_avg_check): €${formatOptional(project.customer_avg_check)}/month`);
  }

  lines.push("");
  lines.push("3️⃣ CHANNELS");
  if (project.channels_acquisition) {
    lines.push(`Customer Acquisition Channels (channels_acquisition):\n${formatOptional(project.channels_acquisition)}`);
  }
  if (project.channels_sales) lines.push(`\nPrimary Sales Channel:\n${formatOptional(project.channels_sales)}`);
  if (project.channels_cac !== null && project.channels_cac !== undefined) {
    lines.push(`\nCustomer Acquisition Cost (CAC): €${formatOptional(project.channels_cac)}`);
  }
  if (project.channels_marketing) {
    lines.push(`\nMarketing Tools Planned (channels_marketing):\n${formatOptional(project.channels_marketing)}`);
  }
  if (project.channels_funnel) lines.push(`\nMarketing Funnel:\n${formatOptional(project.channels_funnel)}`);

  lines.push("");
  lines.push("4️⃣ REVENUE MODEL");
  if (project.revenue_projected_12m !== null && project.revenue_projected_12m !== undefined) {
    lines.push(`Projected 12-Month Revenue: €${formatOptional(project.revenue_projected_12m)}`);
  }
  if (project.revenue_streams) lines.push(`\nRevenue Streams (revenue_streams):\n${formatOptional(project.revenue_streams)}`);
  if (project.revenue_pricing) lines.push(`\nPricing Structure (revenue_pricing):\n${formatOptional(project.revenue_pricing)}`);

  lines.push("");
  lines.push("5️⃣ COST STRUCTURE");
  if (project.cost_breakdown) lines.push(`Cost Breakdown (cost_breakdown):\n${formatOptional(project.cost_breakdown)}`);
  if (project.cost_gross_margin !== null && project.cost_gross_margin !== undefined) {
    lines.push(`\nGross Margin: ${formatOptional(project.cost_gross_margin)}%`);
  }
  if (project.cost_break_even !== null && project.cost_break_even !== undefined) {
    lines.push(`Break-Even Projection: Month ${formatOptional(project.cost_break_even)}`);
  }
  if (project.cost_burn_rate !== null && project.cost_burn_rate !== undefined) {
    lines.push(`Monthly Burn Rate: €${formatOptional(project.cost_burn_rate)}/month`);
  }
  if (project.cost_runway !== null && project.cost_runway !== undefined) {
    lines.push(`Current Runway: ${formatOptional(project.cost_runway)} months`);
  }

  lines.push("");
  lines.push("6️⃣ FUNDING");
  if (project.funding_raised !== null && project.funding_raised !== undefined) {
    lines.push(`Amount Raised: €${formatOptional(project.funding_raised)}`);
  }
  if (project.funding_sought !== null && project.funding_sought !== undefined) {
    lines.push(`Amount Seeking: €${formatOptional(project.funding_sought)}`);
  }
  if (project.funding_sources) lines.push(`Funding Sources (funding_sources):\n${formatOptional(project.funding_sources)}`);

  lines.push("");
  lines.push("7️⃣ TEAM");
  if (project.team_founders) lines.push(`Founders (team_founders):\n${formatOptional(project.team_founders)}`);
  if (project.team_key_hires) lines.push(`\nKey Hires (team_key_hires):\n${formatOptional(project.team_key_hires)}`);
  if (project.team_advisors) lines.push(`\nAdvisors (team_advisors):\n${formatOptional(project.team_advisors)}`);
  if (project.team_gaps) lines.push(`\nSkill Gaps (team_gaps):\n${formatOptional(project.team_gaps)}`);

  lines.push("");
  lines.push("8️⃣ KEY RESOURCES");
  if (project.resources_physical) lines.push(`Physical Resources:\n${formatOptional(project.resources_physical)}`);
  if (project.resources_intellectual) lines.push(`\nIntellectual Property:\n${formatOptional(project.resources_intellectual)}`);
  if (project.resources_human) lines.push(`\nHuman Resources:\n${formatOptional(project.resources_human)}`);
  if (project.resources_financial) lines.push(`\nFinancial Resources:\n${formatOptional(project.resources_financial)}`);
  if (project.resources_network) lines.push(`\nNetwork/Relationships:\n${formatOptional(project.resources_network)}`);

  lines.push("");
  lines.push("9️⃣ KEY ACTIVITIES");
  if (project.activities_production) lines.push(`Production/Delivery:\n${formatOptional(project.activities_production)}`);
  if (project.activities_innovation) lines.push(`\nInnovation/R&D:\n${formatOptional(project.activities_innovation)}`);
  if (project.activities_platform) lines.push(`\nPlatform/Infrastructure:\n${formatOptional(project.activities_platform)}`);
  if (project.activities_marketing) lines.push(`\nMarketing/Sales:\n${formatOptional(project.activities_marketing)}`);
  if (project.activities_operations) lines.push(`\nOperations:\n${formatOptional(project.activities_operations)}`);

  lines.push("");
  lines.push("🔟 KEY PARTNERS");
  if (project.partners_strategic) lines.push(`Strategic Partnerships (partners_strategic):\n${formatOptional(project.partners_strategic)}`);

  lines.push("");
  lines.push("ADDITIONAL CONTEXT");
  if (project.competitors) lines.push(`Competitors:\n${formatOptional(project.competitors)}`);
  if (project.risks) lines.push(`\nKnown Risks:\n${formatOptional(project.risks)}`);
  if (project.traction) lines.push(`\nCurrent Traction:\n${formatOptional(project.traction)}`);
  if (project.growth_plan) lines.push(`\nGrowth Plans:\n${formatOptional(project.growth_plan)}`);

  return lines.filter((l) => l !== "").join("\n");
}

/**
 * JSON Schema extracted/derived from `prompts/EXAMPLE 1.md`:
 * the "RESPOND IN THIS EXACT JSON STRUCTURE" block.
 *
 * Used as an OpenAI `response_format` parameter to force structured JSON output.
 */
const PROJECT_GUARD_ANALYSIS_JSON_SCHEMA = {
  name: "projectguard_startup_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: [
      "overallScore",
      "investmentReadiness",
      "blockScores",
      "expertInsights",
      "consensusFindings",
      "growthPlan",
      "recommendations",
      "financialForecast",
    ],
    properties: {
      overallScore: { type: "number", minimum: 0, maximum: 100 },
      investmentReadiness: {
        type: "string",
        enum: ["ready", "nearly-ready", "needs-work", "not-ready"],
      },
      blockScores: {
        type: "object",
        additionalProperties: false,
        required: [
          "valueProposition",
          "customerSegments",
          "channels",
          "revenue",
          "costs",
          "keyResources",
          "keyActivities",
          "keyPartners",
          "team",
        ],
        properties: {
          valueProposition: { type: "number", minimum: 0, maximum: 100 },
          customerSegments: { type: "number", minimum: 0, maximum: 100 },
          channels: { type: "number", minimum: 0, maximum: 100 },
          revenue: { type: "number", minimum: 0, maximum: 100 },
          costs: { type: "number", minimum: 0, maximum: 100 },
          keyResources: { type: "number", minimum: 0, maximum: 100 },
          keyActivities: { type: "number", minimum: 0, maximum: 100 },
          keyPartners: { type: "number", minimum: 0, maximum: 100 },
          team: { type: "number", minimum: 0, maximum: 100 },
        },
      },
      expertInsights: {
        type: "object",
        additionalProperties: false,
        required: [
          "financialExpert",
          "marketAnalyst",
          "productExpert",
          "marketingExpert",
          "riskManager",
          "opsExpert",
        ],
        properties: {
          financialExpert: {
            type: "object",
            additionalProperties: false,
            required: [
              "summary",
              "keyFindings",
              "concerns",
              "recommendations",
              "confidence",
              "blocksAnalyzed",
            ],
            properties: {
              summary: { type: "string" },
              keyFindings: { type: "array", items: { type: "string" } },
              concerns: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
              confidence: { type: "number", minimum: 0, maximum: 100 },
              blocksAnalyzed: { type: "array", items: { type: "string" } },
            },
          },
          marketAnalyst: {
            type: "object",
            additionalProperties: false,
            required: [
              "summary",
              "keyFindings",
              "concerns",
              "recommendations",
              "confidence",
              "blocksAnalyzed",
            ],
            properties: {
              summary: { type: "string" },
              keyFindings: { type: "array", items: { type: "string" } },
              concerns: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
              confidence: { type: "number", minimum: 0, maximum: 100 },
              blocksAnalyzed: { type: "array", items: { type: "string" } },
            },
          },
          productExpert: {
            type: "object",
            additionalProperties: false,
            required: [
              "summary",
              "keyFindings",
              "concerns",
              "recommendations",
              "confidence",
              "blocksAnalyzed",
            ],
            properties: {
              summary: { type: "string" },
              keyFindings: { type: "array", items: { type: "string" } },
              concerns: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
              confidence: { type: "number", minimum: 0, maximum: 100 },
              blocksAnalyzed: { type: "array", items: { type: "string" } },
            },
          },
          marketingExpert: {
            type: "object",
            additionalProperties: false,
            required: [
              "summary",
              "keyFindings",
              "concerns",
              "recommendations",
              "confidence",
              "blocksAnalyzed",
            ],
            properties: {
              summary: { type: "string" },
              keyFindings: { type: "array", items: { type: "string" } },
              concerns: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
              confidence: { type: "number", minimum: 0, maximum: 100 },
              blocksAnalyzed: { type: "array", items: { type: "string" } },
            },
          },
          riskManager: {
            type: "object",
            additionalProperties: false,
            required: [
              "summary",
              "keyFindings",
              "criticalRisks",
              "concerns",
              "recommendations",
              "confidence",
              "blocksAnalyzed",
            ],
            properties: {
              summary: { type: "string" },
              keyFindings: { type: "array", items: { type: "string" } },
              criticalRisks: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["category", "description", "likelihood", "impact", "mitigation"],
                  properties: {
                    category: {
                      type: "string",
                      enum: ["technical", "financial", "market", "team", "legal"],
                    },
                    description: { type: "string" },
                    likelihood: { type: "string", enum: ["low", "medium", "high"] },
                    impact: { type: "string", enum: ["low", "medium", "high", "critical"] },
                    mitigation: { type: "string" },
                  },
                },
              },
              concerns: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
              confidence: { type: "number", minimum: 0, maximum: 100 },
              blocksAnalyzed: { type: "array", items: { type: "string" } },
            },
          },
          opsExpert: {
            type: "object",
            additionalProperties: false,
            required: [
              "summary",
              "keyFindings",
              "concerns",
              "recommendations",
              "confidence",
              "blocksAnalyzed",
            ],
            properties: {
              summary: { type: "string" },
              keyFindings: { type: "array", items: { type: "string" } },
              concerns: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
              confidence: { type: "number", minimum: 0, maximum: 100 },
              blocksAnalyzed: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
      consensusFindings: {
        type: "object",
        additionalProperties: false,
        required: ["topStrengths", "topWeaknesses", "criticalActions", "disagreements"],
        properties: {
          topStrengths: { type: "array", items: { type: "string" } },
          topWeaknesses: { type: "array", items: { type: "string" } },
          criticalActions: { type: "array", items: { type: "string" } },
          disagreements: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["topic", "expertOpinions"],
              properties: {
                topic: { type: "string" },
                expertOpinions: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["expert", "opinion"],
                    properties: {
                      expert: { type: "string" },
                      opinion: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      growthPlan: {
        type: "object",
        additionalProperties: false,
        required: ["phase1", "phase2", "phase3", "milestones"],
        properties: {
          phase1: {
            type: "object",
            additionalProperties: false,
            required: ["name", "duration", "goals", "keyActions", "budget", "teamSize", "successMetrics"],
            properties: {
              name: { type: "string" },
              duration: { type: "string" },
              goals: { type: "array", items: { type: "string" } },
              keyActions: { type: "array", items: { type: "string" } },
              budget: { type: "string" },
              teamSize: { type: "string" },
              successMetrics: { type: "array", items: { type: "string" } },
            },
          },
          phase2: {
            type: "object",
            additionalProperties: false,
            required: ["name", "duration", "goals", "keyActions", "budget", "teamSize", "successMetrics"],
            properties: {
              name: { type: "string" },
              duration: { type: "string" },
              goals: { type: "array", items: { type: "string" } },
              keyActions: { type: "array", items: { type: "string" } },
              budget: { type: "string" },
              teamSize: { type: "string" },
              successMetrics: { type: "array", items: { type: "string" } },
            },
          },
          phase3: {
            type: "object",
            additionalProperties: false,
            required: ["name", "duration", "goals", "keyActions", "budget", "teamSize", "successMetrics"],
            properties: {
              name: { type: "string" },
              duration: { type: "string" },
              goals: { type: "array", items: { type: "string" } },
              keyActions: { type: "array", items: { type: "string" } },
              budget: { type: "string" },
              teamSize: { type: "string" },
              successMetrics: { type: "array", items: { type: "string" } },
            },
          },
          milestones: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["month", "title", "description", "kpis"],
              properties: {
                month: { type: "number" },
                title: { type: "string" },
                description: { type: "string" },
                kpis: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["metric", "target"],
                    properties: {
                      metric: { type: "string" },
                      target: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "id",
            "priority",
            "category",
            "title",
            "description",
            "actionSteps",
            "expectedImpact",
            "effort",
            "timeline",
            "expertsSupporting",
          ],
          properties: {
            id: { type: "string" },
            priority: { type: "string", enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
            category: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            actionSteps: { type: "array", items: { type: "string" } },
            expectedImpact: { type: "string" },
            effort: { type: "string", enum: ["Low", "Medium", "High"] },
            timeline: { type: "string" },
            expertsSupporting: { type: "array", items: { type: "string" } },
          },
        },
      },
      financialForecast: {
        type: "object",
        additionalProperties: false,
        required: ["unitEconomics", "breakEvenAnalysis", "monthlyProjections"],
        properties: {
          unitEconomics: {
            type: "object",
            additionalProperties: false,
            required: ["ltv", "cac", "ltvCacRatio", "paybackPeriod", "assumptions"],
            properties: {
              ltv: { type: "number" },
              cac: { type: "number" },
              ltvCacRatio: { type: "number" },
              paybackPeriod: { type: "number" },
              assumptions: { type: "string" },
            },
          },
          breakEvenAnalysis: {
            type: "object",
            additionalProperties: false,
            required: ["breakEvenMonth", "revenueAtBreakEven", "customersAtBreakEven", "assumptions"],
            properties: {
              breakEvenMonth: { type: "number" },
              revenueAtBreakEven: { type: "number" },
              customersAtBreakEven: { type: "number" },
              assumptions: { type: "string" },
            },
          },
          monthlyProjections: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["month", "revenue", "costs", "profit", "customers", "mrr", "runway"],
              properties: {
                month: { type: "number" },
                revenue: { type: "number" },
                costs: { type: "number" },
                profit: { type: "number" },
                customers: { type: "number" },
                mrr: { type: "number" },
                runway: { type: "number" },
              },
            },
          },
        },
      },
    },
  },
} as const;

function safeJsonParse(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to parse JSON",
    };
  }
}

type AnalysisJson = {
  overallScore: number;
  investmentReadiness: string;
  blockScores: {
    valueProposition: number;
    customerSegments: number;
    channels: number;
    revenue: number;
    costs: number;
    keyResources: number;
    keyActivities: number;
    keyPartners: number;
    team: number;
  };
  expertInsights: unknown;
  consensusFindings: unknown;
  growthPlan: unknown;
  recommendations: unknown;
  financialForecast: unknown;
};

function isAnalysisJson(value: unknown): value is AnalysisJson {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  const bs = v.blockScores as Record<string, unknown> | undefined;
  return (
    typeof v.overallScore === "number" &&
    typeof v.investmentReadiness === "string" &&
    !!bs &&
    typeof bs.valueProposition === "number" &&
    typeof bs.customerSegments === "number" &&
    typeof bs.channels === "number" &&
    typeof bs.revenue === "number" &&
    typeof bs.costs === "number" &&
    typeof bs.keyResources === "number" &&
    typeof bs.keyActivities === "number" &&
    typeof bs.keyPartners === "number" &&
    typeof bs.team === "number" &&
    v.expertInsights !== undefined &&
    v.consensusFindings !== undefined &&
    v.growthPlan !== undefined &&
    v.recommendations !== undefined &&
    v.financialForecast !== undefined
  );
}

async function saveAnalysisToDb(args: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  projectId: string;
  analysis: AnalysisJson;
  aiModel: string;
  tokensUsed?: number | null;
  processingTimeMs?: number | null;
}) {
  const { supabase, projectId, analysis, aiModel, tokensUsed, processingTimeMs } = args;

  const payload = {
    project_id: projectId,
    overall_score: analysis.overallScore,
    investment_readiness: analysis.investmentReadiness,

    value_proposition_score: analysis.blockScores.valueProposition,
    customer_segments_score: analysis.blockScores.customerSegments,
    channels_score: analysis.blockScores.channels,
    revenue_score: analysis.blockScores.revenue,
    costs_score: analysis.blockScores.costs,
    key_resources_score: analysis.blockScores.keyResources,
    key_activities_score: analysis.blockScores.keyActivities,
    key_partners_score: analysis.blockScores.keyPartners,
    team_score: analysis.blockScores.team,

    expert_insights: analysis.expertInsights,
    consensus_findings: analysis.consensusFindings,
    growth_plan: analysis.growthPlan,
    recommendations: analysis.recommendations,
    financial_forecast: analysis.financialForecast,

    ai_model: aiModel,
    tokens_used: tokensUsed ?? null,
    processing_time: processingTimeMs ?? null,
    status: "completed",
  };

  const { data, error } = await supabase.from("analyses").insert(payload).select("id").single();
  return { data, error };
}

/**
 * TESTING ONLY:
 * GET /api/openai?projectId=<uuid>
 *
 * Controlled by env flag `PROJECTGUARD_ENABLE_OPENAI_TEST_GET=true`.
 * This endpoint is intended for quick manual testing and should be removed later.
 */
export async function GET(request: Request) {
  const enable = EnableTestGetSchema.safeParse(process.env.PROJECTGUARD_ENABLE_OPENAI_TEST_GET);
  if (!enable.success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const projectIdParam = url.searchParams.get("projectId");
  const projectIdParsed = ProjectIdSchema.safeParse(projectIdParam);
  if (!projectIdParsed.success) {
    return NextResponse.json(
      { error: "Missing or invalid projectId (expected UUID)" },
      { status: 400 }
    );
  }

  try {
    const startedAt = Date.now();
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();

    const user = authData.user;
    if (!user) {
      console.error("OpenAI API (GET): Unauthorized - No user found", {
        authError: authError?.message,
        cookies: request.headers.get("cookie") ? "present" : "missing",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectQuery = supabase
      .from("projects")
      .select("*")
      .eq("id", projectIdParsed.data);

    // TESTING ONLY: don't scope by user_id; we only require that the caller is signed in.
    // This helps when legacy/test data doesn't have `projects.user_id` aligned with Supabase Auth user ids.
    const scopedQuery = projectQuery;

    // Debug logging around Supabase fetch (kept minimal + focused, no prompt contents).
    console.log("OpenAI API (GET): Loading project from Supabase", {
      projectId: projectIdParsed.data,
      userId: user ? user.id : null,
      supabaseUrlPresent: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseAnonKeyPresent: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    });

    const { data: project, error: projectError } = await scopedQuery.maybeSingle();

    if (projectError) {
      console.error("OpenAI API (GET): Failed to load project", {
        projectId: projectIdParsed.data,
        userId: user ? user.id : null,
        supabaseError: projectError,
        errorMessage: projectError.message,
      });
      return NextResponse.json(
        { error: "Failed to load project", details: projectError.message },
        { status: 500 }
      );
    }

    if (!project) {
      console.warn("OpenAI API (GET): Project not found (Supabase returned null)", {
        projectId: projectIdParsed.data,
        userId: user ? user.id : null,
      });
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log("OpenAI API (GET): Project loaded", {
      projectId: projectIdParsed.data,
      userId: user ? user.id : null,
      name: (project as { name?: unknown } | null)?.name ?? null,
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfigured: missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 1,
        response_format: { type: "json_schema", json_schema: PROJECT_GUARD_ANALYSIS_JSON_SCHEMA },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `${USER_PROMPT_PREFIX}\n\n${projectToPromptInput(project as unknown as Record<string, unknown>)}\n\n${USER_PROMPT_SUFFIX}`,
          },
        ],
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        {
          error: "OpenAI request failed",
          status: upstream.status,
          details: text || upstream.statusText,
        },
        { status: 502 }
      );
    }

    const completion = (await upstream.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
      usage?: { total_tokens?: number | null };
    };

    const content = completion.choices?.[0]?.message?.content ?? "";
    const json = safeJsonParse(content);
    if (!json.ok) {
      return NextResponse.json(
        {
          error: "OpenAI did not return valid JSON",
          parseError: json.error,
          raw: content,
        },
        { status: 502 }
      );
    }

    if (!isAnalysisJson(json.value)) {
      return NextResponse.json(
        { error: "OpenAI returned JSON, but it does not match the expected analysis shape" },
        { status: 502 }
      );
    }

    const save = await saveAnalysisToDb({
      supabase,
      projectId: projectIdParsed.data,
      analysis: json.value,
      aiModel: model,
      tokensUsed: completion.usage?.total_tokens ?? null,
      processingTimeMs: Date.now() - startedAt,
    });

    if (save.error || !save.data) {
      console.error("OpenAI API (GET): Failed to save analysis", {
        projectId: projectIdParsed.data,
        errorMessage: save.error?.message ?? "No data returned from insert",
        supabaseError: save.error,
      });
      return NextResponse.json(
        { error: "Failed to save analysis", details: save.error?.message ?? "No data returned from insert" },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysisId: save.data.id, data: json.value }, { status: 200 });
  } catch (error) {
    console.error("Error in OpenAI endpoint (GET):", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const startedAt = Date.now();
    // Keep this endpoint server-only and protected by auth, same as `app/api/projects/route.ts`.
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();

    const user = authData.user;

    if (!user) {
      console.error("OpenAI API: Unauthorized - No user found", {
        authError: authError?.message,
        cookies: request.headers.get("cookie") ? "present" : "missing",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsedBody = OpenAIRequestSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsedBody.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Fetch project data by `projects.id`.
    // When auth is enabled, scope by ownership (user_id) to prevent data leaks.
    const projectQuery = supabase
      .from("projects")
      .select("*")
      .eq("id", parsedBody.data.projectId);

    const scopedQuery = projectQuery.eq("user_id", user.id);

    // Debug logging around Supabase fetch (kept minimal + focused, no prompt contents).
    console.log("OpenAI API: Loading project from Supabase", {
      projectId: parsedBody.data.projectId,
      userId: user ? user.id : null,
      supabaseUrlPresent: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseAnonKeyPresent: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    });

    const { data: parsed, error: projectError } = await scopedQuery.maybeSingle();

    if (projectError) {
      console.error("OpenAI API: Failed to load project", {
        projectId: parsedBody.data.projectId,
        userId: user ? user.id : null,
        supabaseError: projectError,
        errorMessage: projectError.message,
      });
      return NextResponse.json(
        { error: "Failed to load project", details: projectError.message },
        { status: 500 }
      );
    }

    if (!parsed) {
      console.warn("OpenAI API: Project not found (Supabase returned null)", {
        projectId: parsedBody.data.projectId,
        userId: user ? user.id : null,
      });
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    console.log("OpenAI API: Project loaded", {
      projectId: parsedBody.data.projectId,
      userId: user ? user.id : null,
      name: (parsed as { name?: unknown } | null)?.name ?? null,
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server misconfigured: missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // You can override via env; default chosen for cost-effective JSON output.
    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 1,
        response_format: { type: "json_schema", json_schema: PROJECT_GUARD_ANALYSIS_JSON_SCHEMA },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `${USER_PROMPT_PREFIX}\n\n${projectToPromptInput(parsed as unknown as Record<string, unknown>)}\n\n${USER_PROMPT_SUFFIX}`,
          },
        ],
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        {
          error: "OpenAI request failed",
          status: upstream.status,
          details: text || upstream.statusText,
        },
        { status: 502 }
      );
    }

    const completion = (await upstream.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
      usage?: { total_tokens?: number | null };
    };

    const content = completion.choices?.[0]?.message?.content ?? "";
    const json = safeJsonParse(content);
    if (!json.ok) {
      return NextResponse.json(
        {
          error: "OpenAI did not return valid JSON",
          parseError: json.error,
          raw: content,
        },
        { status: 502 }
      );
    }

    if (!isAnalysisJson(json.value)) {
      return NextResponse.json(
        { error: "OpenAI returned JSON, but it does not match the expected analysis shape" },
        { status: 502 }
      );
    }

    const save = await saveAnalysisToDb({
      supabase,
      projectId: parsedBody.data.projectId,
      analysis: json.value,
      aiModel: model,
      tokensUsed: completion.usage?.total_tokens ?? null,
      processingTimeMs: Date.now() - startedAt,
    });

    if (save.error || !save.data) {
      console.error("OpenAI API: Failed to save analysis", {
        projectId: parsedBody.data.projectId,
        userId: user.id,
        errorMessage: save.error?.message ?? "No data returned from insert",
        supabaseError: save.error,
      });
      return NextResponse.json(
        { error: "Failed to save analysis", details: save.error?.message ?? "No data returned from insert" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        analysisId: save.data.id,
        data: json.value,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in OpenAI endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

