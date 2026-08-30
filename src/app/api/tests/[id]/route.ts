import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapTest, mapTestQuestion } from '@/lib/supabase'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data: row } = await supabase
      .from('mock_tests')
      .select('*, test_questions(*, questions(*, subjects(*), topics(*)))')
      .eq('id', id).eq('is_published', true)
      .maybeSingle()
    if (!row) return NextResponse.json({ error: 'टेस्ट नहीं मिला' }, { status: 404 })
    const { test_questions, ...rest } = row as any
    const test = {
      ...mapTest(rest),
      questions: (test_questions ?? []).map(mapTestQuestion).sort((a: any, b: any) => a.order - b.order),
    }
    return NextResponse.json({ test })
  } catch (e) {
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
