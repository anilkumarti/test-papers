import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapQuestion } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const data = await req.json()
    const { data: row, error } = await supabase.from('questions').update({
      text_hi: data.textHi, text_en: data.textEn || null,
      option_a: data.optionA, option_b: data.optionB, option_c: data.optionC, option_d: data.optionD,
      correct: data.correct, explanation: data.explanation, explan_hi: data.explanHi || null,
      subject_id: data.subjectId, topic_id: data.topicId,
      difficulty: data.difficulty, source: data.source || null, tags: data.tags || null,
      is_active: data.isActive, needs_review: data.needsReview,
    }).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ question: mapQuestion(row) })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
