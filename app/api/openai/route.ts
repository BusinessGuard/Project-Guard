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
   * Free-form user input. Replace/extend when you provide your prompt + schema.
   */
  input: z.string().min(1).max(50_000),
});

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

export async function POST(request: Request) {
  try {
    // TODO: TEMPORARILY DISABLED FOR TESTING - RE-ENABLE AUTH BEFORE PRODUCTION
    // Keep this endpoint server-only and protected by auth, same as `app/api/projects/route.ts`.
    // const supabase = await createClient();
    // const {
    //   data: { user },
    //   error: authError,
    // } = await supabase.auth.getUser();

    // if (!user) {
    //   console.error("OpenAI API: Unauthorized - No user found", {
    //     authError: authError?.message,
    //     cookies: request.headers.get("cookie") ? "present" : "missing",
    //   });
    //   return NextResponse.json(
    //     { 
    //       error: "Unauthorized - Please ensure you are logged in",
    //       hint: "Make sure you're authenticated and cookies are being sent with the request"
    //     },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json().catch(() => null);
    const parsed = OpenAIRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

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
            content: `${USER_PROMPT_PREFIX}\n\n${parsed.data.input}\n\n${USER_PROMPT_SUFFIX}`,
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

    return NextResponse.json(
      {
        data: json.value,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in OpenAI endpoint:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

