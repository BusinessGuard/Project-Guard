import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('analysis_jobs')
      .insert({
        user_id: user?.id || null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error || !data) {
      console.error('❌ Failed to create analysis job:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to create analysis job' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, jobId: data.id });
  } catch (error) {
    console.error('❌ Job create error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create analysis job' },
      { status: 500 }
    );
  }
}
