// Step 1: Basic Info
export interface BasicInfo {
  projectName: string;
  industry: string;
  stage: string;
  description: string;
}

// Step 2: Value Proposition
export interface ValueProposition {
  problem: string;
  solution: string;
  solutionUniqueness: string;
  advantages: string[];
  measurableValue: string;
}

// Step 3: Customer Segments
export interface Geography {
  markets: string[];
  notes: string;
}

export interface WillingnessToPay {
  evidence: string;
  averageDealSize: number;
}

export interface CustomerSegments {
  primarySegment: string;
  marketSize: {
    tam: number;
    tamDescription: string;
    sam: number;
    samDescription: string;
    som: number;
    somDescription: string;
  };
  geography: Geography;
  willingnessToPay: WillingnessToPay;
}

// Step 4: Channels
export interface Channels {
  acquisitionChannels: string[];
  salesChannel: string;
  cac: number;
  cacDescription: string;
  marketingTools: string;
  marketingFunnel: string;
}

// Step 5: Economics
export interface RevenueStream {
  type: string;
  description: string;
  percentage: number;
}

export interface FundingSource {
  type: string;
  amount: number;
}

export interface UseOfFundsItem {
  item: string;
  amount: number;
}

export interface Economics {
  projectedRevenue12Months: number;
  revenueStreams: RevenueStream[];
  revenuePricing: string;
  costBreakdown: string;
  grossMargin: number;
  arpu: number;
  customerLifetime: number;
  contributionMargin: number;
  fundingRaised: number;
  fundingSources: FundingSource[];
  amountSeeking: number;
  useOfFunds: UseOfFundsItem[];
  currentRunway: number;
}

// Step 6: Team
export interface Team {
  keyRoles: string;
  founderExperience: string;
  specialists: string;
  gaps: string;
}

// Step 7: Resources & Activities
export interface Activities {
  production: string;
  innovation: string;
  platform: string;
  marketing: string;
  operations: string;
}

export interface Partner {
  type: string;
  name: string;
  value: string;
}

export interface Resources {
  existing: string;
  needed: string;
  techStack: string;
  dependencies: string;
  activities: Activities;
  partners: Partner[];
}

// Step 8: Competition
export interface Competition {
  directCompetitors: string;
  indirectCompetitors: string;
  whyChooseYou: string;
  defensibility: string;
}

// Step 9: Risks
export interface Risks {
  technical: string;
  financial: string;
  legal: string;
  market: string;
  team: string;
  mitigation: string;
}

// Step 10: Growth
export interface Growth {
  traction: string;
  scalingPlan: string;
  newMarkets: string;
  paybackPeriod: string;
  targets12Months: string;
  targets24Months: string;
  targets36Months: string;
}

// Complete Project Data (Form Structure)
export interface ProjectData {
  basicInfo: BasicInfo;
  valueProposition: ValueProposition;
  customerSegments: CustomerSegments;
  channels: Channels;
  economics: Economics;
  team: Team;
  resources: Resources;
  competition: Competition;
  risks: Risks;
  growth: Growth;
}



// Initial state
export const initialBasicInfo: BasicInfo = {
  projectName: "",
  industry: "",
  stage: "",
  description: "",
};

export const initialValueProposition: ValueProposition = {
  problem: "",
  solution: "",
  solutionUniqueness: "",
  advantages: [],
  measurableValue: "",
};

export const initialCustomerSegments: CustomerSegments = {
  primarySegment: "",
  marketSize: {
    tam: 0,
    tamDescription: "",
    sam: 0,
    samDescription: "",
    som: 0,
    somDescription: "",
  },
  geography: {
    markets: [],
    notes: "",
  },
  willingnessToPay: {
    evidence: "",
    averageDealSize: 0,
  },
};

export const initialChannels: Channels = {
  acquisitionChannels: [],
  salesChannel: "",
  cac: 0,
  cacDescription: "",
  marketingTools: "",
  marketingFunnel: "",
};

export const initialEconomics: Economics = {
  projectedRevenue12Months: 0,
  revenueStreams: [],
  revenuePricing: "",
  costBreakdown: "",
  grossMargin: 0,
  arpu: 0,
  customerLifetime: 0,
  contributionMargin: 0,
  fundingRaised: 0,
  fundingSources: [],
  amountSeeking: 0,
  useOfFunds: [],
  currentRunway: 0,
};

export const initialTeam: Team = {
  keyRoles: "",
  founderExperience: "",
  specialists: "",
  gaps: "",
};

export const initialResources: Resources = {
  existing: "",
  needed: "",
  techStack: "",
  dependencies: "",
  activities: {
    production: "",
    innovation: "",
    platform: "",
    marketing: "",
    operations: "",
  },
  partners: [],
};

export const initialCompetition: Competition = {
  directCompetitors: "",
  indirectCompetitors: "",
  whyChooseYou: "",
  defensibility: "",
};

export const initialRisks: Risks = {
  technical: "",
  financial: "",
  legal: "",
  market: "",
  team: "",
  mitigation: "",
};

export const initialGrowth: Growth = {
  traction: "",
  scalingPlan: "",
  newMarkets: "",
  paybackPeriod: "",
  targets12Months: "",
  targets24Months: "",
  targets36Months: "",
};

export const initialProjectData: ProjectData = {
  basicInfo: initialBasicInfo,
  valueProposition: initialValueProposition,
  customerSegments: initialCustomerSegments,
  channels: initialChannels,
  economics: initialEconomics,
  team: initialTeam,
  resources: initialResources,
  competition: initialCompetition,
  risks: initialRisks,
  growth: initialGrowth,
};


export interface DatabaseProject {
  name: string;
  description: string;
  industry: string;
  stage: string;

  value_prop_problem: string;
  value_prop_solution: string;
  value_prop_uniqueness: string;
  value_prop_measurable: string;
  value_prop_advantages: string[]; 

  customer_primary_segment: string;
  customer_tam: string; 
  customer_sam: string; 
  customer_som: string; 
  customer_geography: string; 
  customer_wtp: string;
  customer_avg_check: number;

  channels_acquisition: string[]; 
  channels_sales: string;
  channels_cac: number;
  channels_cac_description: string;
  channels_marketing: string;
  channels_funnel: string;

  revenue_projected_12m: number;
  revenue_streams: Array<{
    type: string;
    description: string;
    percentage: number;
  }>; 
  revenue_pricing: string;

  cost_breakdown: string;
  cost_gross_margin: number;
  arpu: number;
  customer_lifetime: number;
  contribution_margin: number;
  cost_runway: number;

  funding_raised: number;
  funding_sought: number;
  funding_sources: Array<{
    type: string;
    amount: number;
  }>; 
  use_of_funds: Array<{
    item: string;
    amount: number;
  }>; 

  team_founders: string;
  team_key_hires: string;
  team_specialists: string;
  team_gaps: string;

  resources_physical: string;
  resources_intellectual: string;
  resources_needed: string;
  resources_dependencies: string;

  activities_production: string;
  activities_innovation: string;
  activities_platform: string;
  activities_marketing: string;
  activities_operations: string;

  partners_strategic: Array<{
    type: string;
    name: string;
    value: string;
  }>; 

  competitors: string; 
  competition_why_choose: string;
  competition_defensibility: string;

  risks: string; 

  traction: string;
  growth_plan: string;
  growth_new_markets: string;
  growth_payback_period: string;
  growth_targets_12m: string;
  growth_targets_24m: string;
  growth_targets_36m: string;
}