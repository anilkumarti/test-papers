'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { formatTime } from '@/lib/utils'

interface Question {
  id: string; textHi: string; textEn?: string;
  optionA: string; optionB: string; optionC: string; optionD: string;
  correct: string; explanation: string;
  subject: { nameHi: string; color: string };
  topic: { nameHi: string } | null;
  difficulty: string;
}

interface TestQuestion { id: string; order: number; question: Question }
interface Test { id: string; titleHi: string; totalQuestions: number; totalMarks: number; duration: number; negativeMarks: number; questions: TestQuestion[] }
interface QAnswer { questionId: string; selectedOption: string | null; isMarked: boolean; visited: boolean }

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string

  const [test, setTest] = useState<Test | null>(null)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, QAnswer>>({})
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'started' | 'submitting' | 'submitted'>('loading')
  const [showSubmit, setShowSubmit] = useState(false)
  const [showPalette, setShowPalette] = useState(false)
  const [error, setError] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTime = useRef(0)
  // Keep a ref to submitTest so the timer callback always calls the latest version
  const submitRef = useRef<(auto?: boolean) => void>(() => {})

  useEffect(() => {
    const init = async () => {
      const meRes = await fetch('/api/auth/me')
      const me = await meRes.json()
      if (!me.user) { router.push('/auth/login'); return }

      const r = await fetch(`/api/tests/${testId}/start`, { method: 'POST' })
      if (!r.ok) { setError('टेस्ट शुरू नहीं हो सका'); return }
      const d = await r.json()

      setAttemptId(d.attempt.id)
      setTest(d.test)

      // Bug fix: calculate remaining time for resumed attempts
      if (d.resumed && d.attempt.startedAt) {
        const elapsed = Math.floor((Date.now() - new Date(d.attempt.startedAt).getTime()) / 1000)
        setTimeLeft(Math.max(0, d.test.duration * 60 - elapsed))
      } else {
        setTimeLeft(d.test.duration * 60)
      }

      // Initialize answers — mark visited:true for questions already answered on resume
      const ans: Record<string, QAnswer> = {}
      d.test.questions.forEach((tq: TestQuestion) => {
        const existing = d.attempt.answers?.find((a: { questionId: string; selectedOption: string | null; isMarked: boolean }) => a.questionId === tq.question.id)
        ans[tq.question.id] = {
          questionId: tq.question.id,
          selectedOption: existing?.selectedOption ?? null,
          isMarked: existing?.isMarked ?? false,
          visited: existing?.selectedOption != null,
        }
      })
      setAnswers(ans)

      // Bug fix: record start time here, after API load completes
      startTime.current = Date.now()
      setStatus('started')
    }
    init()
  }, [testId, router])

  useEffect(() => {
    if (status !== 'started') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          // Defer submit outside the state updater to keep it pure
          setTimeout(() => submitRef.current(true), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [status])

  const questions = test?.questions.map(tq => tq.question) ?? []
  const currentQ = questions[current]

  const markVisited = useCallback((qId: string) => {
    setAnswers(prev => ({ ...prev, [qId]: { ...prev[qId], visited: true } }))
  }, [])

  useEffect(() => {
    if (currentQ) markVisited(currentQ.id)
  }, [current, currentQ, markVisited])

  const selectOption = async (opt: string) => {
    if (!currentQ || !attemptId) return
    const newSel = answers[currentQ.id]?.selectedOption === opt ? null : opt
    setAnswers(prev => ({ ...prev, [currentQ.id]: { ...prev[currentQ.id], selectedOption: newSel } }))
    await fetch(`/api/attempts/${attemptId}/answer`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: currentQ.id, selectedOption: newSel })
    })
  }

  const toggleMark = async () => {
    if (!currentQ || !attemptId) return
    const newMark = !answers[currentQ.id]?.isMarked
    setAnswers(prev => ({ ...prev, [currentQ.id]: { ...prev[currentQ.id], isMarked: newMark } }))
    await fetch(`/api/attempts/${attemptId}/answer`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: currentQ.id, isMarked: newMark })
    })
  }

  const clearAnswer = async () => {
    if (!currentQ || !attemptId) return
    setAnswers(prev => ({ ...prev, [currentQ.id]: { ...prev[currentQ.id], selectedOption: null } }))
    await fetch(`/api/attempts/${attemptId}/answer`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: currentQ.id, selectedOption: null })
    })
  }

  // Keep ref current so the timer callback never captures a stale closure
  submitRef.current = submitTest

  async function submitTest(auto = false): Promise<void> {
    if (!attemptId) return
    setStatus('submitting')
    clearInterval(timerRef.current!)
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000)
    const r = await fetch(`/api/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeTaken })
    })
    if (r.ok) {
      setStatus('submitted')
      router.push(`/results/${attemptId}`)
    } else {
      setStatus('started')
      setError('सबमिट करने में त्रुटि')
    }
  }

  const getQStatus = (qId: string): string => {
    const a = answers[qId]
    if (!a) return 'not-visited'
    if (a.selectedOption && a.isMarked) return 'answered-marked'
    if (a.isMarked) return 'marked'
    if (a.selectedOption) return 'answered'
    if (a.visited) return 'not-answered'
    return 'not-visited'
  }

  const stats = {
    answered: Object.values(answers).filter(a => a.selectedOption).length,
    marked: Object.values(answers).filter(a => a.isMarked && !a.selectedOption).length,
    notAnswered: Object.values(answers).filter(a => !a.selectedOption && a.visited).length,
    notVisited: Object.values(answers).filter(a => !a.visited).length,
  }

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-slate-600 font-medium">टेस्ट लोड हो रहा है...</div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="card text-center max-w-md">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <div className="font-bold text-slate-800 mb-2">{error}</div>
        <button onClick={() => router.push('/tests')} className="btn-primary mt-4">टेस्ट सूची पर वापस जाएं</button>
      </div>
    </div>
  )

  if (!test || !currentQ) return null

  const opts = [
    { key: 'A', text: currentQ.optionA },
    { key: 'B', text: currentQ.optionB },
    { key: 'C', text: currentQ.optionC },
    { key: 'D', text: currentQ.optionD },
  ]
  const selected = answers[currentQ.id]?.selectedOption
  const isMarked = answers[currentQ.id]?.isMarked
  const isTimeLow = timeLeft < 300

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-blue-800 text-white px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="font-bold text-sm sm:text-base">{test.titleHi}</div>
            <div className="text-blue-300 text-xs">प्रश्न {current + 1} / {questions.length}</div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${isTimeLow ? 'bg-red-600 animate-pulse' : 'bg-blue-700'}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <button onClick={() => setShowPalette(!showPalette)} className="lg:hidden bg-blue-700 px-3 py-1.5 rounded text-sm">
            प्रश्न {showPalette ? '✕' : '◉'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 max-w-7xl mx-auto w-full gap-4 p-4">
        {/* Main */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Subject tag */}
          <div className="flex items-center gap-2">
            <span className="badge text-xs font-semibold text-white" style={{ background: currentQ.subject.color }}>{currentQ.subject.nameHi}</span>
            {currentQ.topic && <span className="text-xs text-slate-500">{currentQ.topic.nameHi}</span>}
            {isMarked && <span className="badge bg-purple-100 text-purple-700 text-xs">🔖 समीक्षा के लिए</span>}
          </div>

          {/* Question */}
          <div className="card">
            <div className="text-sm text-slate-500 mb-3 font-medium">प्रश्न {current + 1}</div>
            <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-medium">{currentQ.textHi}</p>
            {currentQ.textEn && <p className="text-slate-500 text-sm mt-2 italic">{currentQ.textEn}</p>}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {opts.map(o => (
              <button key={o.key} onClick={() => selectOption(o.key)}
                className={`option-btn ${selected === o.key ? 'selected' : ''}`}>
                <span className={`w-8 h-8 flex-shrink-0 rounded-full border-2 flex items-center justify-center font-bold text-sm ${selected === o.key ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-600'}`}>
                  {o.key}
                </span>
                <span className="text-slate-800">{o.text}</span>
              </button>
            ))}
          </div>

          {/* Bottom nav */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
              className="btn-secondary py-2 px-4 text-sm disabled:opacity-40">← पिछला</button>
            <button onClick={clearAnswer} className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50">
              उत्तर साफ़ करें
            </button>
            <button onClick={toggleMark} className={`px-4 py-2 text-sm border rounded-lg font-medium transition-colors ${isMarked ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
              🔖 {isMarked ? 'अनमार्क' : 'समीक्षा हेतु'}
            </button>
            {current < questions.length - 1 ? (
              <button onClick={() => setCurrent(c => c + 1)} className="btn-primary py-2 px-4 text-sm ml-auto">
                अगला →
              </button>
            ) : (
              <button onClick={() => setShowSubmit(true)} className="ml-auto px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700">
                टेस्ट जमा करें ✓
              </button>
            )}
          </div>
        </div>

        {/* Palette */}
        <div className={`${showPalette ? 'fixed inset-0 bg-black/50 z-40 flex items-end lg:items-start lg:relative lg:flex' : 'hidden lg:flex'} lg:w-72`}>
          <div className={`bg-white w-full lg:rounded-xl lg:border lg:border-slate-200 lg:shadow-sm overflow-hidden ${showPalette ? 'rounded-t-2xl lg:rounded-xl max-h-[80vh] lg:max-h-none overflow-y-auto' : ''}`}>
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800 text-sm">प्रश्न सूची</h3>
                <button onClick={() => setShowPalette(false)} className="lg:hidden text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-600"></div><span className="text-slate-600">उत्तर दिया: {stats.answered}</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-300"></div><span className="text-slate-600">नहीं दिया: {stats.notAnswered}</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-600"></div><span className="text-slate-600">समीक्षा: {stats.marked}</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-300"></div><span className="text-slate-600">नहीं देखा: {stats.notVisited}</span></div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-6 gap-2">
                {questions.map((q, i) => (
                  <button key={q.id} onClick={() => { setCurrent(i); setShowPalette(false) }}
                    className={`q-palette-btn ${getQStatus(q.id)} ${i === current ? 'current' : ''}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-200">
              <button onClick={() => setShowSubmit(true)}
                className="w-full py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors">
                टेस्ट जमा करें
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirm modal */}
      {showSubmit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-2">टेस्ट जमा करें?</h3>
            <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-600">उत्तर दिए गए:</span><span className="font-bold text-green-700">{stats.answered}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">नहीं दिए:</span><span className="font-bold text-red-600">{questions.length - stats.answered}</span></div>
              <div className="flex justify-between"><span className="text-slate-600">समय शेष:</span><span className="font-bold text-blue-700">{formatTime(timeLeft)}</span></div>
            </div>
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
              ⚠️ एक बार जमा करने के बाद टेस्ट में वापस नहीं आ सकते।
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowSubmit(false)} className="flex-1 btn-secondary py-2.5 text-sm justify-center">वापस जाएं</button>
              <button onClick={() => submitTest()} disabled={status === 'submitting'}
                className="flex-1 bg-green-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
                {status === 'submitting' ? 'जमा हो रहा है...' : 'हाँ, जमा करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
