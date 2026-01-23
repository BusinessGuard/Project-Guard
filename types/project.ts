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
    tam: string;
    tamCalculation: string;
    sam: string;
    samCalculation: string;
    som: string;
    somCalculation: string;
  };
  geography: Geography;
  willingnessToPay: WillingnessToPay;
}

// Step 4: Channels
export interface Channels {
  acquisitionChannels: string[];
  salesChannel: string;
  cac: string;
  marketingTools: string;
  marketingFunnel: string;
}

// Step 5: Economics
export interface Economics {
  projectedRevenue12Months: string;
  revenueBreakdown: string;
  costBreakdown: string;
  grossMargin: string;
  breakEven: string;
  funding: string;
}

// Step 6: Team
export interface Team {
  keyRoles: string;
  founderExperience: string;
  specialists: string;
  gaps: string;
}

// Step 7: Resources
export interface Resources {
  existing: string;
  needed: string;
  techStack: string;
  dependencies: string;
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
  scalingPlan: string;
  newMarkets: string;
  paybackPeriod: string;
  targets: string;
}

// Complete Project Data
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
  solutionUniqueness: "",
  advantages: [],
  measurableValue: "",
};

export const initialCustomerSegments: CustomerSegments = {
  primarySegment: "",
  marketSize: {
    tam: "",
    tamCalculation: "",
    sam: "",
    samCalculation: "",
    som: "",
    somCalculation: "",
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
  cac: "",
  marketingTools: "",
  marketingFunnel: "",
};

export const initialEconomics: Economics = {
  projectedRevenue12Months: "",
  revenueBreakdown: "",
  costBreakdown: "",
  grossMargin: "",
  breakEven: "",
  funding: "",
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
  scalingPlan: "",
  newMarkets: "",
  paybackPeriod: "",
  targets: "",
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
