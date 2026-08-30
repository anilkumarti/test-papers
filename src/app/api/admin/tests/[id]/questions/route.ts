import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapTestQuestion } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const { data: rows } = await supabase
      .from('test_questions').select('*, questions(*, subjects(*), topics(*))')
      .eq('test_id', id).order('sort_order', { ascending: true })
    return NextResponse.json({ questions: (rows ?? []).map(mapTestQuestion) })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const { subjectDistribution } = await req.json()

    await supabase.from('test_questions').delete().eq('test_id', id)

    let order = 0
    for (const dist of subjectDistribution) {
      const { data: questions } = await supabase.from('questions')
        .select('id').eq('subject_id', dist.subjectId).eq('is_active', true)
        .order('created_at', { ascending: true }).limit(dist.count)
      const rows = (questions ?? []).map(q => ({ test_id: id, question_id: q.id, sort_order: order++ }))
      if (rows.length > 0) await supabase.from('test_questions').insert(rows)
    }
    return NextResponse.json({ success: true, total: order })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
