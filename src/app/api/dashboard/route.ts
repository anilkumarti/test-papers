import { NextResponse } from 'next/server'
import { supabase, mapTest } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'अनधिकृत' }, { status: 401 })

    const { data: rows } = await supabase
      .from('test_attempts')
      .select('*, mock_tests(*)')
      .eq('user_id', session.userId).eq('is_completed', true)
      .order('submitted_at', { ascending: false })

    const attempts = (rows ?? []).map((a: any) => ({
      id: a.id, score: a.score, percentage: a.percentage,
      submittedAt: a.submitted_at, timeTaken: a.time_taken,
      test: mapTest(a.mock_tests),
    }))

    const totalTests = attempts.length
    const bestScore = totalTests > 0 ? Math.max(...attempts.map((a: any) => a.score ?? 0)) : 0
    const avgPct = totalTests > 0 ? attempts.reduce((s: number, a: any) => s + (a.percentage ?? 0), 0) / totalTests : 0

    // Score history (chronological) for trend chart
    const scoreHistory = [...attempts].reverse().map((a: any) => ({
      date: (a.submittedAt as string).slice(0, 10),
      percentage: Math.round(a.percentage ?? 0),
      score: a.score,
      totalMarks: a.test?.totalMarks ?? 100,
      titleHi: a.test?.titleHi ?? '',
    }))

    // Practice streak — consecutive days going back from today
    const dateSet = new Set(attempts.map((a: any) => (a.submittedAt as string).slice(0, 10)))
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const ds = d.toISOString().slice(0, 10)
      if (dateSet.has(ds)) streak++
      else if (i > 0) break
    }

    // Activity calendar — last 84 days (12 weeks)
    const activityMap: Record<string, number> = {}
    for (const a of attempts) {
      const ds = (a.submittedAt as string).slice(0, 10)
      activityMap[ds] = (activityMap[ds] ?? 0) + 1
    }
    const activityCalendar: { date: string; count: number }[] = []
    for (let i = 83; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      activityCalendar.push({ date: d.toISOString().slice(0, 10), count: activityMap[d.toISOString().slice(0, 10)] ?? 0 })
    }

    // Extended question-level aggregation
    const attemptIds = attempts.map((a: any) => a.id)
    const qAttempts = attemptIds.length > 0
      ? ((await supabase.from('question_attempts')
          .select('is_correct, selected_option, time_taken, questions(subject_id, difficulty, topic_id, subjects(name, name_hi, color), topics(name_hi))')
          .in('attempt_id', attemptIds)).data ?? []) as any[]
      : [] as any[]

    const subMap: Record<string, { name: string; nameHi: string; color: string; correct: number; total: number }> = {}
    const diffMap: Record<string, { correct: number; wrong: number; skipped: number; total: number }> = {
      EASY: { correct: 0, wrong: 0, skipped: 0, total: 0 },
      MEDIUM: { correct: 0, wrong: 0, skipped: 0, total: 0 },
      HARD: { correct: 0, wrong: 0, skipped: 0, total: 0 },
    }
    const topicAgg: Record<string, { nameHi: string; subjectNameHi: string; subjectColor: string; correct: number; total: number }> = {}
    let totalWrong = 0, totalSkipped = 0

    for (const qa of qAttempts) {
      if (!qa.questions) continue
      const q = qa.questions
      const skipped = qa.selected_option === null
      const correct = qa.is_correct === true

      // Subject
      const sid = q.subject_id
      if (!subMap[sid]) subMap[sid] = { name: q.subjects?.name ?? '', nameHi: q.subjects?.name_hi ?? '', color: q.subjects?.color ?? '#6b7280', correct: 0, total: 0 }
      subMap[sid].total++
      if (correct) subMap[sid].correct++

      // Difficulty
      const diff = (q.difficulty ?? 'MEDIUM') as string
      if (diffMap[diff]) {
        diffMap[diff].total++
        if (skipped) diffMap[diff].skipped++
        else if (correct) diffMap[diff].correct++
        else diffMap[diff].wrong++
      }

      // Topic
      if (q.topic_id && q.topics) {
        const tid = q.topic_id as string
        if (!topicAgg[tid]) topicAgg[tid] = { nameHi: q.topics.name_hi, subjectNameHi: q.subjects?.name_hi ?? '', subjectColor: q.subjects?.color ?? '#6b7280', correct: 0, total: 0 }
        topicAgg[tid].total++
        if (correct) topicAgg[tid].correct++
      }

      if (skipped) totalSkipped++
      else if (!correct) totalWrong++
    }

    const subjectStats = Object.values(subMap)
      .map(s => ({ ...s, accuracy: s.total > 0 ? Math.round(s.correct / s.total * 100) : 0 }))
      .sort((a, b) => b.accuracy - a.accuracy)

    const difficultyStats = Object.fromEntries(
      Object.entries(diffMap).map(([k, v]) => [k, {
        ...v,
        accuracy: v.correct + v.wrong > 0 ? Math.round(v.correct / (v.correct + v.wrong) * 100) : 0,
      }])
    )

    const topicStats = Object.values(topicAgg)
      .map(t => ({ ...t, accuracy: t.total > 0 ? Math.round(t.correct / t.total * 100) : 0 }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 8)

    const totalTimeSec = attempts.reduce((s: number, a: any) => s + (a.timeTaken ?? 0), 0)
    const totalAttempted = qAttempts.filter((qa: any) => qa.selected_option !== null).length
    const avgTimePerQuestion = totalAttempted > 0 ? Math.round(totalTimeSec / totalAttempted) : 0

    return NextResponse.json({
      totalTests,
      bestScore: Math.round(bestScore * 10) / 10,
      avgPercentage: Math.round(avgPct),
      totalQuestions: qAttempts.length,
      totalAttempted,
      totalWrong,
      totalSkipped,
      marksLost: Math.round(totalWrong * 0.25 * 10) / 10,
      avgTimePerQuestion,
      streak,
      scoreHistory,
      activityCalendar,
      recentAttempts: attempts.slice(0, 5),
      subjectStats,
      difficultyStats,
      topicStats,
      strongSubjects: subjectStats.filter(s => s.accuracy >= 70).slice(0, 3),
      weakSubjects: subjectStats.filter(s => s.accuracy < 60).slice(0, 3),
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
