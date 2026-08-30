import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapAttempt } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'अनधिकृत' }, { status: 401 })
    const { id } = await params
    const { timeTaken } = await req.json()

    const { data: row } = await supabase
      .from('test_attempts')
      .select('*, mock_tests(negative_marks, total_marks), question_attempts(selected_option, is_correct)')
      .eq('id', id).eq('user_id', session.userId).eq('is_completed', false)
      .maybeSingle()
    if (!row) return NextResponse.json({ error: 'प्रयास नहीं मिला' }, { status: 404 })

    let score = 0, correct = 0, wrong = 0
    const negMark = row.mock_tests.negative_marks
    for (const qa of row.question_attempts) {
      if (qa.selected_option !== null) {
        if (qa.is_correct) { score += 1; correct++ }
        else { score -= negMark; wrong++ }
      }
    }
    const percentage = (score / row.mock_tests.total_marks) * 100
    const { data: updated } = await supabase.from('test_attempts').update({
      is_completed: true,
      submitted_at: new Date().toISOString(),
      score: Math.max(0, score),
      percentage: Math.max(0, percentage),
      time_taken: timeTaken ?? null,
    }).eq('id', id).select().single()

    return NextResponse.json({ attempt: mapAttempt(updated), score: Math.max(0, score), correct, wrong })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
