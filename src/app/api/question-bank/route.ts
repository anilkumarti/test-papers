import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectCode = searchParams.get('subject') || 'ALL'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const PAGE_SIZE = 20

    // Fetch subjects for filter chips
    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, code, name_hi, color')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    const subjectMap = Object.fromEntries((subjects ?? []).map((s: any) => [s.id, s]))

    // Build query
    let query = supabase
      .from('questions')
      .select('id, text_hi, option_a, option_b, option_c, option_d, correct, subject_id, difficulty', { count: 'exact' })
      .eq('source', 'MPESB PYQ Bank')

    if (subjectCode !== 'ALL') {
      const sub = (subjects ?? []).find((s: any) => s.code === subjectCode)
      if (sub) query = query.eq('subject_id', sub.id)
    }

    const from = (page - 1) * PAGE_SIZE
    query = query.range(from, from + PAGE_SIZE - 1).order('id', { ascending: true })

    const { data: qs, count, error } = await query
    if (error) throw error

    const questions = (qs ?? []).map((q: any) => ({
      id: q.id,
      textHi: q.text_hi,
      optionA: q.option_a,
      optionB: q.option_b,
      optionC: q.option_c,
      optionD: q.option_d,
      correct: q.correct,
      difficulty: q.difficulty,
      subjectCode: subjectMap[q.subject_id]?.code ?? 'GK',
      subjectName: subjectMap[q.subject_id]?.name_hi ?? '',
      subjectColor: subjectMap[q.subject_id]?.color ?? '#3b82f6',
    }))

    // Subject counts for filters
    const subjectCounts: Record<string, number> = {}
    for (const sub of (subjects ?? [])) {
      const { count: c } = await supabase
        .from('questions')
        .select('id', { count: 'exact', head: true })
        .eq('source', 'MPESB PYQ Bank')
        .eq('subject_id', sub.id)
      subjectCounts[sub.code] = c ?? 0
    }

    return NextResponse.json({
      questions,
      total: count ?? 0,
      page,
      pageSize: PAGE_SIZE,
      subjects: subjects ?? [],
      subjectCounts,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
