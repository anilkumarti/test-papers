import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapQuestion, mapSubject, mapTopic } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subjectId')
    const difficulty = searchParams.get('difficulty')
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = 20

    let dataQ = supabase.from('questions').select('*, subjects(*), topics(*)').order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1)
    let countQ = supabase.from('questions').select('*', { count: 'exact', head: true })
    if (subjectId) { dataQ = dataQ.eq('subject_id', subjectId); countQ = countQ.eq('subject_id', subjectId) }
    if (difficulty) { dataQ = dataQ.eq('difficulty', difficulty); countQ = countQ.eq('difficulty', difficulty) }

    const [{ data: rows }, { count: total }] = await Promise.all([dataQ, countQ])
    const questions = (rows ?? []).map((q: any) => ({
      ...mapQuestion(q),
      subject: q.subjects ? mapSubject(q.subjects) : null,
      topic: q.topics ? mapTopic(q.topics) : null,
    }))
    return NextResponse.json({ questions, total: total ?? 0, page, pages: Math.ceil((total ?? 0) / limit) })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const data = await req.json()
    const { data: row, error } = await supabase.from('questions').insert({
      text_hi: data.textHi, text_en: data.textEn || null,
      option_a: data.optionA, option_b: data.optionB, option_c: data.optionC, option_d: data.optionD,
      correct: data.correct, explanation: data.explanation, explan_hi: data.explanHi || null,
      subject_id: data.subjectId, topic_id: data.topicId,
      difficulty: data.difficulty || 'MEDIUM', source: data.source || null, tags: data.tags || null,
      is_active: data.isActive !== false,
    }).select().single()
    if (error) throw error
    return NextResponse.json({ question: mapQuestion(row) })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
