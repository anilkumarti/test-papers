import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapTest } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { data: rows } = await supabase
      .from('mock_tests').select('*, test_questions(id), test_attempts(id)')
      .order('sort_order', { ascending: true }).order('created_at', { ascending: false })
    const tests = (rows ?? []).map((t: any) => {
      const { test_questions, test_attempts, ...rest } = t
      return { ...mapTest(rest), _count: { questions: test_questions?.length ?? 0, attempts: test_attempts?.length ?? 0 } }
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
    const { data: row, error } = await supabase.from('mock_tests').insert({
      title: data.title, title_hi: data.titleHi,
      description: data.description || null, type: data.type || 'FULL',
      total_questions: data.totalQuestions, total_marks: data.totalMarks,
      duration: data.duration, negative_marks: data.negativeMarks || 0,
      is_published: data.isPublished || false, sort_order: data.order || 0,
    }).select().single()
    if (error) throw error
    return NextResponse.json({ test: mapTest(row) })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
