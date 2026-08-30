import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'अनधिकृत' }, { status: 401 })
    const { id } = await params

    const test = await prisma.mockTest.findUnique({
      where: { id, isPublished: true, isActive: true },
      include: {
        questions: {
          include: { question: { include: { subject: true, topic: true } } },
          orderBy: { order: 'asc' }
        }
      }
    })
    if (!test) return NextResponse.json({ error: 'टेस्ट नहीं मिला' }, { status: 404 })

    // Check for incomplete existing attempt
    const existing = await prisma.testAttempt.findFirst({
      where: { userId: session.userId, testId: id, isCompleted: false },
      include: { answers: true }
    })
    if (existing) {
      return NextResponse.json({ attempt: existing, test, resumed: true })
    }

    const attempt = await prisma.testAttempt.create({
      data: {
        userId: session.userId,
        testId: id,
        totalMarks: test.totalMarks,
        answers: {
          create: test.questions.map(tq => ({
            questionId: tq.questionId,
            selectedOption: null,
            isCorrect: null,
            isMarked: false,
          }))
        }
      },
      include: { answers: true }
    })

    return NextResponse.json({ attempt, test })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
