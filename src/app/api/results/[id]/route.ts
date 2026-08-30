import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'अनधिकृत' }, { status: 401 })
    const { id } = await params

    const attempt = await prisma.testAttempt.findFirst({
      where: { id, userId: session.userId, isCompleted: true },
      include: {
        test: true,
        answers: {
          include: {
            question: {
              include: { subject: true, topic: true }
            }
          }
        }
      }
    })
    if (!attempt) return NextResponse.json({ error: 'परिणाम नहीं मिला' }, { status: 404 })

    // Compute per-subject stats
    const subjectStats: Record<string, { name: string; nameHi: string; color: string; correct: number; wrong: number; unattempted: number; total: number }> = {}
    let totalCorrect = 0, totalWrong = 0, totalUnattempted = 0

    for (const qa of attempt.answers) {
      const subId = qa.question.subjectId
      if (!subjectStats[subId]) {
        subjectStats[subId] = {
          name: qa.question.subject.name,
          nameHi: qa.question.subject.nameHi,
          color: qa.question.subject.color,
          correct: 0, wrong: 0, unattempted: 0, total: 0
        }
      }
      subjectStats[subId].total++
      if (qa.selectedOption === null) {
        subjectStats[subId].unattempted++
        totalUnattempted++
      } else if (qa.isCorrect) {
        subjectStats[subId].correct++
        totalCorrect++
      } else {
        subjectStats[subId].wrong++
        totalWrong++
      }
    }

    return NextResponse.json({
      attempt,
      stats: {
        totalCorrect, totalWrong, totalUnattempted,
        attempted: totalCorrect + totalWrong,
        accuracy: totalCorrect + totalWrong > 0
          ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
          : 0,
      },
      subjectStats: Object.values(subjectStats)
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
