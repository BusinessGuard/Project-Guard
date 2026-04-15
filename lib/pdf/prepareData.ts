import type { Locale } from '@/i18n/config';
import { VersionsByAudience } from '@/lib/utils/getVersions';
import type {
  CriticalRisk,
  ExpertInsight,
  GrowthPhase,
  MonthlyProjection,
  Recommendation as AnalysisRecommendation,
} from '@/store/useAnalizeStore.types';
import type { PDFDocumentLabels } from './pdfDocumentLabels';

const DATE_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  uk: 'uk-UA',
};

export interface PDFData {
  labels: PDFDocumentLabels;
  /** Filled in PDF preview client via `t('cover.benchmarkCompared', { percent })` */
  coverBenchmarkText: string;

  projectName: string;
  industry: string;
  stage: string;
  /** Localized audience name (e.g. Venture Capital) */
  audienceTitle: string;

  generatedDate: string;

  overallScore: number;
  readinessStatus: string;
  benchmarkPercentile: number;

  topStrengths: string[];
  topWeaknesses: string[];

  blockScores: {
    name: string;
    score: number;
  }[];

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
    monthlyProjections: MonthlyProjection[];
  };

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

  growthPhases: {
    name: string;
    duration: string;
    goals: string[];
    keyActions: string[];
    milestones: string[];
    teamSize: string;
    successMetrics: string[];
  }[];

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
  audienceType: 'venture' | 'bank' | 'corporate',
  labels: PDFDocumentLabels,
  locale: Locale
): PDFData | null {
  const currentVersion = versions[version]?.[audienceType];

  if (!currentVersion || !currentVersion.analysis) {
    return null;
  }

  const { analysis } = currentVersion;
  const b = labels.blocks;

  const blockScores = [
    { name: b.valueProposition, score: analysis.scores.blocks.valueProposition },
    { name: b.customerSegments, score: analysis.scores.blocks.customerSegments },
    { name: b.channels, score: analysis.scores.blocks.channels },
    { name: b.revenue, score: analysis.scores.blocks.revenue },
    { name: b.costs, score: analysis.scores.blocks.costs },
    { name: b.keyResources, score: analysis.scores.blocks.keyResources },
    { name: b.keyActivities, score: analysis.scores.blocks.keyActivities },
    { name: b.keyPartners, score: analysis.scores.blocks.keyPartners },
    { name: b.team, score: analysis.scores.blocks.team },
  ];

  const recommendations = (analysis.recommendations?.list || []).map((rec: AnalysisRecommendation) => ({
    priority: String(rec.priority ?? 'MEDIUM'),
    category: rec.category || 'general',
    title: rec.title || '',
    description: rec.description || '',
    impact: rec.expectedImpact || '',
    effort: rec.effort || 'Medium',
    timeline: rec.timeline || '',
    actionSteps: rec.actionSteps || [],
  }));

  const growthPhases = Object.entries(analysis.growthPlan?.phases || {}).map(([key, phase]) => {
    const p = phase as GrowthPhase & { milestones?: string[] };
    return {
      name: p.name || key,
      duration: p.duration || '',
      goals: p.goals || [],
      keyActions: p.keyActions || [],
      milestones: p.milestones || [],
      teamSize: p.teamSize || '',
      successMetrics: p.successMetrics || [],
    };
  });

  const experts = (analysis.experts?.list || []).map((expert: ExpertInsight) => ({
    role: expert.role || expert.name || '',
    score: expert.confidence || 0,
    perspective: expert.summary || '',
    keyFindings: expert.keyFindings || [],
    criticalRisks: (expert.criticalRisks || []).map((r) => {
      const row = r as CriticalRisk & { risk?: string };
      return {
      risk: row.risk || row.description || '',
      likelihood: String(row.likelihood ?? ''),
      impact: String(row.impact ?? ''),
      mitigation: String(row.mitigation ?? ''),
    };
    }),
    concerns: expert.concerns || [],
    recommendations: expert.recommendations || [],
  }));

  const dateLocale = DATE_LOCALE[locale] ?? 'en-US';

  return {
    labels,
    coverBenchmarkText: '',
    projectName: currentVersion.name || labels.common.untitledProject,
    industry: currentVersion.industry || labels.common.notAvailable,
    stage: currentVersion.stage || labels.common.notAvailable,
    audienceTitle: labels.audience[audienceType],
    generatedDate: new Date().toLocaleDateString(dateLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
