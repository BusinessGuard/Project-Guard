import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeProject } from '@/utils/analizeProject';
import { saveAnalysisToDatabase } from '@/utils/saveAnalysisToDatabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/projects - Starting...');
    
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('❌ Unauthorized access');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('✅ User authenticated:', user.id);
    
    const body = await request.json();
    const { projectData, projectId } = body;
    
    console.log('📦 Project data received:', projectData.basicInfo.projectName);
    
    if (projectId) {
      console.log('🔍 Checking for existing project:', projectId);
    }

    // Run 3 analyses in parallel for 3 audience types
    const audienceTypes = ['venture', 'bank', 'corporate'] as const;
    
    console.log('🔵 Starting 3 AI analyses in parallel...');
    const analysisStartTime = Date.now();
    
    const analysisPromises = audienceTypes.map(audienceType => 
      analyzeProject(projectData, 'ru', audienceType)
    );

    const results = await Promise.all(analysisPromises);
    
    const analysisDuration = ((Date.now() - analysisStartTime) / 1000).toFixed(1);
    console.log(`✅ All 3 AI analyses completed in ${analysisDuration}s`);
    console.log('Results count:', results.length);

    // Save all 3 analyses to database
    console.log('💾 Saving to database...');
    
    const saveResult = await saveAnalysisToDatabase({
      userId: user.id,
      projectData,
      projectId: projectId || undefined,
      analyses: results.map((result, index) => ({
        audienceType: audienceTypes[index],
        analysis: result.analysis,
        userPrompt: result.userPrompt,
        rawResponse: result.rawResponse,
      })),
    });

    console.log('✅ Database save completed, Project ID:', saveResult.projectId);
    console.log('Version:', saveResult.version);

    return NextResponse.json({ 
      success: true, 
      message: 'Project analyzed and saved',
      projectId: saveResult.projectId,
      versionIds: saveResult.versionIds,
      analyses: results.map(r => r.analysis)
    });
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to analyze project' },
      { status: 500 }
    );
  }
}
