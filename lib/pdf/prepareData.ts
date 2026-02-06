import { ProjectVersionWithAudience, VersionsByAudience } from '@/lib/utils/getVersions';

export interface PDFData {
  // Project info
  projectName: string;
  industry: string;
  stage: string;
  audienceType: string;
  generatedDate: string;
  
  // Scores
  overallScore: number;
  readinessStatus: string;
  benchmarkPercentile: number;
  
  // Consensus
  topStrengths: string[];
  topWeaknesses: string[];
  
  // Block scores
  blockScores: {
    name: string;
    score: number;
  }[];
  
  // Financial data
  financial: {
    ltv: number;
    cac: number;
    ltvCacRatio: number;
    paybackPeriod: number;
    grossMargin: number;
    churnRate: number;
    breakEvenMonth: number;
    breakEvenCustomers: number;
    breakEvenMRR: number;
    monthlyProjections: any[];
  };
  
  // Recommendations
  recommendations: {
    priority: string;
    category: string;
    title: string;
    description: string;
    impact: string;
    effort: string;
    timeline: string;
    actionSteps: string[];
  }[];
  
  // Growth plan
  growthPhases: {
    name: string;
    duration: string;
    goals: string[];
    keyActions: string[];
    milestones: string[];
    teamSize: string;
    successMetrics: string[];
  }[];
  
  // Experts
  experts: {
    role: string;
    score: number;
    perspective: string;
    keyFindings: string[];
    criticalRisks: {
      risk: string;
      likelihood: string;
      impact: string;
      mitigation: string;
    }[];
    concerns: string[];
    recommendations: string[];
  }[];
}

export function preparePDFData(
  versions: VersionsByAudience,
  version: number,
  audienceType: 'venture' | 'bank' | 'corporate'
): PDFData | null {
  const currentVersion = versions[version]?.[audienceType];
  
  if (!currentVersion || !currentVersion.analysis) {
    return null;
  }
  
  const { analysis } = currentVersion;
  
  // Prepare block scores
  const blockScores = [
    { name: 'Value Proposition', score: analysis.scores.blocks.valueProposition },
    { name: 'Customer Segments', score: analysis.scores.blocks.customerSegments },
    { name: 'Channels', score: analysis.scores.blocks.channels },
    { name: 'Revenue Streams', score: analysis.scores.blocks.revenue },
    { name: 'Cost Structure', score: analysis.scores.blocks.costs },
    { name: 'Key Resources', score: analysis.scores.blocks.keyResources },
    { name: 'Key Activities', score: analysis.scores.blocks.keyActivities },
    { name: 'Key Partners', score: analysis.scores.blocks.keyPartners },
    { name: 'Team', score: analysis.scores.blocks.team },
  ];
  
  // Prepare recommendations
  const recommendations = (analysis.recommendations?.list || []).map((rec: any) => ({
    priority: rec.priority || 'MEDIUM',
    category: rec.category || 'general',
    title: rec.title || '',
    description: rec.description || '',
    impact: rec.expectedImpact || '',
    effort: rec.effort || 'Medium',
    timeline: rec.timeline || '',
    actionSteps: rec.actionSteps || [],
  }));
  
  // Prepare growth phases
  const growthPhases = Object.entries(analysis.growthPlan?.phases || {}).map(([key, phase]: [string, any]) => ({
    name: phase.name || key,
    duration: phase.duration || '',
    goals: phase.goals || [],
    keyActions: phase.keyActions || [],
    milestones: phase.milestones || [],
    teamSize: phase.teamSize || '',
    successMetrics: phase.successMetrics || [],
  }));
  
  // Prepare experts
  const experts = (analysis.experts?.list || []).map((expert: any) => ({
    role: expert.role || expert.name || '',
    score: expert.confidence || 0,
    perspective: expert.summary || '',
    keyFindings: expert.keyFindings || [],
    criticalRisks: expert.criticalRisks || [],
    concerns: expert.concerns || [],
    recommendations: expert.recommendations || [],
  }));
  
  return {
    projectName: currentVersion.name || 'Untitled Project',
    industry: currentVersion.industry || 'N/A',
    stage: currentVersion.stage || 'N/A',
    audienceType: audienceType.charAt(0).toUpperCase() + audienceType.slice(1),
    generatedDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    
    overallScore: analysis.scores.overall || 0,
    readinessStatus: analysis.scores.readiness || 'Not Ready',
    benchmarkPercentile: analysis.benchmark.percentile || 0,
    
    topStrengths: analysis.consensus.findings.topStrengths || [],
    topWeaknesses: analysis.consensus.findings.topWeaknesses || [],
    
    blockScores,
    
    financial: {
      ltv: analysis.financialForecast.unitEconomics.ltv || 0,
      cac: analysis.financialForecast.unitEconomics.cac || 0,
      ltvCacRatio: analysis.financialForecast.unitEconomics.ltvCacRatio || 0,
      paybackPeriod: analysis.financialForecast.unitEconomics.paybackPeriod || 0,
      grossMargin: analysis.financialForecast.unitEconomics.grossMargin || 0,
      churnRate: analysis.financialForecast.unitEconomics.churnRate || 0,
      breakEvenMonth: analysis.financialForecast.breakEven.month || 0,
      breakEvenCustomers: analysis.financialForecast.breakEven.customers || 0,
      breakEvenMRR: analysis.financialForecast.breakEven.mrr || 0,
      monthlyProjections: analysis.financialForecast.monthlyProjections || [],
    },
    
    recommendations,
    growthPhases,
    experts,
  };
}
