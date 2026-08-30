import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'अनधिकृत' }, { status: 401 })

    const attempts = await prisma.testAttempt.findMany({
      where: { userId: session.userId, isCompleted: true },
      include: { test: true },
      orderBy: { submittedAt: 'desc' }
    })

    const totalTests = attempts.length
    const bestScore = totalTests > 0 ? Math.max(...attempts.map(a => a.score ?? 0)) : 0
    const avgScore = totalTests > 0 ? attempts.reduce((s, a) => s + (a.score ?? 0), 0) / totalTests : 0
    const avgPct = totalTests > 0 ? attempts.reduce((s, a) => s + (a.percentage ?? 0), 0) / totalTests : 0

    // Subject-wise from question attempts
    const qAttempts = await prisma.questionAttempt.findMany({
      where: { attempt: { userId: session.userId } },
      include: { question: { include: { subject: true } } }
    })

    const subMap: Record<string, { name: string; nameHi: string; color: string; correct: number; total: number }> = {}
    for (const qa of qAttempts) {
      const sid = qa.question.subjectId
      if (!subMap[sid]) subMap[sid] = { name: qa.question.subject.name, nameHi: qa.question.subject.nameHi, color: qa.question.subject.color, correct: 0, total: 0 }
      subMap[sid].total++
      if (qa.isCorrect) subMap[sid].correct++
    }

    const subjectStats = Object.values(subMap).map(s => ({
      ...s,
      accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0
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
