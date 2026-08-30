import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const tqs = await prisma.testQuestion.findMany({
      where: { testId: id },
      include: { question: { include: { subject: true, topic: true } } },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json({ questions: tqs })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Generate test from subject distribution
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const { subjectDistribution } = await req.json()
    // subjectDistribution: [{ subjectId, count }]

    // Clear existing
    await prisma.testQuestion.deleteMany({ where: { testId: id } })

    let order = 0
    for (const dist of subjectDistribution) {
      const questions = await prisma.question.findMany({
        where: { subjectId: dist.subjectId, isActive: true },
        take: dist.count,
        orderBy: { createdAt: 'asc' }
      })
      for (const q of questions) {
        await prisma.testQuestion.create({
          data: { testId: id, questionId: q.id, order: order++ }
        })
      }
    }
    return NextResponse.json({ success: true, total: order })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
