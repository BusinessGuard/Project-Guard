export interface AnalysisApiResponse {
  detectedLanguage: string;
  scores: {
    overall: number;
    readiness: string;
    blocks: {
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
  };
  benchmark: {
    percentile: number;
    betterThan: number;
  };
  consensus: {
    findings: {
      topStrengths: string[];
      topWeaknesses: string[];
    };
  };
  experts: {
    list: Array<{
      field: 'financial' | 'market' | 'product' | 'marketing' | 'risk' | 'operations' | 'credit' | 'compliance' | 'legal' | 'procurement' | 'security' | 'integration' | 'business';
      name: string;
      role: string;
      avatar: string;
      summary: string;
      confidence: number;
      keyFindings: string[];
      concerns: string[];
      recommendations: string[];
      criticalRisks?: Array<{
        category: string;
        description: string;
        likelihood: string;
        impact: string;
        mitigation: string;
      }>;
    }>;
  };
  recommendations: {
    list: Array<{
      id: string;
      priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      category: string;
      title: string;
      description: string;
      actionSteps: string[];
      expectedImpact: string;
      effort: string;
      timeline: string;
      expertsSupporting: string[];
    }>;
  };
  growthPlan: {
    phases: Record<string, {
      name: string;
      duration: string;
      goals: string[];
      keyActions: string[];
      budget: string;
      teamSize: string;
      successMetrics: string[];
    }>;
  };
  financialForecast: {
    unitEconomics: {
      ltv: number;
      cac: number;
      ltvCacRatio: number;
      paybackPeriod: number;
      grossMargin: number;
      churnRate: number;
    };
    breakEven: {
      month: number;
      customers: number;
      mrr: number;
    };
    monthlyProjections: Array<{
      month: number;
      revenue: number;
      costs: number;
      profit: number;
      customers: number;
      mrr: number;
      runway: number;
    }>;
  };
}
