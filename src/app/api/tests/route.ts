import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    const tests = await prisma.mockTest.findMany({
      where: { isPublished: true, isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true, title: true, titleHi: true, description: true,
        type: true, totalQuestions: true, totalMarks: true,
        duration: true, negativeMarks: true, order: true,
        _count: { select: { attempts: true } }
      }
    })

    let userAttempts: Record<string, boolean> = {}
    if (session) {
      const attempts = await prisma.testAttempt.findMany({
        where: { userId: session.userId, isCompleted: true },
        select: { testId: true }
      })
      attempts.forEach(a => { userAttempts[a.testId] = true })
    }

    return NextResponse.json({ tests, userAttempts })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
