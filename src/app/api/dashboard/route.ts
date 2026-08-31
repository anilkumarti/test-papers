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
      id: a.id,
      score: a.score,
      percentage: a.percentage,
      submittedAt: a.submitted_at,
      timeTaken: a.time_taken,
      test: mapTest(a.mock_tests),
    }))
    const totalTests = attempts.length
    const bestScore = totalTests > 0 ? Math.max(...attempts.map((a: any) => a.score ?? 0)) : 0
    const avgScore = totalTests > 0 ? attempts.reduce((s: number, a: any) => s + (a.score ?? 0), 0) / totalTests : 0
    const avgPct = totalTests > 0 ? attempts.reduce((s: number, a: any) => s + (a.percentage ?? 0), 0) / totalTests : 0

    const attemptIds = attempts.map((a: any) => a.id)
    const qAttempts = attemptIds.length > 0
      ? (await supabase.from('question_attempts').select('is_correct, questions(subject_id, subjects(name, name_hi, color))').in('attempt_id', attemptIds)).data ?? []
      : []

    const subMap: Record<string, { name: string; nameHi: string; color: string; correct: number; total: number }> = {}
    for (const qa of qAttempts as any[]) {
      if (!qa.questions) continue
      const sid = qa.questions.subject_id
      if (!subMap[sid]) subMap[sid] = { name: qa.questions.subjects?.name ?? '', nameHi: qa.questions.subjects?.name_hi ?? '', color: qa.questions.subjects?.color ?? '#6b7280', correct: 0, total: 0 }
      subMap[sid].total++
      if (qa.is_correct) subMap[sid].correct++
    }

    const subjectStats = Object.values(subMap).map(s => ({
      ...s, accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0
    })).sort((a, b) => b.accuracy - a.accuracy)

    return NextResponse.json({
      totalTests,
      bestScore: Math.round(bestScore * 10) / 10,
      avgScore: Math.round(avgScore * 10) / 10,
      avgPercentage: Math.round(avgPct),
      totalQuestions: qAttempts.length,
      recentAttempts: attempts.slice(0, 5),
      subjectStats,
      strongSubjects: subjectStats.filter(s => s.accuracy >= 70).slice(0, 3),
      weakSubjects: subjectStats.filter(s => s.accuracy < 60).slice(0, 3),
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
