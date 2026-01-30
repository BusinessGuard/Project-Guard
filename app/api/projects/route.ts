import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeProject } from '@/utils/analizeProject';
import { saveAnalysisToDatabase } from '@/utils/saveAnalysisToDatabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const projectData = await request.json();

    // Analyze project (default to Russian)
    const { analysis, userPrompt, rawResponse } = await analyzeProject(projectData, 'ru');

    // Save to database
    const saveResult = await saveAnalysisToDatabase({
      userId: user.id,
      projectData,
      analysis,
    });

    // Debug: log user prompt and OpenAI response (only for new projects, when enabled)
    if (process.env.OPENAI_DEBUG_LOG === 'true') {
      const { error: logError } = await supabase.from('openai_analysis_log').insert({
        project_version_id: saveResult.versionId,
        user_prompt: userPrompt,
        openai_response: rawResponse,
      });
      if (logError) {
        console.error('Failed to write openai_analysis_log:', logError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Project analyzed and saved',
      projectId: saveResult.projectId,
      versionId: saveResult.versionId,
      analysis
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to analyze project' },
      { status: 500 }
    );
  }
}
