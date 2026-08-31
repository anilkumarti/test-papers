import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectCode = searchParams.get('subject') || 'ALL'
    const page        = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const PAGE_SIZE   = 20

    // Fetch subjects
    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, code, name_hi, color')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    const subjectList = subjects ?? []
    const subjectMap  = Object.fromEntries(subjectList.map((s: any) => [s.id, s]))
    const codeToId    = Object.fromEntries(subjectList.map((s: any) => [s.code, s.id]))

    // Fetch all PYQ Bank questions' subject_id in one query for counts
    const { data: allIds } = await supabase
      .from('questions')
      .select('subject_id')
      .eq('source', 'MPESB PYQ Bank')

    const subjectCounts: Record<string, number> = {}
    let totalAll = 0
    for (const row of allIds ?? []) {
      const code = subjectMap[row.subject_id]?.code
      if (code) { subjectCounts[code] = (subjectCounts[code] ?? 0) + 1; totalAll++ }
    }

    // Build paginated question query
    let query = supabase
      .from('questions')
      .select('id, text_hi, option_a, option_b, option_c, option_d, correct, subject_id, difficulty', { count: 'exact' })
      .eq('source', 'MPESB PYQ Bank')

    if (subjectCode !== 'ALL') {
      const sid = codeToId[subjectCode]
      if (sid) query = query.eq('subject_id', sid)
    }

    const from = (page - 1) * PAGE_SIZE
    const { data: qs, count, error } = await query
      .range(from, from + PAGE_SIZE - 1)
      .order('id', { ascending: true })

    if (error) throw error

    const questions = (qs ?? []).map((q: any) => ({
      id:           q.id,
      textHi:       q.text_hi,
      optionA:      q.option_a,
      optionB:      q.option_b,
      optionC:      q.option_c,
      optionD:      q.option_d,
      correct:      q.correct,
      difficulty:   q.difficulty,
      subjectCode:  subjectMap[q.subject_id]?.code   ?? 'GK',
      subjectName:  subjectMap[q.subject_id]?.name_hi ?? '',
      subjectColor: subjectMap[q.subject_id]?.color   ?? '#3b82f6',
    }))

    return NextResponse.json({
      questions,
      total:        count ?? 0,
      totalAll,
      page,
      pageSize:     PAGE_SIZE,
      subjects:     subjectList,
      subjectCounts,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
