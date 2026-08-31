'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Question {
  id: string; textHi: string; textEn?: string
  optionA: string; optionB: string; optionC: string; optionD: string
  correct?: string; subject?: { nameHi: string; color: string }; difficulty?: string
}

interface ResultItem { questionId: string; selected: string | null; correct: string; isCorrect: boolean }

const OPTS = ['A', 'B', 'C', 'D'] as const
const OPT_LABEL: Record<string, string> = { A: 'optionA', B: 'optionB', C: 'optionC', D: 'optionD' }

const SCORE_MSG = [
  { min: 5, emoji: '🏆', hi: 'शानदार! परफेक्ट स्कोर!', color: '#f59e0b' },
  { min: 4, emoji: '🌟', hi: 'बहुत बढ़िया! लगभग परफेक्ट!', color: '#22c55e' },
  { min: 3, emoji: '👍', hi: 'अच्छा प्रयास! और मेहनत करें।', color: '#3b82f6' },
  { min: 1, emoji: '📚', hi: 'हिम्मत मत हारो, कल फिर कोशिश करें।', color: '#f97316' },
  { min: 0, emoji: '💪', hi: 'अभ्यास से परिपूर्णता आती है।', color: '#ef4444' },
]

export default function DailyChallengePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [date, setDate] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [completed, setCompleted] = useState(false)
  const [prevAttempt, setPrevAttempt] = useState<{ score: number; total: number; answers: ResultItem[] } | null>(null)

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | null>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; total: number; result: ResultItem[] } | null>(null)

  useEffect(() => {
    fetch('/api/daily-challenge')
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); return }
        setDate(d.date)
        setQuestions(d.questions ?? [])
        setCompleted(d.completed)
        if (d.attempt) setPrevAttempt(d.attempt)
      })
      .catch(() => setError('नेटवर्क त्रुटि'))
      .finally(() => setLoading(false))
  }, [])

  const select = (qId: string, opt: string) => {
    if (result || completed) return
    setAnswers(prev => ({ ...prev, [qId]: prev[qId] === opt ? null : opt }))
  }

  const submit = async () => {
    setSubmitting(true)
    const res = await fetch('/api/daily-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (data.error) { setError(data.error); return }
    setResult(data)
    setCompleted(true)
  }

  const q = questions[current]
  const allAnswered = questions.length > 0 && questions.every(q => answers[q.id] != null)

  const displayResult = result ?? (prevAttempt ? { score: prevAttempt.score, total: prevAttempt.total, result: prevAttempt.answers } : null)
  const scoreMsg = displayResult
    ? SCORE_MSG.find(m => displayResult.score >= m.min) ?? SCORE_MSG[SCORE_MSG.length - 1]
    : null

  const resultMap: Record<string, ResultItem> = {}
  if (displayResult) displayResult.result.forEach(r => { resultMap[r.questionId] = r })

  function optionColor(q: Question, opt: string, mode: 'quiz' | 'review') {
    if (mode === 'quiz') {
      return answers[q.id] === opt ? '#1d4ed8' : '#f8fafc'
    }
    const ri = resultMap[q.id]
    if (!ri) return '#f8fafc'
    if (opt === ri.correct) return '#16a34a'
    if (opt === ri.selected && !ri.isCorrect) return '#dc2626'
    return '#f8fafc'
  }

  function optionTextColor(q: Question, opt: string, mode: 'quiz' | 'review') {
    if (mode === 'quiz') return answers[q.id] === opt ? '#fff' : '#1e293b'
    const ri = resultMap[q.id]
    if (!ri) return '#1e293b'
    if (opt === ri.correct || (opt === ri.selected && !ri.isCorrect)) return '#fff'
    return '#1e293b'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <Navbar />
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🎯</div>
          <p style={{ color: '#94a3b8' }}>आज का चैलेंज लोड हो रहा है…</p>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <Navbar />
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p style={{ color: '#f87171' }}>{error}</p>
          <Link href="/" className="mt-4 inline-block text-sm" style={{ color: '#60a5fa' }}>होम पर जाएं</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-3"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
            🎯 DAILY CHALLENGE
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>आज का चैलेंज</h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            {date ? new Date(date + 'T00:00:00').toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
          </p>
        </div>

        {/* Result / Completed state */}
        {(displayResult && scoreMsg) && (
          <div className="rounded-2xl p-6 text-center mb-8"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-6xl mb-3">{scoreMsg.emoji}</div>
            <div className="text-4xl font-bold mb-1" style={{ color: scoreMsg.color, fontVariantNumeric: 'tabular-nums' }}>
              {displayResult.score}/{displayResult.total}
            </div>
            <p className="font-semibold text-lg mb-1" style={{ color: '#e2e8f0' }}>{scoreMsg.hi}</p>
            <p className="text-sm" style={{ color: '#64748b' }}>
              {Math.round(displayResult.score / displayResult.total * 100)}% सही · अगला चैलेंज कल आएगा
            </p>
          </div>
        )}

        {/* Quiz or Review questions */}
        {questions.length > 0 && (
          <>
            {/* Progress dots */}
            <div className="flex gap-2 justify-center mb-6">
              {questions.map((q, i) => {
                let bg = '#334155'
                if (displayResult) {
                  const ri = resultMap[q.id]
                  bg = ri?.isCorrect ? '#16a34a' : ri?.selected ? '#dc2626' : '#64748b'
                } else if (answers[q.id]) bg = '#3b82f6'
                return (
                  <button key={i} onClick={() => setCurrent(i)}
                    className="w-8 h-8 rounded-full text-xs font-bold transition-all"
                    style={{ background: i === current ? '#1d4ed8' : bg, color: '#fff', transform: i === current ? 'scale(1.2)' : 'scale(1)' }}>
                    {i + 1}
                  </button>
                )
              })}
            </div>

            {/* Question card */}
            {q && (
              <div className="rounded-2xl p-6 mb-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Meta */}
                <div className="flex items-center gap-2 mb-4">
                  {q.subject && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: (q.subject.color ?? '#3b82f6') + '22', color: q.subject.color ?? '#3b82f6', border: `1px solid ${(q.subject.color ?? '#3b82f6')}44` }}>
                      {q.subject.nameHi}
                    </span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                    प्रश्न {current + 1}/{questions.length}
                  </span>
                </div>

                <p className="text-base leading-relaxed font-medium mb-6" style={{ color: '#f1f5f9' }}>
                  {q.textHi}
                </p>

                <div className="space-y-3">
                  {OPTS.map(opt => {
                    const mode = displayResult ? 'review' : 'quiz'
                    const ri = displayResult ? resultMap[q.id] : null
                    const isMark = ri && (opt === ri.correct || opt === ri.selected)
                    return (
                      <button key={opt}
                        onClick={() => select(q.id, opt)}
                        className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all"
                        style={{
                          background: optionColor(q, opt, mode),
                          color: optionTextColor(q, opt, mode),
                          border: `1px solid ${answers[q.id] === opt && mode === 'quiz' ? '#1d4ed8' : isMark ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                          cursor: mode === 'review' ? 'default' : 'pointer',
                        }}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: 'rgba(255,255,255,0.15)' }}>
                          {opt}
                        </span>
                        <span className="text-sm">{(q as any)[OPT_LABEL[opt]]}</span>
                        {ri && opt === ri.correct && <span className="ml-auto text-lg">✓</span>}
                        {ri && opt === ri.selected && !ri.isCorrect && <span className="ml-auto text-lg">✗</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              {current > 0 && (
                <button onClick={() => setCurrent(c => c - 1)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
                  ← पिछला
                </button>
              )}
              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent(c => c + 1)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: '#1d4ed8', color: '#fff' }}>
                  अगला →
                </button>
              ) : !displayResult && (
                <button onClick={submit} disabled={!allAnswered || submitting}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    background: allAnswered ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.05)',
                    color: allAnswered ? '#fff' : '#475569',
                    cursor: allAnswered ? 'pointer' : 'not-allowed',
                  }}>
                  {submitting ? 'सबमिट हो रहा है…' : !allAnswered ? `${questions.length - Object.keys(answers).length} प्रश्न बाकी` : '🎯 सबमिट करें'}
                </button>
              )}
            </div>

            {displayResult && (
              <div className="mt-4 text-center">
                <Link href="/tests"
                  className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: '#1d4ed8', color: '#fff' }}>
                  पूरा टेस्ट दें →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
