import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json()
    
    console.log('🔄 Transfer project request:', { projectId })
    
    if (!projectId) {
      console.error('❌ No project ID provided')
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    console.log('👤 User:', user?.id)
    
    if (!user) {
      console.error('❌ User not authenticated')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // First, check if project exists and is anonymous
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('id, user_id, name')
      .eq('id', projectId)
      .single()
    
    console.log('📦 Project before transfer:', project)
    
    if (fetchError) {
      console.error('❌ Failed to fetch project:', fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }
    
    if (!project) {
      console.error('❌ Project not found')
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    if (project.user_id !== null) {
      console.error('❌ Project already has a user:', project.user_id)
      return NextResponse.json({ error: 'Project already assigned' }, { status: 400 })
    }
    
    // Update project to assign it to the user
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({ user_id: user.id })
      .eq('id', projectId)
      .is('user_id', null)
      .select()
    
    console.log('📦 Project after transfer:', updatedProject)
    
    if (updateError) {
      console.error('❌ Failed to transfer project:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
    
    console.log('✅ Anonymous project transferred to user:', user.id)
    
    return NextResponse.json({ success: true, project: updatedProject })
  } catch (error) {
    console.error('❌ Transfer project error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
