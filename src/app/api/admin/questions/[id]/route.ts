import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const data = await req.json()
    const q = await prisma.question.update({
      where: { id },
      data: {
        textHi: data.textHi, textEn: data.textEn || null,
        optionA: data.optionA, optionB: data.optionB, optionC: data.optionC, optionD: data.optionD,
        correct: data.correct, explanation: data.explanation, explanHi: data.explanHi || null,
        subjectId: data.subjectId, topicId: data.topicId,
        difficulty: data.difficulty, source: data.source || null,
        tags: data.tags || null, isActive: data.isActive, needsReview: data.needsReview,
      }
    })
    return NextResponse.json({ question: q })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    await prisma.question.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
