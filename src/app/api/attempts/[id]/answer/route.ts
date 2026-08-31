import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapQA } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'अनधिकृत' }, { status: 401 })
    const { id } = await params
    const { questionId, selectedOption, isMarked, timeTaken } = await req.json()

    const { data: attempt } = await supabase
      .from('test_attempts').select('id')
      .eq('id', id).eq('user_id', session.userId).eq('is_completed', false)
      .maybeSingle()
    if (!attempt) return NextResponse.json({ error: 'प्रयास नहीं मिला' }, { status: 404 })

    const { data: qa, error: qaError } = await supabase
      .from('question_attempts').select('*, questions(correct)')
      .eq('attempt_id', id).eq('question_id', questionId)
      .maybeSingle()
    if (qaError) { console.error('question_attempts lookup error:', qaError.message); return NextResponse.json({ error: 'DB त्रुटि' }, { status: 500 }) }
    if (!qa) return NextResponse.json({ error: 'प्रश्न नहीं मिला' }, { status: 404 })

    const isCorrect = selectedOption ? selectedOption === qa.questions.correct : null

    const { data: updated } = await supabase.from('question_attempts').update({
      selected_option: selectedOption ?? null,
      is_correct: isCorrect,
      is_marked: isMarked !== undefined ? isMarked : qa.is_marked,
      time_taken: timeTaken ?? qa.time_taken,
    }).eq('id', qa.id).select().single()

    return NextResponse.json({ questionAttempt: mapQA(updated) })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
