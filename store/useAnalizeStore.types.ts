export interface BlockScores {
  valueProposition: number;
  customerSegments: number;
  channels: number;
  revenue: number;
  costs: number;
  keyResources: number;
  keyActivities: number;
  keyPartners: number;
  team: number;
}

export interface ProjectVersionDB {
  id: number;
  version: number;
  score: number;
  name: string;
  date: string;
}

export interface ConsensusFindings {
  topStrengths: string[];
  topWeaknesses: string[];
}

export interface CriticalRisk {
  category: string;
  description: string;
  likelihood: string;
  impact: string;
  mitigation: string;
}

export enum ExpertField {
  FINANCIAL = 'financial',
  MARKET = 'market',
  PRODUCT = 'product',
  MARKETING = 'marketing',
  RISK = 'risk',
  OPERATIONS = 'operations',
}

export interface ExpertInsight {
  field: ExpertField;
  name: string;
  role: string;
  avatar: string;
  summary: string;
  confidence: number;
  keyFindings: string[];
  concerns: string[];
  recommendations: string[];
  criticalRisks?: CriticalRisk[];
}

export interface ProjectInfoStore {
  id: string;
  name: string;
  industry: string;
  stage: string;
}

export interface AnalysisScores {
  overall: number;
  readiness: string;
  blocks: BlockScores;
}

export interface AnalysisBenchmark {
  percentile: number;
  betterThan: number;
}

export interface AnalysisConsensus {
  findings: ConsensusFindings;
}

export interface AnalysisExperts {
  list: ExpertInsight[];
}

export enum RecommendationPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface Recommendation {
  id: string;
  priority: RecommendationPriority;
  category: string;
  title: string;
  description: string;
  actionSteps: string[];
  expectedImpact: string;
  effort: string;
  timeline: string;
  expertsSupporting: string[];
}

export interface AnalysisRecommendations {
  list: Recommendation[];
}

export interface GrowthPhase {
  name: string;
  duration: string;
  goals: string[];
  keyActions: string[];
  budget: string;
  teamSize: string;
  successMetrics: string[];
}

export interface AnalysisGrowthPlan {
  phases: Record<string, GrowthPhase>;
}

export interface UnitEconomics {
  ltv: number;
  cac: number;
  ltvCacRatio: number;
  paybackPeriod: number;
  grossMargin: number;
  churnRate: number;
}

export interface BreakEven {
  month: number;
  customers: number;
  mrr: number;
}

export interface MonthlyProjection {
  month: number;
  revenue: number;
  costs: number;
  profit: number;
  customers: number;
  mrr: number;
  runway: number;
}

export interface AnalysisFinancialForecast {
  unitEconomics: UnitEconomics;
  breakEven: BreakEven;
  monthlyProjections: MonthlyProjection[];
}

export interface Analysis {
  scores: AnalysisScores;
  benchmark: AnalysisBenchmark;
  consensus: AnalysisConsensus;
  experts: AnalysisExperts;
  recommendations: AnalysisRecommendations;
  growthPlan: AnalysisGrowthPlan;
  financialForecast: AnalysisFinancialForecast;
}

export interface AnalizeStore {
  project: ProjectInfoStore | undefined;
  analysis: Analysis | undefined;
  versions: ProjectVersionDB[];
  
  setProjectInfo: (id: string, name: string, industry: string, stage: string) => void;
  setProject: (project: ProjectInfoStore) => void;
  setAnalysisScores: (overall: number, readiness: string, blocks: BlockScores) => void;
  setAnalysisBenchmark: (percentile: number, betterThan: number) => void;
  setAnalysisConsensus: (findings: ConsensusFindings) => void;
  setAnalysisExperts: (experts: AnalysisExperts) => void;
  setAnalysisRecommendations: (recommendations: AnalysisRecommendations) => void;
  setAnalysisGrowthPlan: (growthPlan: AnalysisGrowthPlan) => void;
  setAnalysisFinancialForecast: (financialForecast: AnalysisFinancialForecast) => void;
  setAnalysis: (analysis: Analysis) => void;
  setVersions: (versions: ProjectVersionDB[]) => void;
  setAnalysisData: (data: {
    overallScore: number;
    readinessStatus: string;
    benchmarkPercentile: number;
    benchmarkBetterThan: number;
    blockScores: BlockScores;
    consensusFindings?: ConsensusFindings;
  }) => void;
}
