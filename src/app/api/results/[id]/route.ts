import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapAttempt, mapTest, mapQuestion, mapSubject, mapTopic, mapQA } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'अनधिकृत' }, { status: 401 })
    const { id } = await params

    const { data: row } = await supabase
      .from('test_attempts')
      .select('*, mock_tests(*), question_attempts(*, questions(*, subjects(*), topics(*)))')
      .eq('id', id).eq('user_id', session.userId).eq('is_completed', true)
      .maybeSingle()
    if (!row) return NextResponse.json({ error: 'परिणाम नहीं मिला' }, { status: 404 })

    const subjectStats: Record<string, { name: string; nameHi: string; color: string; correct: number; wrong: number; unattempted: number; total: number }> = {}
    let totalCorrect = 0, totalWrong = 0, totalUnattempted = 0

    const answers = (row.question_attempts ?? []).map((qa: any) => {
      const subId = qa.questions.subject_id
      if (!subjectStats[subId]) {
        subjectStats[subId] = { name: qa.questions.subjects.name, nameHi: qa.questions.subjects.name_hi, color: qa.questions.subjects.color, correct: 0, wrong: 0, unattempted: 0, total: 0 }
      }
      subjectStats[subId].total++
      if (qa.selected_option === null) { subjectStats[subId].unattempted++; totalUnattempted++ }
      else if (qa.is_correct) { subjectStats[subId].correct++; totalCorrect++ }
      else { subjectStats[subId].wrong++; totalWrong++ }

      return {
        ...mapQA(qa),
        question: { ...mapQuestion(qa.questions), subject: mapSubject(qa.questions.subjects), topic: mapTopic(qa.questions.topics) },
      }
    })

    const attempt = { ...mapAttempt(row), test: mapTest(row.mock_tests), answers }

    return NextResponse.json({
      attempt,
      stats: {
        totalCorrect, totalWrong, totalUnattempted,
        attempted: totalCorrect + totalWrong,
        accuracy: totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0,
      },
      subjectStats: Object.values(subjectStats),
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
