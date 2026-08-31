import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET — returns { currentViewers, totalViews }
export async function GET() {
  try {
    const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()

    const [{ count: total, error: e1 }, { count: current, error: e2 }] = await Promise.all([
      supabase.from('page_views').select('*', { count: 'exact', head: true }),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gt('last_seen', twoMinsAgo),
    ])

    if (e1 || e2) return NextResponse.json({ currentViewers: 0, totalViews: 0 })

    return NextResponse.json({ currentViewers: current ?? 0, totalViews: total ?? 0 })
  } catch {
    return NextResponse.json({ currentViewers: 0, totalViews: 0 })
  }
}

// POST { sessionId } — heartbeat ping
export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()
    if (!sessionId || typeof sessionId !== 'string' || sessionId.length > 64) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    await supabase.from('page_views').upsert(
      { session_id: sessionId, last_seen: new Date().toISOString() },
      { onConflict: 'session_id' }
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
