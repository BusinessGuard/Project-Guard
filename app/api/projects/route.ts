import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeProject } from '@/utils/analizeProject';
import { saveAnalysisToDatabase } from '@/utils/saveAnalysisToDatabase';

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  let jobId: string | undefined;
  try {
    console.log('🚀 POST /api/projects - Starting...');
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const body = await request.json();
    const { projectData, projectId, jobId: requestJobId } = body;
    jobId = requestJobId;
    
    console.log('📦 Project:', projectData.basicInfo.projectName);
    console.log('👤 User:', user?.id || 'anonymous');

    if (jobId) {
      await supabase
        .from('analysis_jobs')
        .update({ status: 'processing', error_message: null, updated_at: new Date().toISOString() })
        .eq('id', jobId);
    }

    const audienceTypes = ['venture', 'bank', 'corporate'] as const;
    console.log(`🔵 Starting ${audienceTypes.length} AI analyses...`);
    
    const analysisStartTime = Date.now();
    const results = await Promise.all(
      audienceTypes.map((audienceType) => analyzeProject(projectData, 'ru', audienceType))
    );
    
    const analysisDuration = ((Date.now() - analysisStartTime) / 1000).toFixed(1);
    console.log(`✅ AI analyses completed in ${analysisDuration}s`);

    console.log('💾 Saving to database...');
    const saveResult = await saveAnalysisToDatabase({
      userId: user?.id || null,
      projectData,
      projectId: projectId || undefined,
      analyses: results.map((result, index) => ({
        audienceType: audienceTypes[index],
        analysis: result.analysis,
        userPrompt: result.userPrompt,
        systemPrompt: result.systemPrompt,
        rawResponse: result.rawResponse,
      })),
    });

    console.log('✅ Complete! Project ID:', saveResult.projectId);

    if (jobId) {
      await supabase
        .from('analysis_jobs')
        .update({
          status: 'completed',
          project_id: saveResult.projectId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', jobId);
    }

    return NextResponse.json({ 
      success: true, 
      projectId: saveResult.projectId,
      jobId,
      versionIds: saveResult.versionIds,
      analyses: results.map(r => r.analysis)
    });
  } catch (error) {
    console.error('❌ Error:', error);
    if (jobId) {
      try {
        const supabase = await createClient();
        await supabase
          .from('analysis_jobs')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Failed to analyze project',
            updated_at: new Date().toISOString(),
          })
          .eq('id', jobId);
      } catch (jobUpdateError) {
        console.error('❌ Failed to update job status:', jobUpdateError);
      }
    }
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to analyze project' },
      { status: 500 }
    );
  }
}
