import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('analysis_jobs')
      .select('id, status, project_id, error_message')
      .eq('id', jobId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      jobId: data.id,
      status: data.status,
      projectId: data.project_id,
      error: data.error_message,
    });
  } catch (error) {
    console.error('❌ Job status error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch job status' },
      { status: 500 }
    );
  }
}
