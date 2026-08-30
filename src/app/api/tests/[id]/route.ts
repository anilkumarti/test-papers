import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const test = await prisma.mockTest.findUnique({
      where: { id, isPublished: true },
      include: {
        questions: {
          include: { question: { include: { subject: true, topic: true } } },
          orderBy: { order: 'asc' }
        }
      }
    })
    if (!test) return NextResponse.json({ error: 'टेस्ट नहीं मिला' }, { status: 404 })
    return NextResponse.json({ test })
  } catch (e) {
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
