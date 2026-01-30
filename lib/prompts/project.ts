export function getExpertPanelSystemPrompt(language: string = 'ru'): string {
  const langName = language === 'ru' ? 'RUSSIAN (Русский)' : language === 'en' ? 'ENGLISH' : language.toUpperCase();
  const langInstruction = `CRITICAL LANGUAGE RULES - You MUST respond in ${langName}:
1. ALL text content MUST be in ${langName}:
   - Expert summaries, findings, concerns, recommendations
   - Risk descriptions and mitigation strategies
   - Growth plan phases (names, goals, actions, metrics, budgets, team sizes)
   - Recommendation titles, descriptions, action steps, expected impact
   - Consensus findings (strengths/weaknesses)
   - All narrative text, explanations, and descriptions

2. EXCEPTIONS (keep in original language):
   - Technical terms (SaaS, MVP, CAC, LTV, ARPU, MRR, etc.)
   - Brand names and company names
   - Product names and trademarks
   - Acronyms and abbreviations (GDPR, API, etc.)
   - Currency symbols and codes (€, $, USD, EUR)
   - Numbers, percentages, and dates`;

  return `You are ProjectGuard AI, an elite panel of 6 startup evaluation experts with decades of combined experience. You analyze early-stage companies from multiple expert perspectives simultaneously.

${langInstruction}

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

ANALYSIS APPROACH:
1. Each expert analyzes relevant aspects of the business model
2. Experts provide independent assessments with confidence levels (0-100)
3. Identify consensus (where 4+ experts agree) and critical disagreements
4. Synthesize findings into actionable recommendations with priorities
5. Generate realistic 3-phase growth roadmap with specific milestones and budgets
6. Provide detailed financial forecast with 12-month projections

SCORING CRITERIA BY BLOCK:

VALUE PROPOSITION (0-100):
- Problem clarity and severity (25 pts)
- Solution uniqueness and defensibility (25 pts)
- Measurable value delivered (25 pts)
- Competitive advantages (25 pts)

CUSTOMER SEGMENTS (0-100):
- TAM size >€500M (20 pts)
- SAM/SOM realistic and achievable (20 pts)
- Clear target segment definition (20 pts)
- Willingness to pay evidence (20 pts)
- Geography expansion potential (20 pts)

CHANNELS (0-100):
- CAC efficiency <€100 for B2C, <€500 for B2B (25 pts)
- Multiple acquisition channels (20 pts)
- Clear sales process (20 pts)
- Marketing funnel optimization (20 pts)
- Scalability of channels (15 pts)

REVENUE (0-100):
- Revenue model clarity (25 pts)
- Pricing strategy validation (25 pts)
- Multiple revenue streams (25 pts)
- 12-month projection realism (25 pts)

COSTS (0-100):
- Gross margin >70% SaaS, >40% other (30 pts)
- Cost structure optimization (25 pts)
- Runway >12 months (25 pts)
- Unit economics sustainability (20 pts)

KEY RESOURCES (0-100):
- Critical resources identified (30 pts)
- Tech stack appropriateness (25 pts)
- IP/competitive moat (25 pts)
- Resource acquisition plan (20 pts)

KEY ACTIVITIES (0-100):
- Core activities clarity (25 pts)
- Innovation capability (25 pts)
- Operational efficiency (25 pts)
- Scalability of activities (25 pts)

KEY PARTNERS (0-100):
- Strategic partnerships value (35 pts)
- Partner commitment level (30 pts)
- Partnership diversity (20 pts)
- Risk mitigation through partners (15 pts)

TEAM (0-100):
- Founder experience in domain (30 pts)
- Team completeness (25 pts)
- Key roles filled (25 pts)
- Ability to attract talent (20 pts)

OVERALL SCORE CALCULATION:
- Weighted average of all blocks
- Adjusted for critical risks (-5 to -20 pts)
- Bonus for exceptional strengths (+5 to +10 pts)

READINESS STATUS:
- 85-100: "Ready" - Can approach investors now
- 70-84: "Nearly Ready" - Minor improvements needed
- 50-69: "Needs Work" - Significant gaps to address
- 0-49: "Not Ready" - Major restructuring required

Be brutally honest but constructive. Focus on actionable insights with specific numbers.

${langInstruction}`;
}

