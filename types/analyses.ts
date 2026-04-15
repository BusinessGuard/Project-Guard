import type { ExpertInsight } from '@/store/useAnalizeStore.types';

export interface ProjectAnalysis {
  overallScore: number;
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
  strengths: string[];
  weaknesses: string[];
  expertInsights: {
    financialExpert: ExpertInsight;
    marketAnalyst: ExpertInsight;
    productExpert: ExpertInsight;
    marketingExpert: ExpertInsight;
    opsExpert: ExpertInsight;
    riskManager: ExpertInsight;
  };
  recommendations: Recommendation[];
  growthPlan: {
    phase1: GrowthPhase;
    phase2: GrowthPhase;
    phase3: GrowthPhase;
  };
  financialForecast: FinancialForecast;
}

export interface Recommendation {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'team' | 'costs' | 'channels' | 'revenue' | 'product' | 'market';
  title: string;
  description: string;
  actionSteps: string[];
  expectedImpact: string;
  effort: 'Low' | 'Medium' | 'High';
  timeline: string;
  expertsSupporting: string[];
}

export interface GrowthPhase {
  name: string;
  duration: string;
  goals: string[];
  keyActions: string[];
  milestones: string[];
  risks: string[];
  budget: string;
}

export interface FinancialForecast {
  months: number[];
  revenue: number[];
  costs: number[];
  profit: number[];
  customers: number[];
  mrr: number[];
  burnRate: number[];
  runway: number[];
  keyMetrics: {
    ltv: number;
    cac: number;
    ltvCacRatio: number;
    grossMargin: number;
    paybackPeriod: number;
    breakEvenMonth: number;
  };
}

// Version of project analysis
export interface ProjectVersion {
  id: string; // "v1.0", "v2.0"
  name: string; // "Initial Version", "After Pivot"
  date: string; // ISO date string
  score: number; // Overall score
  analysis: ProjectAnalysis;
  createdAt: string; // ISO timestamp
}

// Project info
export interface ProjectInfo {
  id: string;
  name: string;
  industry: string;
  stage: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Full scoreboard data
export interface ScoreboardData {
  project: ProjectInfo;
  versions: ProjectVersion[];
  currentVersion: string; // version id
}

