import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapTest } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    const { publish } = await req.json()
    const { data: row, error } = await supabase.from('mock_tests').update({ is_published: publish }).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ test: mapTest(row) })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
