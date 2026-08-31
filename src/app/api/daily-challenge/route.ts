import { NextRequest, NextResponse } from 'next/server'
import { supabase, mapQuestion, mapSubject } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

const DAILY_COUNT = 5

// Deterministic Fisher-Yates using xorshift seed
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = (seed ^ 0xdeadbeef) >>> 0
  for (let i = a.length - 1; i > 0; i--) {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s = s >>> 0
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Returns YYYY-MM-DD in IST
function todayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
}

function dateSeed(dateStr: string): number {
  return parseInt(dateStr.replace(/-/g, ''), 10)
}

async function getTodayQuestionIds(seed: number) {
  const { data: allIds } = await supabase.from('questions').select('id').eq('is_active', true)
  if (!allIds || allIds.length < DAILY_COUNT) return null
  return seededShuffle(allIds.map((q: any) => q.id as string), seed).slice(0, DAILY_COUNT)
}

// GET — today's questions + user completion status
export async function GET() {
  try {
    const today = todayIST()
    const seed = dateSeed(today)

    const selectedIds = await getTodayQuestionIds(seed)
    if (!selectedIds) return NextResponse.json({ error: 'प्रश्न उपलब्ध नहीं' }, { status: 404 })

    const { data: questions } = await supabase
      .from('questions')
      .select('*, subjects(name, name_hi, color)')
      .in('id', selectedIds)
      .eq('is_active', true)

    if (!questions) return NextResponse.json({ error: 'त्रुटि' }, { status: 500 })

    // Preserve today's question order (DB .in() doesn't guarantee order)
    const questionMap = Object.fromEntries(questions.map((q: any) => [q.id, q]))
    const ordered = selectedIds.map(id => questionMap[id]).filter(Boolean)
    const mapped = ordered.map((q: any) => ({ ...mapQuestion(q), subject: q.subjects ? mapSubject(q.subjects) : null }))

    const session = await getSession()
    let completed = false
    let attempt: any = null

    if (session) {
      const { data: existing } = await supabase
        .from('daily_challenge_attempts')
        .select('score, total, answers')
        .eq('user_id', session.userId)
        .eq('challenge_date', today)
        .maybeSingle()

      if (existing) { completed = true; attempt = existing }
    }

    // Strip correct answers until submitted
    const questionsForClient = completed
      ? mapped
      : mapped.map(({ correct, ...rest }) => rest)

    return NextResponse.json({ date: today, questions: questionsForClient, completed, attempt })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}

// POST { answers: { [questionId]: 'A'|'B'|'C'|'D'|null } }
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'लॉगिन आवश्यक' }, { status: 401 })

    const { answers } = await req.json()

    const today = todayIST()
    const seed = dateSeed(today)

    const { data: existing } = await supabase
      .from('daily_challenge_attempts')
      .select('id')
      .eq('user_id', session.userId)
      .eq('challenge_date', today)
      .maybeSingle()

    if (existing) return NextResponse.json({ error: 'आज का चैलेंज पहले ही पूरा हो चुका है' }, { status: 400 })

    const selectedIds = await getTodayQuestionIds(seed)
    if (!selectedIds) return NextResponse.json({ error: 'त्रुटि' }, { status: 500 })

    const { data: questions } = await supabase
      .from('questions').select('id, correct').in('id', selectedIds)

    if (!questions) return NextResponse.json({ error: 'त्रुटि' }, { status: 500 })

    let score = 0
    const result = questions.map((q: any) => {
      const selected = answers?.[q.id] ?? null
      const isCorrect = selected !== null && selected === q.correct
      if (isCorrect) score++
      return { questionId: q.id, selected, correct: q.correct, isCorrect }
    })

    await supabase.from('daily_challenge_attempts').insert({
      user_id: session.userId,
      challenge_date: today,
      score,
      total: DAILY_COUNT,
      answers: result,
    })

    return NextResponse.json({ score, total: DAILY_COUNT, result })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'सर्वर त्रुटि' }, { status: 500 })
  }
}
