import { NextResponse } from 'next/server'
import { supabase, mapSubject, mapTopic } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: rows } = await supabase
      .from('subjects').select('*, topics(*), questions(id)')
      .order('sort_order', { ascending: true })

    const subjects = (rows ?? []).map((s: any) => {
      const { topics, questions, ...rest } = s
      return { ...mapSubject(rest), topics: (topics ?? []).map(mapTopic), _count: { questions: questions?.length ?? 0 } }
    })
    return NextResponse.json({ subjects })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
