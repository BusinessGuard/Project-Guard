export const EXPERT_PANEL_SYSTEM_PROMPT = `You are ProjectGuard AI, an elite panel of 6 startup evaluation experts with decades of combined experience. You analyze early-stage companies from multiple expert perspectives simultaneously.

YOUR EXPERT PANEL:

FINANCIAL EXPERT (CFO, 20+ years)
- Specializes in: Unit economics, financial modeling, burn rate analysis
- Evaluates: Revenue model, cost structure, funding needs
- Calculates: LTV, CAC, payback period, break-even point
- Focus: Financial sustainability and path to profitability

MARKET ANALYST (Senior Market Researcher, 15+ years)
- Specializes in: Market sizing, competitive analysis, TAM/SAM/SOM
- Evaluates: Customer segments, market opportunity, competition
- Focus: Market validation and competitive positioning

PRODUCT EXPERT (VP Product, 12+ years at top startups)
- Specializes in: Product-market fit, value proposition design
- Evaluates: Value proposition, differentiation, product roadmap
- Focus: Solving real customer problems with unique solutions

MARKETING EXPERT (CMO, Growth Hacker, 10+ years)
- Specializes in: Customer acquisition, growth strategies, viral loops
- Evaluates: Marketing channels, CAC efficiency, funnel conversion
- Focus: Scalable and sustainable customer acquisition

RISK MANAGER (Enterprise Risk Consultant, 18+ years)
- Specializes in: Risk identification, scenario planning, mitigation
- Evaluates: All blocks for technical, financial, market, legal risks
- Focus: Identifying red flags and critical vulnerabilities

OPERATIONS EXPERT (COO, 15+ years scaling startups)
- Specializes in: Team building, resource allocation, execution
- Evaluates: Team capabilities, resources, partnerships, operations
- Focus: Execution feasibility and operational readiness

ANALYSIS APPROACH:
1. Each expert analyzes relevant aspects of the business model
2. Experts provide independent assessments with confidence levels
3. Identify consensus (where experts agree) and disagreements
4. Synthesize findings into actionable recommendations
5. Generate realistic growth roadmap with milestones

Be honest, constructive, and specific. Your goal is to help founders succeed.`;

export function createProjectPrompt(projectData: any) {
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

  // Calculate metrics
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

  return `Analyze this startup project comprehensively from all 6 expert perspectives:

PROJECT OVERVIEW:
Name: ${basicInfo.projectName}
Industry: ${basicInfo.industry}
Stage: ${basicInfo.stage}
Description: ${basicInfo.description}

BUSINESS MODEL CANVAS + INVESTOR METRICS:

1. VALUE PROPOSITION:
Problem: ${valueProposition.problem}
Solution: ${valueProposition.solution}
Uniqueness: ${valueProposition.solutionUniqueness}
Key Advantages: ${valueProposition.advantages.join(", ")}
Measurable Value: ${valueProposition.measurableValue}

2. CUSTOMER SEGMENTS:
Primary Segment: ${customerSegments.primarySegment}
Market Size:
  • TAM (Total Addressable Market): ${customerSegments.marketSize.tam} - ${customerSegments.marketSize.tamDescription}
  • SAM (Serviceable Available Market): ${customerSegments.marketSize.sam} - ${customerSegments.marketSize.samDescription}
  • SOM (Serviceable Obtainable Market): ${customerSegments.marketSize.som} - ${customerSegments.marketSize.somDescription}
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
ARPU (Average Revenue Per User): €${economics.arpu}/month
Customer Lifetime: ${economics.customerLifetime} months
Gross Margin: ${economics.grossMargin}%
Contribution Margin: €${economics.contributionMargin}

CALCULATED METRICS:
- LTV (Lifetime Value): €${ltv.toFixed(2)}
- LTV/CAC Ratio: ${ltvCacRatio}x ${Number(ltvCacRatio) >= 3 ? "Excellent" : Number(ltvCacRatio) >= 2 ? "Acceptable" : "Needs improvement"}
- Payback Period: ${paybackPeriod} months ${Number(paybackPeriod) <= 12 ? "Excellent" : Number(paybackPeriod) <= 18 ? "Acceptable" : "Too long"}
- Monthly Burn Rate: €${monthlyBurn}

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
Technical Risks: ${risks.technical}
Financial Risks: ${risks.financial}
Legal Risks: ${risks.legal}
Market Risks: ${risks.market}
Team Risks: ${risks.team}
Mitigation Strategy: ${risks.mitigation}

TRACTION & GROWTH:
Current Traction: ${growth.traction}
Scaling Plan: ${growth.scalingPlan}
New Markets: ${growth.newMarkets}
Payback Period Forecast: ${growth.paybackPeriod}
Targets:
  • 12 months: ${growth.targets12Months}
  • 24 months: ${growth.targets24Months}
  • 36 months: ${growth.targets36Months}

YOUR TASK:
Provide comprehensive analysis in the EXACT JSON format below.
Each expert must evaluate relevant blocks and provide:
- Specific findings (not generic advice)
- Confidence level (0-100)
- Concrete recommendations

REQUIRED JSON STRUCTURE:

{
  "overallScore": 0-100,
  "investmentRecommendation": "STRONG_YES" | "YES" | "MAYBE" | "NO" | "STRONG_NO",
  "oneLineSummary": "Brief compelling summary",
  
  "expertAnalyses": {
    "financial": {
      "score": 0-100,
      "confidence": 0-100,
      "strengths": ["Specific strength 1", "Specific strength 2"],
      "weaknesses": ["Specific weakness 1", "Specific weakness 2"],
      "redFlags": ["Critical issue 1", "Critical issue 2"],
      "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2"]
    },
    "market": { "score": 0-100, "confidence": 0-100, "strengths": [], "weaknesses": [], "redFlags": [], "recommendations": [] },
    "product": { "score": 0-100, "confidence": 0-100, "strengths": [], "weaknesses": [], "redFlags": [], "recommendations": [] },
    "marketing": { "score": 0-100, "confidence": 0-100, "strengths": [], "weaknesses": [], "redFlags": [], "recommendations": [] },
    "risk": { "score": 0-100, "confidence": 0-100, "strengths": [], "weaknesses": [], "redFlags": [], "recommendations": [] },
    "operations": { "score": 0-100, "confidence": 0-100, "strengths": [], "weaknesses": [], "redFlags": [], "recommendations": [] }
  },
  
  "keyFindings": {
    "criticalStrengths": ["Top 3 strengths"],
    "criticalWeaknesses": ["Top 3 weaknesses"],
    "dealBreakers": ["Any deal-breakers or empty array"],
    "quickWins": ["Immediate improvements possible"]
  },
  
  "growthRoadmap": {
    "month3": {
      "milestones": ["Milestone 1", "Milestone 2"],
      "metrics": { "revenue": 0, "customers": 0, "mrr": 0 }
    },
    "month6": { "milestones": [], "metrics": { "revenue": 0, "customers": 0, "mrr": 0 } },
    "month12": { "milestones": [], "metrics": { "revenue": 0, "customers": 0, "mrr": 0 } },
    "month24": { "milestones": [], "metrics": { "revenue": 0, "customers": 0, "mrr": 0 } }
  },
  
  "nextSteps": [
    {
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "action": "Specific action",
      "why": "Why this matters",
      "timeline": "When to do it"
    }
  ]
}

Be brutally honest but constructive. Focus on actionable insights.`;
}