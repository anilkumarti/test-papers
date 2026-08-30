import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const tests = await prisma.mockTest.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: { _count: { select: { questions: true, attempts: true } } }
    })
    return NextResponse.json({ tests })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const data = await req.json()
    const test = await prisma.mockTest.create({
      data: {
        title: data.title,
        titleHi: data.titleHi,
        description: data.description || null,
        type: data.type || 'FULL',
        totalQuestions: data.totalQuestions,
        totalMarks: data.totalMarks,
        duration: data.duration,
        negativeMarks: data.negativeMarks || 0,
        isPublished: data.isPublished || false,
        order: data.order || 0,
      }
    })
    return NextResponse.json({ test })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
