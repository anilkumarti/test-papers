import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { order: 'asc' },
      include: { topics: true, _count: { select: { questions: true } } }
    })
    return NextResponse.json({ subjects })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
