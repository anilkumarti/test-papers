import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'अनधिकृत' }, { status: 401 })
    const { id } = await params
    const { questionId, selectedOption, isMarked, timeTaken } = await req.json()

    const attempt = await prisma.testAttempt.findFirst({
      where: { id, userId: session.userId, isCompleted: false }
    })
    if (!attempt) return NextResponse.json({ error: 'प्रयास नहीं मिला' }, { status: 404 })

    const qa = await prisma.questionAttempt.findFirst({
      where: { attemptId: id, questionId },
      include: { question: true }
    })
    if (!qa) return NextResponse.json({ error: 'प्रश्न नहीं मिला' }, { status: 404 })

    const isCorrect = selectedOption
      ? selectedOption === qa.question.correct
      : null

    const updated = await prisma.questionAttempt.update({
      where: { id: qa.id },
      data: {
        selectedOption: selectedOption ?? null,
        isCorrect: isCorrect,
        isMarked: isMarked !== undefined ? isMarked : qa.isMarked,
        timeTaken: timeTaken ?? qa.timeTaken,
      }
    })

    return NextResponse.json({ questionAttempt: updated })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
