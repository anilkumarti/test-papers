import { NextResponse } from 'next/server'
import { supabase, mapTest } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    const { data: rows } = await supabase
      .from('mock_tests')
      .select('*, test_attempts(id)')
      .eq('is_published', true)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    const TYPE_ORDER: Record<string, number> = { FULL: 0, PREVIOUS_YEAR: 1, SUBJECT: 2, TOPIC: 3, CURRENT_AFFAIRS: 4, PRACTICE: 5 }
    const tests = (rows?.map((t: any) => {
      const { test_attempts, ...rest } = t
      return { ...mapTest(rest), _count: { attempts: test_attempts?.length ?? 0 } }
    }) ?? []).sort((a: any, b: any) => {
      const ta = TYPE_ORDER[a.type] ?? 9
      const tb = TYPE_ORDER[b.type] ?? 9
      if (ta !== tb) return ta - tb
      return (a.order ?? 99) - (b.order ?? 99)
    })

    let userAttempts: Record<string, { completed: boolean; lastId: string; percentage: number; score: number; totalMarks: number }> = {}
    if (session) {
      // Fetch all attempts; completed ones sorted first so they take priority per test
      const { data: attempts } = await supabase
        .from('test_attempts')
        .select('id, test_id, score, total_marks, percentage, created_at, is_completed')
        .eq('user_id', session.userId)
        .order('is_completed', { ascending: false })
        .order('created_at', { ascending: false })
      attempts?.forEach((a: any) => {
        if (!userAttempts[a.test_id]) {
          userAttempts[a.test_id] = {
            completed: !!a.is_completed, lastId: a.id,
            percentage: Math.round(a.percentage ?? 0),
            score: a.score ?? 0,
            totalMarks: a.total_marks ?? 0,
          }
        }
      })
    }

    return NextResponse.json({ tests, userAttempts })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
