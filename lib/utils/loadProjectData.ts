import { createClient } from '@/lib/supabase/client';
import type { 
  ProjectInfoStore, 
  ProjectVersionDB, 
  Analysis,
  BlockScores,
  ConsensusFindings,
  AnalysisExperts,
  AnalysisRecommendations,
  AnalysisGrowthPlan,
  AnalysisFinancialForecast
} from '@/store/useAnalizeStore.types';

export async function loadUserProjects() {
  const supabase = createClient();
  
  // Refresh session to ensure we have the latest auth state
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    throw new Error('Failed to get session');
  }
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    throw new Error('User not authenticated. Please sign in again.');
  }
  
  // Query projects - RLS should automatically filter by user_id
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`);
  }
  
  return projects || [];
}

export async function loadProjectVersions(projectId: string): Promise<Array<ProjectVersionDB & { dbId: string }>> {
  const supabase = createClient();
  
  const { data: versions, error } = await supabase
    .from('project_versions')
    .select('id, version_number, overall_score, created_at')
    .eq('project_id', projectId)
    .order('version_number', { ascending: true });

  if (error) {
    throw new Error(`Failed to load versions: ${error.message}`);
  }

  if (!versions || versions.length === 0) {
    return [];
  }

  // Transform database format to ProjectVersionDB format
  return versions.map((v) => ({
    id: v.version_number, // Use version_number as id for display
    version: v.version_number,
    score: v.overall_score || 0,
    name: `Version ${v.version_number}`,
    date: new Date(v.created_at).toISOString().split('T')[0], // Format as YYYY-MM-DD
    dbId: v.id, // Keep database UUID for loading analysis
  }));
}

export async function loadVersionAnalysis(versionId: string): Promise<Analysis | null> {
  const supabase = createClient();
  
  const { data: version, error } = await supabase
    .from('project_versions')
    .select('*')
    .eq('id', versionId)
    .single();

  if (error || !version) {
    return null;
  }

  // Transform database format to Analysis format
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

  const analysis: Analysis = {
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

  return analysis;
}

export async function loadFirstProjectWithVersions(): Promise<{
  project: ProjectInfoStore | null;
  versions: ProjectVersionDB[];
  firstVersionAnalysis: Analysis | null;
  versionsWithDbIds: Array<{ id: string; version: number; score: number; name: string; date: string; dbId: string }>;
}> {
  const projects = await loadUserProjects();
  
  if (projects.length === 0) {
    return { project: null, versions: [], firstVersionAnalysis: null, versionsWithDbIds: [] };
  }

  const firstProject = projects[0];
  const versionsWithDbIds = await loadProjectVersions(firstProject.id);

  // Extract versions without dbId for compatibility
  const versions: ProjectVersionDB[] = versionsWithDbIds.map(({ dbId, ...v }) => v);

  // Load analysis for the first version (if exists)
  let firstVersionAnalysis: Analysis | null = null;

  if (versionsWithDbIds.length > 0) {
    const firstVersion = versionsWithDbIds[0];
    firstVersionAnalysis = await loadVersionAnalysis(firstVersion.dbId);
  }

  return {
    project: {
      id: firstProject.id,
      name: firstProject.name,
      industry: firstProject.industry || '',
      stage: firstProject.stage || '',
    },
    versions,
    firstVersionAnalysis,
    versionsWithDbIds: versionsWithDbIds.map(v => ({
      id: v.dbId,
      version: v.version,
      score: v.score,
      name: v.name,
      date: v.date,
      dbId: v.dbId,
    })),
  };
}