export function createProjectPrompt(projectData: any, language: string = 'ru') {
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

  return `LANGUAGE: Respond in ${language === 'ru' ? 'RUSSIAN (Русский)' : 'ENGLISH'}. All text must be in this language.

Analyze this startup project comprehensively from all 6 expert perspectives:

PROJECT OVERVIEW:
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
  • 36 months: ${growth.targets36Months}

YOUR TASK:
CRITICAL LANGUAGE RULES - Respond in ${language === 'ru' ? 'RUSSIAN (Русский)' : language === 'en' ? 'ENGLISH' : language.toUpperCase()}:
- ALL text content MUST be in the specified language (summaries, findings, recommendations, growth plans, etc.)
- EXCEPTIONS: Keep technical terms (SaaS, CAC, LTV), brand names, acronyms, and numbers in original format

Return ONLY valid JSON (no markdown, no explanations) in this EXACT structure:

{
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
        "Exceptional unit economics with 32x LTV/CAC ratio",
        "Strong product-market fit with clear value proposition",
        "Experienced founders with domain expertise"
      ],
      "topWeaknesses": [
        "Founder-led sales model won't scale beyond €20K MRR",
        "Limited runway of 14 months requires immediate funding",
        "Single acquisition channel creates dependency risk"
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
        "summary": "Outstanding unit economics but runway concerns need immediate attention",
        "confidence": 92,
        "keyFindings": [
          "LTV/CAC ratio of 32.4x is exceptional (benchmark: >3x)",
          "Gross margin of 80% is excellent for SaaS",
          "Payback period of 0.6 months is outstanding"
        ],
        "concerns": [
          "Current runway of 14 months is tight for scaling",
          "Monthly burn rate needs optimization",
          "Revenue concentration risk with few customers"
        ],
        "recommendations": [
          "Secure €75K bridge round within 60 days",
          "Reduce monthly burn by 15% through cost optimization",
          "Implement financial dashboard for real-time monitoring"
        ],
        "criticalRisks": [
          {
            "category": "Financial",
            "description": "Runway drops below 12 months without bridge funding",
            "likelihood": "high",
            "impact": "critical",
            "mitigation": "Close €75K bridge round from angels/existing investors within Q1"
          }
        ]
      },
      {
        "field": "market",
        "name": "Sarah Williams",
        "role": "Senior Market Researcher",
        "avatar": "📈",
        "summary": "Strong market opportunity but needs geographic expansion strategy",
        "confidence": 85,
        "keyFindings": [
          "TAM of €2.1B provides significant growth runway",
          "Clear target segment with validated willingness to pay",
          "Low competition in UK market creates early mover advantage"
        ],
        "concerns": [
          "Geographic concentration in single market increases risk",
          "Limited market research in expansion markets",
          "Competitive threats from larger players entering space"
        ],
        "recommendations": [
          "Conduct market validation in 2-3 European markets",
          "Build competitive moat through partnerships and IP",
          "Develop market entry playbook for expansion"
        ]
      },
      {
        "field": "product",
        "name": "David Park",
        "role": "VP Product",
        "avatar": "💡",
        "summary": "Strong product-market fit with clear differentiation",
        "confidence": 90,
        "keyFindings": [
          "Clear value proposition solving real customer pain",
          "Unique features providing competitive advantage",
          "Strong customer satisfaction (NPS >70)"
        ],
        "concerns": [
          "Product roadmap lacks prioritization framework",
          "Limited resources for innovation and maintenance",
          "Technical debt accumulating without dedicated time"
        ],
        "recommendations": [
          "Implement RICE prioritization for product roadmap",
          "Allocate 20% of dev time to technical debt",
          "Build customer feedback loop into development process"
        ]
      },
      {
        "field": "marketing",
        "name": "Emma Rodriguez",
        "role": "CMO",
        "avatar": "📢",
        "summary": "Excellent CAC efficiency but scaling requires diversification",
        "confidence": 78,
        "keyFindings": [
          "CAC of €55 is exceptional for B2B SaaS",
          "Strong organic growth through word-of-mouth",
          "High conversion rates indicate good product-market fit"
        ],
        "concerns": [
          "Over-reliance on founder-led sales limits scalability",
          "Single acquisition channel creates vulnerability",
          "No formal marketing strategy or funnel optimization"
        ],
        "recommendations": [
          "Hire VP Sales to build scalable sales process",
          "Launch referral program to systematize word-of-mouth",
          "Test 2-3 new acquisition channels (content, partnerships)"
        ],
        "criticalRisks": [
          {
            "category": "Growth",
            "description": "Founder-led sales becomes bottleneck at 50+ customers",
            "likelihood": "high",
            "impact": "high",
            "mitigation": "Hire experienced VP Sales within 8 weeks to build repeatable process"
          }
        ]
      },
      {
        "field": "risk",
        "name": "James Thompson",
        "role": "Enterprise Risk Consultant",
        "avatar": "🛡️",
        "summary": "Manageable risks with clear mitigation strategies needed",
        "confidence": 88,
        "keyFindings": [
          "No critical technical or legal blockers identified",
          "Strong founder commitment reduces execution risk",
          "Clear understanding of market risks"
        ],
        "concerns": [
          "Key person dependency on founders",
          "Limited runway creates financial pressure",
          "Market timing risk if competitors move faster"
        ],
        "recommendations": [
          "Document all critical processes and knowledge",
          "Build advisory board for strategic guidance",
          "Develop contingency plans for key risks"
        ],
        "criticalRisks": [
          {
            "category": "Execution",
            "description": "Founder burnout or departure would severely impact business",
            "likelihood": "medium",
            "impact": "critical",
            "mitigation": "Hire senior hires to reduce founder workload, implement succession planning"
          }
        ]
      },
      {
        "field": "operations",
        "name": "Lisa Anderson",
        "role": "COO",
        "avatar": "⚡",
        "summary": "Solid operational foundation but needs scaling infrastructure",
        "confidence": 82,
        "keyFindings": [
          "Efficient operations with lean team",
          "Clear processes for current scale",
          "Strong tech stack for automation"
        ],
        "concerns": [
          "Team gaps in sales and customer success",
          "Limited operational capacity for 3x growth",
          "No formal hiring or onboarding processes"
        ],
        "recommendations": [
          "Build hiring pipeline for key roles (VP Sales, CSM)",
          "Implement operational playbooks and SOPs",
          "Set up metrics dashboard for operational KPIs"
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
        "title": "Hire VP Sales to Scale Beyond Founder-Led Sales",
        "description": "Founder-led sales won't scale beyond €20K MRR. Need experienced sales leader to build repeatable process, train team, and close enterprise deals.",
        "actionSteps": [
          "Define VP Sales job description and compensation (€80K + 1-2% equity)",
          "Post on AngelList, LinkedIn, and startup job boards",
          "Screen 20+ candidates, interview top 5 with structured process",
          "Check references and conduct trial project or case study",
          "Onboard VP Sales with 30-60-90 day plan and clear KPIs"
        ],
        "expectedImpact": "Channels score: 68 → 85 (+17 pts). Enable 3x revenue growth in 6 months. Build scalable sales process.",
        "effort": "High",
        "timeline": "8 weeks",
        "expertsSupporting": ["marketing", "operations", "financial"]
      },
      {
        "id": "rec-2",
        "priority": "CRITICAL",
        "category": "financial",
        "title": "Secure €75K Bridge Round Within 60 Days",
        "description": "Current 14-month runway will drop to critical levels during scaling. Bridge round provides safety margin and enables key hires.",
        "actionSteps": [
          "Prepare investor deck and financial model",
          "Reach out to existing investors and angels in network",
          "Target 15-20 angel investors with SaaS experience",
          "Negotiate terms (convertible note or SAFE preferred)",
          "Close round and update cap table"
        ],
        "expectedImpact": "Extends runway to 24+ months. Enables VP Sales hire and marketing experiments. Reduces financial stress.",
        "effort": "High",
        "timeline": "6-8 weeks",
        "expertsSupporting": ["financial", "risk", "operations"]
      },
      {
        "id": "rec-3",
        "priority": "HIGH",
        "category": "marketing",
        "title": "Launch Referral Program to Systematize Word-of-Mouth",
        "description": "Current organic growth is strong but unsystematic. Referral program can 2-3x acquisition while maintaining low CAC.",
        "actionSteps": [
          "Design referral incentive structure (€50 credit for referrer + referee)",
          "Build referral tracking system (use ReferralCandy or custom)",
          "Create referral landing page and email templates",
          "Launch to existing customers with personal outreach",
          "Track metrics: referral rate, conversion, CAC impact"
        ],
        "expectedImpact": "Channels score: 68 → 78 (+10 pts). Target 20% of new customers from referrals. Reduce blended CAC by 30%.",
        "effort": "Medium",
        "timeline": "4 weeks",
        "expertsSupporting": ["marketing", "product", "financial"]
      }
    ]
  },
  "growthPlan": {
    "phases": {
      "phase1": {
        "name": "Foundation & Sales Scaling",
        "duration": "Months 1-3",
        "goals": [
          "Hire VP Sales and close first 3 enterprise deals",
          "Launch referral program and achieve 20% referral rate",
          "Reach 50 paying customers (€4,950 MRR)",
          "Maintain 90%+ customer satisfaction (NPS > 70)"
        ],
        "keyActions": [
          "Recruit and onboard VP Sales with structured 90-day plan",
          "Build sales playbook, email sequences, and demo script",
          "Launch referral program with tracking and incentives",
          "Focus exclusively on UK market for product-market fit",
          "Close €75K bridge round from angels/existing investors"
        ],
        "budget": "€27,000",
        "teamSize": "2 founders + 1 developer + 1 VP Sales",
        "successMetrics": [
          "50 customers",
          "€4,950 MRR",
          "NPS > 70",
          "VP Sales hired",
          "Bridge round closed"
        ]
      },
      "phase2": {
        "name": "Process Optimization & Market Expansion",
        "duration": "Months 4-9",
        "goals": [
          "Scale to 150 customers (€14,850 MRR)",
          "Hire Customer Success Manager",
          "Validate 2 new European markets",
          "Reduce CAC by 20% through referrals"
        ],
        "keyActions": [
          "Implement CRM and sales automation",
          "Launch content marketing (blog, case studies)",
          "Test partnerships with complementary SaaS",
          "Conduct market research in Germany and France",
          "Build customer success playbook"
        ],
        "budget": "€81,000",
        "teamSize": "2 founders + 2 developers + 1 VP Sales + 1 CSM",
        "successMetrics": [
          "150 customers",
          "€14,850 MRR",
          "Churn < 5%",
          "CAC < €45",
          "2 markets validated"
        ]
      },
      "phase3": {
        "name": "Scaling & Series A Preparation",
        "duration": "Months 10-18",
        "goals": [
          "Reach 400 customers (€39,600 MRR)",
          "Expand to 2 new European markets",
          "Build marketing team (2 people)",
          "Prepare for Series A (€2M+)"
        ],
        "keyActions": [
          "Launch in Germany and France with localized marketing",
          "Hire Marketing Manager and Content Lead",
          "Implement marketing automation and attribution",
          "Build investor relationships for Series A",
          "Achieve profitability or clear path to it"
        ],
        "budget": "€243,000",
        "teamSize": "2 founders + 4 developers + 1 VP Sales + 2 CSM + 2 Marketing",
        "successMetrics": [
          "400 customers",
          "€39,600 MRR",
          "3 markets active",
          "Profitability or <6mo to breakeven",
          "Series A term sheet"
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
      },
      {
        "month": 2,
        "revenue": 2871,
        "costs": 7200,
        "profit": -4329,
        "customers": 29,
        "mrr": 2871,
        "runway": 13
      },
      {
        "month": 3,
        "revenue": 3366,
        "costs": 9000,
        "profit": -5634,
        "customers": 34,
        "mrr": 3366,
        "runway": 12
      },
      {
        "month": 4,
        "revenue": 4950,
        "costs": 9500,
        "profit": -4550,
        "customers": 50,
        "mrr": 4950,
        "runway": 11
      },
      {
        "month": 5,
        "revenue": 5940,
        "costs": 9800,
        "profit": -3860,
        "customers": 60,
        "mrr": 5940,
        "runway": 10
      },
      {
        "month": 6,
        "revenue": 7425,
        "costs": 10200,
        "profit": -2775,
        "customers": 75,
        "mrr": 7425,
        "runway": 9
      },
      {
        "month": 7,
        "revenue": 9900,
        "costs": 13500,
        "profit": -3600,
        "customers": 100,
        "mrr": 9900,
        "runway": 8
      },
      {
        "month": 8,
        "revenue": 11880,
        "costs": 14000,
        "profit": -2120,
        "customers": 120,
        "mrr": 11880,
        "runway": 7
      },
      {
        "month": 9,
        "revenue": 14850,
        "costs": 14500,
        "profit": 350,
        "customers": 150,
        "mrr": 14850,
        "runway": 6
      },
      {
        "month": 10,
        "revenue": 17820,
        "costs": 18000,
        "profit": -180,
        "customers": 180,
        "mrr": 17820,
        "runway": 5
      },
      {
        "month": 11,
        "revenue": 21780,
        "costs": 19000,
        "profit": 2780,
        "customers": 220,
        "mrr": 21780,
        "runway": 4
      },
      {
        "month": 12,
        "revenue": 26730,
        "costs": 20000,
        "profit": 6730,
        "customers": 270,
        "mrr": 26730,
        "runway": 3
      }
    ]
  }
}

CRITICAL RULES:
1. Return ONLY valid JSON (no markdown code blocks, no explanations)
2. All numbers must be realistic and based on provided data
3. Each expert must have 3-5 keyFindings, concerns, and recommendations
4. Recommendations must have specific action steps (3-5 steps each)
5. Growth phases must have realistic budgets and timelines
6. Monthly projections must show realistic growth trajectory
7. All strings must be properly escaped for JSON
8. Use exact field names as shown in structure above

Be brutally honest but constructive. Focus on actionable insights with specific numbers.`;
}
