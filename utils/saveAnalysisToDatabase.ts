import { createClient } from '@/lib/supabase/server';
import type { AnalysisApiResponse } from '@/types/analysis-api';
import type { ProjectData } from '@/types/project';

interface AnalysisWithMeta {
  audienceType: 'venture' | 'bank' | 'corporate';
  analysis: AnalysisApiResponse;
  userPrompt: string;
  systemPrompt: string;
  rawResponse: any;
}

interface SaveAnalysisParams {
  userId: string | null;
  projectData: ProjectData;
  projectId?: string;
  analyses: AnalysisWithMeta[];
}

export async function saveAnalysisToDatabase({
  userId,
  projectData,
  projectId,
  analyses,
}: SaveAnalysisParams) {
  const supabase = await createClient();

  try {
    console.log('🔵 Starting saveAnalysisToDatabase...');
    console.log('User ID:', userId);
    console.log('Project name:', projectData.basicInfo.projectName);
    
    let project: any;
    let versionNumber = 1;
    
    // 1. Check if projectId provided - update existing or create new
    if (projectId) {
      console.log('🔍 Looking for existing project:', projectId);
      
      const { data: existingProject, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', userId)
        .single();
      
      if (existingProject && !fetchError) {
        // Project exists - increment version
        versionNumber = existingProject.current_version + 1;
        console.log(`✅ Found existing project, new version: ${versionNumber}`);
        
        // Update project with new version
        const { data: updatedProject, error: updateError } = await supabase
          .from('projects')
          .update({
            current_version: versionNumber,
            name: projectData.basicInfo.projectName,
            industry: projectData.basicInfo.industry || null,
            stage: projectData.basicInfo.stage || null,
          })
          .eq('id', projectId)
          .select()
          .single();
        
        if (updateError || !updatedProject) {
          console.error('❌ Error updating project:', updateError);
          throw new Error('Failed to update project');
        }
        
        project = updatedProject;
        console.log('✅ Project updated:', project.id);
      } else {
        console.log('⚠️ Project not found or unauthorized, creating new project');
        projectId = undefined; // Reset to create new project
      }
    }
    
    if (!projectId || !project) {
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          name: projectData.basicInfo.projectName,
          industry: projectData.basicInfo.industry || null,
          stage: projectData.basicInfo.stage || null,
          current_version: 1,
        })
        .select()
        .single();

      if (projectError || !newProject) {
        console.error('❌ Error creating project:', projectError);
        throw new Error('Failed to create project');
      }
      
      project = newProject;
      versionNumber = 1;
      console.log('✅ Project created:', project.id);
    }

    // 2. Create 3 project versions (one for each audience)
    const versionInserts = analyses.map(({ audienceType, analysis }) => ({
      project_id: project.id,
      version_number: versionNumber,
      audience_type: audienceType,
      
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
    }));

    console.log('🔵 Inserting', versionInserts.length, 'versions...');
    
    const { data: versions, error: versionError } = await supabase
      .from('project_versions')
      .insert(versionInserts)
      .select();

    if (versionError || !versions || versions.length !== 3) {
      console.error('❌ Error creating versions:', versionError);
      throw new Error('Failed to create project versions');
    }
    
    console.log('✅ Versions created:', versions.map(v => v.id));

    // 3. Log all prompts and responses
    const logInserts = analyses.map((item, index) => ({
      project_version_id: versions[index].id,
      user_prompt: item.userPrompt,
      system_prompt: item.systemPrompt,
      openai_response: item.rawResponse,
    }));

    console.log('🔵 Inserting', logInserts.length, 'log entries...');
    
    const { error: logError } = await supabase
      .from('openai_analysis_log')
      .insert(logInserts);

    if (logError) {
      console.error('⚠️ Failed to write openai_analysis_log:', logError);
    } else {
      console.log('✅ Logs saved successfully');
    }

    console.log('🎉 All data saved successfully!');
    
    return {
      projectId: project.id,
      version: versionNumber,
      versionIds: versions.map(v => v.id),
      success: true,
    };
  } catch (error) {
    console.error('❌ Error saving to database:', error);
    throw error;
  }
}
