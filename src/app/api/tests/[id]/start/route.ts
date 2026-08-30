import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapTest, mapTestQuestion, mapAttempt, mapQA } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'अनधिकृत' }, { status: 401 })
    const { id } = await params

    const { data: row } = await supabase
      .from('mock_tests')
      .select('*, test_questions(*, questions(*, subjects(*), topics(*)))')
      .eq('id', id).eq('is_published', true).eq('is_active', true)
      .maybeSingle()
    if (!row) return NextResponse.json({ error: 'टेस्ट नहीं मिला' }, { status: 404 })

    const { test_questions, ...testRest } = row as any
    const test = {
      ...mapTest(testRest),
      questions: (test_questions ?? []).map(mapTestQuestion).sort((a: any, b: any) => a.order - b.order),
    }

    // Resume existing incomplete attempt
    const { data: existingRow } = await supabase
      .from('test_attempts')
      .select('*, question_attempts(*)')
      .eq('user_id', session.userId).eq('test_id', id).eq('is_completed', false)
      .maybeSingle()

    if (existingRow) {
      const existing = { ...mapAttempt(existingRow), answers: (existingRow.question_attempts ?? []).map(mapQA) }
      return NextResponse.json({ attempt: existing, test, resumed: true })
    }

    const { data: attemptRow } = await supabase
      .from('test_attempts')
      .insert({ user_id: session.userId, test_id: id, total_marks: row.total_marks })
      .select().single()

    const qas = (test_questions ?? []).map((tq: any) => ({
      attempt_id: attemptRow.id, question_id: tq.question_id,
      selected_option: null, is_correct: null, is_marked: false,
    }))
    const { data: answers } = await supabase.from('question_attempts').insert(qas).select()

    return NextResponse.json({
      attempt: { ...mapAttempt(attemptRow), answers: (answers ?? []).map(mapQA) },
      test,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
