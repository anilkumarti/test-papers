import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get('subjectId')
    const difficulty = searchParams.get('difficulty')
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = 20

    const where: Record<string, unknown> = {}
    if (subjectId) where.subjectId = subjectId
    if (difficulty) where.difficulty = difficulty

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where, skip: (page - 1) * limit, take: limit,
        include: { subject: true, topic: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.question.count({ where })
    ])
    return NextResponse.json({ questions, total, page, pages: Math.ceil(total / limit) })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const data = await req.json()
    const q = await prisma.question.create({
      data: {
        textHi: data.textHi,
        textEn: data.textEn || null,
        optionA: data.optionA,
        optionB: data.optionB,
        optionC: data.optionC,
        optionD: data.optionD,
        correct: data.correct,
        explanation: data.explanation,
        explanHi: data.explanHi || null,
        subjectId: data.subjectId,
        topicId: data.topicId,
        difficulty: data.difficulty || 'MEDIUM',
        source: data.source || null,
        tags: data.tags || null,
        isActive: data.isActive !== false,
      }
    })
    return NextResponse.json({ question: q })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
