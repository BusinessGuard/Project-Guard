import { createClient } from '@/lib/supabase/server';
import type { Analysis, BlockScores, ConsensusFindings, AnalysisExperts, AnalysisRecommendations, AnalysisGrowthPlan, AnalysisFinancialForecast } from '@/store/useAnalizeStore.types';

export interface ProjectVersionWithAudience {
  id: string;
  project_id: string;
  version_number: number;
  audience_type: 'venture' | 'bank' | 'corporate';
  overall_score: number | null;
  created_at: string;
  name?: string;
  industry?: string;
  stage?: string;
  analysis?: Analysis;
  [key: string]: any;
}

export type VersionsByAudience = {
  [versionNumber: number]: {
    venture?: ProjectVersionWithAudience;
    bank?: ProjectVersionWithAudience;
    corporate?: ProjectVersionWithAudience;
  };
};

function formatVersionToAnalysis(version: any): Analysis {
  const blockScores: BlockScores = {
    valueProposition: version.score_value_proposition || 0,
    customerSegments: version.score_customer_segments || 0,
    channels: version.score_channels || 0,
    revenue: version.score_revenue || 0,
    costs: version.score_costs || 0,
    keyResources: version.score_key_resources || 0,
    keyActivities: version.score_key_activities || 0,
    keyPartners: version.score_key_partners || 0,
    team: version.score_team || 0,
  };

  const consensusFindings: ConsensusFindings = {
    topStrengths: version.consensus_strengths || [],
    topWeaknesses: version.consensus_weaknesses || [],
  };

  const experts = (version.experts as AnalysisExperts) || { list: [] };
  const recommendations = (version.recommendations as AnalysisRecommendations) || { list: [] };
  const growthPlan = (version.growth_phases as AnalysisGrowthPlan) || { phases: {} };

  const financialForecast: AnalysisFinancialForecast = {
    unitEconomics: {
      ltv: version.fin_ltv || 0,
      cac: version.fin_cac || 0,
      ltvCacRatio: version.fin_ltv_cac_ratio || 0,
      paybackPeriod: version.fin_payback_period || 0,
      grossMargin: version.fin_gross_margin || 0,
      churnRate: version.fin_churn_rate || 0,
    },
    breakEven: {
      month: version.fin_break_even_month || 0,
      customers: version.fin_break_even_customers || 0,
      mrr: version.fin_break_even_mrr || 0,
    },
    monthlyProjections: (version.fin_monthly_projections as any[]) || [],
  };

  return {
    scores: {
      overall: version.overall_score || 0,
      readiness: version.readiness_status || 'Not Ready',
      blocks: blockScores,
    },
    benchmark: {
      percentile: version.benchmark_percentile || 0,
      betterThan: version.benchmark_better_than || 0,
    },
    consensus: {
      findings: consensusFindings,
    },
    experts,
    recommendations,
    growthPlan,
    financialForecast,
  };
}

export async function getVersions(projectId: string): Promise<VersionsByAudience> {
  const supabase = await createClient();
  
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('name, industry, stage')
    .eq('id', projectId)
    .single();
  
  if (projectError) {
    console.error('Failed to load project:', projectError);
  }
  
  const { data: versions, error } = await supabase
    .from('project_versions')
    .select('*')
    .eq('project_id', projectId)
    .order('version_number', { ascending: true })
    .order('audience_type', { ascending: true });

  if (error) {
    throw new Error(`Failed to load versions: ${error.message}`);
  }

  const versionsList = (versions || []) as any[];
  
  // Group versions by version_number and audience_type
  const groupedVersions: VersionsByAudience = {};
  
  versionsList.forEach((version) => {
    const versionNumber = version.version_number;
    
    if (!groupedVersions[versionNumber]) {
      groupedVersions[versionNumber] = {};
    }
    
    // Форматируем версию с analysis и информацией о проекте
    const formattedVersion: ProjectVersionWithAudience = {
      id: version.id,
      project_id: version.project_id,
      version_number: version.version_number,
      audience_type: version.audience_type,
      overall_score: version.overall_score,
      created_at: version.created_at,
      name: project?.name || version.name,
      industry: project?.industry || version.industry,
      stage: project?.stage || version.stage,
      analysis: formatVersionToAnalysis(version),
    };
    
    groupedVersions[versionNumber][version.audience_type as 'venture' | 'bank' | 'corporate'] = formattedVersion;
  });

  return groupedVersions;
}