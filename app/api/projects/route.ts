import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { mapFormToDatabase } from '@/utils/mapFormToDatabase';
import { analyzeProject } from '@/utils/analizeProject';

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
    // Map form data to database structure
    const dbData = mapFormToDatabase(projectData);
    
    // Save project as draft
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        status: 'draft',
        ...dbData,
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
