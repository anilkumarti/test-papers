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

    const tests = rows?.map((t: any) => {
      const { test_attempts, ...rest } = t
      return { ...mapTest(rest), _count: { attempts: test_attempts?.length ?? 0 } }
    }) ?? []

    let userAttempts: Record<string, { completed: boolean; lastId: string }> = {}
    if (session) {
      const { data: attempts } = await supabase
        .from('test_attempts').select('id, test_id, created_at')
        .eq('user_id', session.userId).eq('is_completed', true)
        .order('created_at', { ascending: false })
      attempts?.forEach((a: any) => {
        if (!userAttempts[a.test_id]) {
          userAttempts[a.test_id] = { completed: true, lastId: a.id }
        }
      })
    }

    return NextResponse.json({ tests, userAttempts })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
