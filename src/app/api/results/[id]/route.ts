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

    const subjectStats: Record<string, {
      name: string; nameHi: string; color: string;
      correct: number; wrong: number; unattempted: number; total: number;
      timeTaken: number;
    }> = {}

    const topicStats: Record<string, {
      subjectNameHi: string; subjectColor: string;
      nameHi: string; correct: number; wrong: number; unattempted: number; total: number; timeTaken: number;
    }> = {}

    const difficultyStats: Record<string, { correct: number; wrong: number; unattempted: number; total: number }> = {
      EASY: { correct: 0, wrong: 0, unattempted: 0, total: 0 },
      MEDIUM: { correct: 0, wrong: 0, unattempted: 0, total: 0 },
      HARD: { correct: 0, wrong: 0, unattempted: 0, total: 0 },
    }

    let totalCorrect = 0, totalWrong = 0, totalUnattempted = 0

    const answers = (row.question_attempts ?? []).map((qa: any) => {
      const q = qa.questions
      const subId = q.subject_id
      const topicId = q.topic_id
      const diff = q.difficulty ?? 'MEDIUM'
      const timeTaken = qa.time_taken ?? 0

      // Subject stats
      if (!subjectStats[subId]) {
        subjectStats[subId] = { name: q.subjects.name, nameHi: q.subjects.name_hi, color: q.subjects.color, correct: 0, wrong: 0, unattempted: 0, total: 0, timeTaken: 0 }
      }
      subjectStats[subId].total++
      subjectStats[subId].timeTaken += timeTaken

      // Topic stats
      if (!topicStats[topicId]) {
        topicStats[topicId] = { subjectNameHi: q.subjects.name_hi, subjectColor: q.subjects.color, nameHi: q.topics.name_hi, correct: 0, wrong: 0, unattempted: 0, total: 0, timeTaken: 0 }
      }
      topicStats[topicId].total++
      topicStats[topicId].timeTaken += timeTaken

      // Difficulty stats
      if (difficultyStats[diff]) difficultyStats[diff].total++

      if (qa.selected_option === null) {
        subjectStats[subId].unattempted++
        topicStats[topicId].unattempted++
        if (difficultyStats[diff]) difficultyStats[diff].unattempted++
        totalUnattempted++
      } else if (qa.is_correct) {
        subjectStats[subId].correct++
        topicStats[topicId].correct++
        if (difficultyStats[diff]) difficultyStats[diff].correct++
        totalCorrect++
      } else {
        subjectStats[subId].wrong++
        topicStats[topicId].wrong++
        if (difficultyStats[diff]) difficultyStats[diff].wrong++
        totalWrong++
      }

      return {
        ...mapQA(qa),
        question: { ...mapQuestion(q), subject: mapSubject(q.subjects), topic: mapTopic(q.topics) },
      }
    })

    // Weak areas: topics with lowest accuracy among attempted questions, sorted worst first
    const weakAreas = Object.values(topicStats)
      .filter(t => t.correct + t.wrong > 0)
      .map(t => ({ ...t, accuracy: Math.round(t.correct / (t.correct + t.wrong) * 100) }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5)

    const attempt = { ...mapAttempt(row), test: mapTest(row.mock_tests), answers }

    return NextResponse.json({
      attempt,
      stats: {
        totalCorrect, totalWrong, totalUnattempted,
        attempted: totalCorrect + totalWrong,
        accuracy: totalCorrect + totalWrong > 0 ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100) : 0,
      },
      subjectStats: Object.values(subjectStats),
      topicStats: Object.values(topicStats),
      difficultyStats,
      weakAreas,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
