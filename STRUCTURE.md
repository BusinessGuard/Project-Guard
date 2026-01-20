# INPUT DATA

## Multi-Step Form Data
steps: {
  basics: StepBasics
  valueProposition: StepValueProp
  customers: StepCustomers
  economics: StepEconomics
  team: StepTeam
  competition: StepCompetition
  growth: StepGrowth
}

## Step 1 — Basics (StepBasics)
{
  "basics": {
    "projectName": "HRFlow",
    "industry": "SaaS / B2B HR Tech",
    "stage": "pre-seed",
    "description": "HRFlow is an AI-powered HR automation platform...",
    "characterCount": 250,
    "isValid": true
  }
}

## Step 2 — Value Proposition (StepValueProp)
{
  "valueProposition": {
    "problem": "SMB companies waste 40+ hours per month...",
    "solutionUniqueness": "AI automation of 70% HR tasks...",
    "advantages": [
      "Setup in 5 minutes",
      "€99/mo vs €5,000 enterprise",
      "AI learns company culture",
      "Mobile-first",
      "White-glove onboarding"
    ],
    "measurableValue": "Customers save 40 hours/month...",
    "isValid": true
  }
}

## Step 3 — Customer Segments (StepCustomers)
{
  "customers": {
    "primarySegment": "HR managers and founders of SMBs (50–500)",
    "marketSize": {
      "tam": {
        "value": 2500000000,
        "calculation": "200K SMBs × €12.5K"
      },
      "sam": {
        "value": 500000000,
        "calculation": "40K SMBs in UK/DE/NL"
      },
      "som": {
        "value": 15000000,
        "calculation": "1,250 customers × €99 × 12"
      }
    },
    "geography": {
      "markets": ["UK", "Germany", "Netherlands"],
      "notes": "UK first, expand to DE in year 2"
    },
    "willingnessToPay": {
      "evidence": "80 interviews, 25 paid beta users",
      "averageDealSize": 99
    },
    "isValid": true
  }
}

## Step 4 — Economics (StepEconomics)
{
  "economics": {
    "revenue": {
      "projected12Months": 85000,
      "streams": [
        {
          "name": "Monthly Subscription",
          "price": 99,
          "customers": 50,
          "recurring": true
        },
        {
          "name": "Annual Plan",
          "price": 990,
          "customers": 15,
          "recurring": true
        },
        {
          "name": "Setup Service",
          "price": 500,
          "customers": 20,
          "recurring": false
        }
      ]
    },
    "costs": {
      "monthly": {
        "personnel": 4500,
        "technology": 800,
        "marketing": 1200,
        "operations": 500
      },
      "monthlyBurn": 7000,
      "annualBurn": 84000
    },
    "unitEconomics": {
      "grossMargin": 80,
      "cac": 55,
      "arpu": 99,
      "lifetimeMonths": 18,
      "ltv": 1782,
      "ltvToCac": 32.4,
      "paybackMonths": 0.6
    },
    "breakEven": {
      "month": 18,
      "customers": 90,
      "mrr": 8900
    },
    "funding": {
      "raised": 75000,
      "sources": {
        "bootstrapped": 50000,
        "angels": 25000
      },
      "seeking": 300000,
      "useOfFunds": [
        "18-month runway",
        "Hiring",
        "Marketing",
        "Buffer"
      ],
      "runwayMonths": 11
    },
    "isValid": true
  }
}

## Steps 5–7 (StepTeam, StepCompetition, StepGrowth)
{
  "team": {
    "founders": ["CEO (ex-PM)", "CTO (ex-engineer)"],
    "teamSize": 3,
    "hiringNeeds": ["VP Sales", "Customer Success"]
  },
  "competition": {
    "competitors": ["Workday", "BambooHR"],
    "risks": ["Market saturation", "OpenAI dependency"],
    "mitigation": "SMB focus, vendor abstraction"
  },
  "growth": {
    "month12": { "customers": 65, "mrr": 6400 },
    "month24": { "customers": 250, "mrr": 25000 },
    "month36": { "customers": 800, "mrr": 80000 }
  }
}
