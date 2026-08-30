import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'अनधिकृत' }, { status: 401 })
    const { id } = await params
    const { timeTaken } = await req.json()

    const attempt = await prisma.testAttempt.findFirst({
      where: { id, userId: session.userId, isCompleted: false },
      include: {
        test: true,
        answers: { include: { question: { include: { subject: true } } } }
      }
    })
    if (!attempt) return NextResponse.json({ error: 'प्रयास नहीं मिला' }, { status: 404 })

    let score = 0
    let correct = 0
    let wrong = 0
    const negMark = attempt.test.negativeMarks

    for (const qa of attempt.answers) {
      if (qa.selectedOption !== null) {
        if (qa.isCorrect) {
          score += 1
          correct++
        } else {
          score -= negMark
          wrong++
        }
      }
    }

    const percentage = (score / attempt.test.totalMarks) * 100

    const updated = await prisma.testAttempt.update({
      where: { id },
      data: {
        isCompleted: true,
        submittedAt: new Date(),
        score: Math.max(0, score),
        percentage: Math.max(0, percentage),
        timeTaken: timeTaken ?? null,
      }
    })

    return NextResponse.json({ attempt: updated, score: Math.max(0, score), correct, wrong })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
