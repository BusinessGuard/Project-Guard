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
      
      // Build query conditionally to avoid slow null comparisons
      let query = supabase
        .from('projects')
        .select('*')
        .eq('id', projectId);
      
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.is('user_id', null);
      }
      
      const { data: existingProject, error: fetchError } = await query.single();
      
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
      console.log('🔵 Creating new project...');
      console.log('  - user_id:', userId || 'null (anonymous)');
      console.log('  - project name:', projectData.basicInfo.projectName);
      
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

      console.log('📊 Project insert result:');
      console.log('  - data:', newProject ? `ID: ${newProject.id}` : 'null');
      console.log('  - error:', projectError);

      if (projectError || !newProject) {
        console.error('❌ Error creating project!');
        if (projectError) {
          console.error('🔍 ERROR DETAILS:');
          console.error('  - message:', projectError.message);
          console.error('  - code:', projectError.code);
          console.error('  - details:', projectError.details);
          console.error('  - hint:', projectError.hint);
        }
        throw new Error('Failed to create project');
      }
      
      project = newProject;
      versionNumber = 1;
      console.log('✅ Project created:', project.id);
      
      // Verify project was created and is accessible
      console.log('🔍 Verifying project accessibility...');
      const { data: verifyProject, error: verifyError } = await supabase
        .from('projects')
        .select('id, user_id, name')
        .eq('id', project.id)
        .single();
      
      console.log('📊 Verify result:');
      console.log('  - data:', verifyProject);
      console.log('  - error:', verifyError);
      
      if (verifyError) {
        console.error('⚠️ Project was created but cannot be read back!');
        console.error('  This suggests RLS is blocking anonymous reads');
      }
    }

    // 2. Create project versions (one for each audience)
    const versionInserts = analyses.map(({ audienceType, analysis }) => {
      // Validate that analysis has required structure
      if (!analysis || !analysis.scores || !analysis.experts) {
        console.error('❌ Invalid analysis structure for', audienceType);
        throw new Error(`Invalid analysis structure for ${audienceType}`);
      }

      return {
        project_id: project.id,
        version_number: versionNumber,
        audience_type: audienceType,
        
        // Canvas data (raw form data)
        canvas_data: projectData,
        
        // Scores
        overall_score: analysis.scores.overall ?? 0,
        readiness_status: analysis.scores.readiness ?? 'Not Ready',
        score_value_proposition: analysis.scores.blocks?.valueProposition ?? 0,
        score_customer_segments: analysis.scores.blocks?.customerSegments ?? 0,
        score_channels: analysis.scores.blocks?.channels ?? 0,
        score_revenue: analysis.scores.blocks?.revenue ?? 0,
        score_costs: analysis.scores.blocks?.costs ?? 0,
        score_key_resources: analysis.scores.blocks?.keyResources ?? 0,
        score_key_activities: analysis.scores.blocks?.keyActivities ?? 0,
        score_key_partners: analysis.scores.blocks?.keyPartners ?? 0,
        score_team: analysis.scores.blocks?.team ?? 0,
        
        // Benchmark
        benchmark_percentile: analysis.benchmark?.percentile ?? 0,
        benchmark_better_than: analysis.benchmark?.betterThan ?? 0,
        
        // Consensus
        consensus_strengths: analysis.consensus?.findings?.topStrengths ?? [],
        consensus_weaknesses: analysis.consensus?.findings?.topWeaknesses ?? [],
        
        // Complex data as JSONB
        experts: analysis.experts ?? [],
        recommendations: analysis.recommendations ?? [],
        growth_phases: analysis.growthPlan ?? [],
        
        // Financial metrics
        fin_ltv: analysis.financialForecast?.unitEconomics?.ltv ?? 0,
        fin_cac: analysis.financialForecast?.unitEconomics?.cac ?? 0,
        fin_ltv_cac_ratio: analysis.financialForecast?.unitEconomics?.ltvCacRatio ?? 0,
        fin_payback_period: analysis.financialForecast?.unitEconomics?.paybackPeriod ?? 0,
        fin_gross_margin: analysis.financialForecast?.unitEconomics?.grossMargin ?? 0,
        fin_churn_rate: analysis.financialForecast?.unitEconomics?.churnRate ?? 0,
        fin_break_even_month: analysis.financialForecast?.breakEven?.month ?? 0,
        fin_break_even_customers: analysis.financialForecast?.breakEven?.customers ?? 0,
        fin_break_even_mrr: analysis.financialForecast?.breakEven?.mrr ?? 0,
        fin_monthly_projections: analysis.financialForecast?.monthlyProjections ?? [],
      };
    });

    console.log('🔵 Inserting', versionInserts.length, 'versions...');
    console.log('📝 Version data sample:');
    console.log('  - project_id:', versionInserts[0]?.project_id);
    console.log('  - audience_type:', versionInserts[0]?.audience_type);
    console.log('  - version_number:', versionInserts[0]?.version_number);
    console.log('  - overall_score:', versionInserts[0]?.overall_score);
    
    const { data: versions, error: versionError } = await supabase
      .from('project_versions')
      .insert(versionInserts)
      .select();

    console.log('📊 Insert result:');
    console.log('  - data:', versions ? `${versions.length} rows` : 'null');
    console.log('  - error:', versionError);

    if (versionError || !versions || versions.length !== versionInserts.length) {
      console.error('❌ Error creating versions!');
      console.error('📊 Expected:', versionInserts.length, 'Got:', versions?.length || 0);
      
      if (versionError) {
        console.error('🔍 ERROR DETAILS:');
        console.error('  - message:', versionError.message);
        console.error('  - code:', versionError.code);
        console.error('  - details:', versionError.details);
        console.error('  - hint:', versionError.hint);
      }
      
      console.error('🔍 Project ID used:', versionInserts[0]?.project_id);
      
      // Check if project exists
      const { data: checkProject, error: checkError } = await supabase
        .from('projects')
        .select('id, user_id')
        .eq('id', versionInserts[0]?.project_id)
        .single();
      
      console.error('🔍 Project check result:', checkProject, 'Error:', checkError);
      
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
