import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { openai } from '@/lib/openai';
import { createProjectPrompt, EXPERT_PANEL_SYSTEM_PROMPT } from '@/lib/prompts/project';

async function analyzeProject(projectData: any) {
  console.log('Project Data:', JSON.stringify(projectData, null, 2));

  const prompt = createProjectPrompt(projectData);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.5,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: EXPERT_PANEL_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error('Empty AI response');
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.error('AI response is not valid JSON:', content);
    throw new Error('Invalid AI response format');
  }

  // Validate required fields
  if (!parsed.overallScore || !parsed.expertAnalyses || !parsed.keyFindings) {
    console.error('Missing required fields in AI response:', parsed);
    throw new Error('Incomplete AI response');
  }

  console.log('Analysis Result:', JSON.stringify(parsed, null, 2));

  return parsed;
}

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
    
    // Save project as draft
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        status: 'draft',
        ...projectData,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    
    const analysisResult = await analyzeProject(projectData);
    
    // Update project status
    await supabase
      .from('projects')
      .update({ status: 'analyzed' })
      .eq('id', project.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project created and analyzed',
      project,
      analysis: analysisResult
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create project' },
      { status: 500 }
    );
  }
}
