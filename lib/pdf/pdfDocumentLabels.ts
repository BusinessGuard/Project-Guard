/**
 * Static UI strings embedded in the PDF (not the AI-generated body).
 * Built from next-intl namespace `pdfDocument` in the PDF preview client.
 */
export interface PDFDocumentLabels {
  common: {
    untitledProject: string;
    notAvailable: string;
  };
  cover: {
    logo: string;
    reportType: string;
    analysisSuffix: string;
    overallScore: string;
    benchmark: string;
    keyStrengths: string;
    areasToImprove: string;
    generatedBy: string;
  };
  footer: {
    brand: string;
    /** Localized word for "Page" (number appended in PDF, e.g. "Page 2") */
    pageLabel: string;
  };
  audience: {
    venture: string;
    bank: string;
    corporate: string;
  };
  blocks: {
    valueProposition: string;
    customerSegments: string;
    channels: string;
    revenue: string;
    costs: string;
    keyResources: string;
    keyActivities: string;
    keyPartners: string;
    team: string;
  };
  statusLabels: {
    strong: string;
    good: string;
    needsWork: string;
    critical: string;
  };
  businessScores: {
    title: string;
    intro: string;
    colBlock: string;
    colScore: string;
    colStatus: string;
    averageBlockScore: string;
    legend: string;
    strongBold: string;
    strongText: string;
    goodBold: string;
    goodText: string;
    needsWorkBold: string;
    needsWorkText: string;
    criticalBold: string;
    criticalText: string;
  };
  financial: {
    title: string;
    noData: string;
    unitEconomics: string;
    ltv: string;
    cac: string;
    ltvCacRatio: string;
    paybackPeriod: string;
    months: string;
    grossMargin: string;
    monthlyChurn: string;
    breakEvenHeading: string;
    breakEvenMonth: string;
    breakEvenCustomers: string;
    breakEvenMrr: string;
    projections12: string;
    colMonth: string;
    colRevenue: string;
    colCosts: string;
    colProfit: string;
    colUsers: string;
  };
  recommendations: {
    title: string;
    titleLong: string;
    empty: string;
    intro: string;
    criticalSection: string;
    highSection: string;
    mediumSection: string;
    category: string;
    effort: string;
    timeline: string;
    actionSteps: string;
    expectedImpact: string;
  };
  growthPlan: {
    title: string;
    intro: string;
    phasePrefix: string;
    goals: string;
    keyActions: string;
    milestones: string;
    teamSize: string;
    successMetrics: string;
  };
  experts: {
    title: string;
    intro: string;
    confidence: string;
    keyFindings: string;
    criticalRisks: string;
    likelihood: string;
    impact: string;
    mitigation: string;
    concerns: string;
    recommendations: string;
    disclaimer: string;
  };
}

type PdfDocT = (key: string, values?: Record<string, string | number | Date>) => string;

export function buildPdfDocumentLabels(t: PdfDocT): PDFDocumentLabels {
  return {
    common: {
      untitledProject: t('common.untitledProject'),
      notAvailable: t('common.notAvailable'),
    },
    cover: {
      logo: t('cover.logo'),
      reportType: t('cover.reportType'),
      analysisSuffix: t('cover.analysisSuffix'),
      overallScore: t('cover.overallScore'),
      benchmark: t('cover.benchmark'),
      keyStrengths: t('cover.keyStrengths'),
      areasToImprove: t('cover.areasToImprove'),
      generatedBy: t('cover.generatedBy'),
    },
    footer: {
      brand: t('footer.brand'),
      pageLabel: t('footer.pageLabel'),
    },
    audience: {
      venture: t('audience.venture'),
      bank: t('audience.bank'),
      corporate: t('audience.corporate'),
    },
    blocks: {
      valueProposition: t('blocks.valueProposition'),
      customerSegments: t('blocks.customerSegments'),
      channels: t('blocks.channels'),
      revenue: t('blocks.revenue'),
      costs: t('blocks.costs'),
      keyResources: t('blocks.keyResources'),
      keyActivities: t('blocks.keyActivities'),
      keyPartners: t('blocks.keyPartners'),
      team: t('blocks.team'),
    },
    statusLabels: {
      strong: t('statusLabels.strong'),
      good: t('statusLabels.good'),
      needsWork: t('statusLabels.needsWork'),
      critical: t('statusLabels.critical'),
    },
    businessScores: {
      title: t('businessScores.title'),
      intro: t('businessScores.intro'),
      colBlock: t('businessScores.colBlock'),
      colScore: t('businessScores.colScore'),
      colStatus: t('businessScores.colStatus'),
      averageBlockScore: t('businessScores.averageBlockScore'),
      legend: t('businessScores.legend'),
      strongBold: t('businessScores.strongBold'),
      strongText: t('businessScores.strongText'),
      goodBold: t('businessScores.goodBold'),
      goodText: t('businessScores.goodText'),
      needsWorkBold: t('businessScores.needsWorkBold'),
      needsWorkText: t('businessScores.needsWorkText'),
      criticalBold: t('businessScores.criticalBold'),
      criticalText: t('businessScores.criticalText'),
    },
    financial: {
      title: t('financial.title'),
      noData: t('financial.noData'),
      unitEconomics: t('financial.unitEconomics'),
      ltv: t('financial.ltv'),
      cac: t('financial.cac'),
      ltvCacRatio: t('financial.ltvCacRatio'),
      paybackPeriod: t('financial.paybackPeriod'),
      months: t('financial.months'),
      grossMargin: t('financial.grossMargin'),
      monthlyChurn: t('financial.monthlyChurn'),
      breakEvenHeading: t('financial.breakEvenHeading'),
      breakEvenMonth: t('financial.breakEvenMonth'),
      breakEvenCustomers: t('financial.breakEvenCustomers'),
      breakEvenMrr: t('financial.breakEvenMrr'),
      projections12: t('financial.projections12'),
      colMonth: t('financial.colMonth'),
      colRevenue: t('financial.colRevenue'),
      colCosts: t('financial.colCosts'),
      colProfit: t('financial.colProfit'),
      colUsers: t('financial.colUsers'),
    },
    recommendations: {
      title: t('recommendations.title'),
      titleLong: t('recommendations.titleLong'),
      empty: t('recommendations.empty'),
      intro: t('recommendations.intro'),
      criticalSection: t('recommendations.criticalSection'),
      highSection: t('recommendations.highSection'),
      mediumSection: t('recommendations.mediumSection'),
      category: t('recommendations.category'),
      effort: t('recommendations.effort'),
      timeline: t('recommendations.timeline'),
      actionSteps: t('recommendations.actionSteps'),
      expectedImpact: t('recommendations.expectedImpact'),
    },
    growthPlan: {
      title: t('growthPlan.title'),
      intro: t('growthPlan.intro'),
      phasePrefix: t('growthPlan.phasePrefix'),
      goals: t('growthPlan.goals'),
      keyActions: t('growthPlan.keyActions'),
      milestones: t('growthPlan.milestones'),
      teamSize: t('growthPlan.teamSize'),
      successMetrics: t('growthPlan.successMetrics'),
    },
    experts: {
      title: t('experts.title'),
      intro: t('experts.intro'),
      confidence: t('experts.confidence'),
      keyFindings: t('experts.keyFindings'),
      criticalRisks: t('experts.criticalRisks'),
      likelihood: t('experts.likelihood'),
      impact: t('experts.impact'),
      mitigation: t('experts.mitigation'),
      concerns: t('experts.concerns'),
      recommendations: t('experts.recommendations'),
      disclaimer: t('experts.disclaimer'),
    },
  };
}
