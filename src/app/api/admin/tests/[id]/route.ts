import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapTest } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const data = await req.json()
    const { data: row, error } = await supabase.from('mock_tests').update({
      title: data.title, title_hi: data.titleHi, description: data.description, type: data.type,
      total_questions: data.totalQuestions, total_marks: data.totalMarks,
      duration: data.duration, negative_marks: data.negativeMarks,
      is_published: data.isPublished, is_active: data.isActive, sort_order: data.order,
    }).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ test: mapTest(row) })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const { error } = await supabase.from('mock_tests').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
