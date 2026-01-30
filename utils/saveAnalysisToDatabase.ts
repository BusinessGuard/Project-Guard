import { createClient } from '@/lib/supabase/server';
import type { AnalysisApiResponse } from '@/types/analysis-api';
import type { ProjectData } from '@/types/project';

interface SaveAnalysisParams {
  userId: string;
  projectData: ProjectData;
  analysis: AnalysisApiResponse;
}

export async function saveAnalysisToDatabase({
  userId,
  projectData,
  analysis,
}: SaveAnalysisParams) {
  const supabase = await createClient();

  try {
    // 1. Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        name: projectData.basicInfo.projectName,
        industry: projectData.basicInfo.industry || null,
        stage: projectData.basicInfo.stage || null,
      })
      .select()
      .single();

    if (projectError || !project) {
      console.error('Error creating project:', projectError);
      throw new Error('Failed to create project');
    }

    // 2. Create project version with analysis
    const { data: version, error: versionError } = await supabase
      .from('project_versions')
      .insert({
        project_id: project.id,
        version_number: 1,
        is_current: true,
        
        // Canvas data (raw form data)
        canvas_data: projectData,
        
        // Scores
        overall_score: analysis.scores.overall,
        readiness_status: analysis.scores.readiness,
        score_value_proposition: analysis.scores.blocks.valueProposition,
        score_customer_segments: analysis.scores.blocks.customerSegments,
        score_channels: analysis.scores.blocks.channels,
        score_revenue: analysis.scores.blocks.revenue,
        score_costs: analysis.scores.blocks.costs,
        score_key_resources: analysis.scores.blocks.keyResources,
        score_key_activities: analysis.scores.blocks.keyActivities,
        score_key_partners: analysis.scores.blocks.keyPartners,
        score_team: analysis.scores.blocks.team,
        
        // Benchmark
        benchmark_percentile: analysis.benchmark.percentile,
        benchmark_better_than: analysis.benchmark.betterThan,
        
        // Consensus
        consensus_strengths: analysis.consensus.findings.topStrengths,
        consensus_weaknesses: analysis.consensus.findings.topWeaknesses,
        
        // Complex data as JSONB
        experts: analysis.experts,
        recommendations: analysis.recommendations,
        growth_phases: analysis.growthPlan,
        
        // Financial metrics
        fin_ltv: analysis.financialForecast.unitEconomics.ltv,
        fin_cac: analysis.financialForecast.unitEconomics.cac,
        fin_ltv_cac_ratio: analysis.financialForecast.unitEconomics.ltvCacRatio,
        fin_payback_period: analysis.financialForecast.unitEconomics.paybackPeriod,
        fin_gross_margin: analysis.financialForecast.unitEconomics.grossMargin,
        fin_churn_rate: analysis.financialForecast.unitEconomics.churnRate,
        fin_break_even_month: analysis.financialForecast.breakEven.month,
        fin_break_even_customers: analysis.financialForecast.breakEven.customers,
        fin_break_even_mrr: analysis.financialForecast.breakEven.mrr,
        fin_monthly_projections: analysis.financialForecast.monthlyProjections,
      })
      .select()
      .single();

    if (versionError || !version) {
      console.error('Error creating version:', versionError);
      throw new Error('Failed to create project version');
    }

    return {
      projectId: project.id,
      versionId: version.id,
      success: true,
    };
  } catch (error) {
    console.error('Error saving to database:', error);
    throw error;
  }
}
