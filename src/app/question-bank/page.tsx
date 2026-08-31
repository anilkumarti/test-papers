'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Subject { id: string; code: string; name_hi: string; color: string }
interface Question {
  id: string; textHi: string
  optionA: string; optionB: string; optionC: string; optionD: string
  correct: string; difficulty: string
  subjectCode: string; subjectName: string; subjectColor: string
}

const SUBJECT_ICONS: Record<string, string> = {
  MATH: '📐', HIN: '📝', GK: '🌍', COMP: '💻', REASON: '🧠',
  MGMT: '🏛️', ENG: '🔤', SCI: '🔬',
}

const DIFF_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  EASY:   { label: 'आसान',    color: '#15803d', bg: '#dcfce7' },
  MEDIUM: { label: 'मध्यम',   color: '#b45309', bg: '#fef3c7' },
  HARD:   { label: 'कठिन',    color: '#b91c1c', bg: '#fee2e2' },
}

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>({})
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [selectedSubject, setSelectedSubject] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [answered, setAnswered] = useState<Record<string, string>>({})   // id → chosen option
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})  // id → true when answered

  const fetchQuestions = useCallback(async (subj: string, pg: number) => {
    setLoading(true)
    const res = await fetch(`/api/question-bank?subject=${subj}&page=${pg}`)
    const data = await res.json()
    setQuestions(data.questions || [])
    setSubjects(data.subjects || [])
    setSubjectCounts(data.subjectCounts || {})
    setTotal(data.total || 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchQuestions(selectedSubject, page)
  }, [selectedSubject, page, fetchQuestions])

  const handleSubjectChange = (code: string) => {
    setSelectedSubject(code)
    setPage(1)
    setAnswered({})
    setRevealed({})
  }

  const handleOptionClick = (qId: string, opt: string) => {
    if (revealed[qId]) return  // already answered
    setAnswered(prev => ({ ...prev, [qId]: opt }))
    setRevealed(prev => ({ ...prev, [qId]: true }))
  }

  const totalPages = Math.ceil(total / 20)
  const answeredCount = Object.keys(revealed).length
  const correctCount  = Object.entries(revealed).filter(([id]) => {
    const q = questions.find(x => x.id === id)
    return q && answered[id] === q.correct
  }).length

  return (
    <div className="min-h-screen" style={{ background: '#f0f4ff' }}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="text-white px-4 pt-10 pb-20"
        style={{ background: 'linear-gradient(135deg, #0c1a4e 0%, #1e3a8a 60%, #7c3aed 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#c4b5fd' }}>
            📚 MPESB पिछले वर्ष प्रश्न
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">प्रश्न बैंक</h1>
          <p className="text-sm mb-6" style={{ color: '#bfdbfe' }}>
            1500+ आधिकारिक PYQ प्रश्न — उत्तर चुनें और तुरंत सही जवाब देखें
          </p>
          {/* Stats strip */}
          <div className="flex flex-wrap gap-4">
            {[
              { val: total, label: 'कुल प्रश्न' },
              { val: answeredCount, label: 'हल किए' },
              { val: correctCount, label: 'सही' },
              { val: answeredCount - correctCount, label: 'गलत' },
            ].map((s, i) => (
              <div key={i} className="text-center px-4 py-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.12)', minWidth: 72 }}>
                <div className="text-xl font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                <div className="text-xs" style={{ color: '#93c5fd' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-16">

        {/* ── Subject filter ───────────────────────────── */}
        <div className="bg-white rounded-2xl p-2 mb-6 flex flex-wrap gap-1.5 overflow-x-auto"
          style={{ boxShadow: '0 4px 24px rgba(15,23,42,0.10)', border: '1px solid #e4e9f2' }}>
          <button
            onClick={() => handleSubjectChange('ALL')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
            style={{
              background: selectedSubject === 'ALL' ? '#1e40af' : 'transparent',
              color: selectedSubject === 'ALL' ? 'white' : '#64748b',
            }}>
            🗂️ सभी
            <span className="text-xs font-normal opacity-75">{total}</span>
          </button>
          {subjects.map(s => {
            const active = selectedSubject === s.code
            return (
              <button key={s.code}
                onClick={() => handleSubjectChange(s.code)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
                style={{
                  background: active ? s.color : 'transparent',
                  color: active ? 'white' : '#64748b',
                }}>
                {SUBJECT_ICONS[s.code] ?? '📋'} {s.name_hi}
                <span className="text-xs font-normal opacity-75">{subjectCounts[s.code] ?? 0}</span>
              </button>
            )
          })}
        </div>

        {/* ── Progress bar (current page) ─────────────── */}
        {answeredCount > 0 && (
          <div className="bg-white rounded-2xl p-4 mb-6 flex items-center gap-4"
            style={{ border: '1px solid #e4e9f2', boxShadow: '0 2px 10px rgba(15,23,42,0.06)' }}>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1.5" style={{ color: '#475569' }}>
                <span>इस पेज पर प्रगति</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{answeredCount}/20</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e4e9f2' }}>
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: `${(answeredCount / 20) * 100}%`,
                    background: correctCount / answeredCount >= 0.6
                      ? '#16a34a' : correctCount / answeredCount >= 0.4 ? '#f59e0b' : '#dc2626',
                  }} />
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold" style={{ color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>
                {answeredCount ? Math.round(correctCount / answeredCount * 100) : 0}%
              </div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>सटीकता</div>
            </div>
          </div>
        )}

        {/* ── Questions ────────────────────────────────── */}
        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: '#94a3b8' }}>प्रश्न लोड हो रहे हैं...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map((q, idx) => {
              const isRevealed = revealed[q.id]
              const chosen    = answered[q.id]
              const diff      = DIFF_LABEL[q.difficulty] ?? DIFF_LABEL.MEDIUM
              const options   = [
                { key: 'A', text: q.optionA },
                { key: 'B', text: q.optionB },
                { key: 'C', text: q.optionC },
                { key: 'D', text: q.optionD },
              ]

              return (
                <div key={q.id} className="bg-white rounded-2xl overflow-hidden"
                  style={{ border: '1px solid #e4e9f2', boxShadow: '0 2px 12px rgba(15,23,42,0.07)' }}>
                  {/* Color stripe */}
                  <div className="h-1" style={{ background: q.subjectColor }} />

                  <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: q.subjectColor + '20', color: q.subjectColor }}>
                          {SUBJECT_ICONS[q.subjectCode]} {q.subjectName}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: diff.bg, color: diff.color }}>
                          {diff.label}
                        </span>
                      </div>
                      <span className="text-xs font-bold tabular-nums"
                        style={{ color: '#94a3b8' }}>
                        Q{(page - 1) * 20 + idx + 1}
                      </span>
                    </div>

                    {/* Question text */}
                    <p className="font-bold text-base leading-relaxed mb-4" style={{ color: '#0f172a' }}>
                      {q.textHi}
                    </p>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {options.map(opt => {
                        const isCorrect = opt.key === q.correct
                        const isChosen  = chosen === opt.key
                        let bg = 'white', border = '#e2e8f0', color = '#1e293b', icon = ''

                        if (isRevealed) {
                          if (isCorrect) {
                            bg = '#dcfce7'; border = '#16a34a'; color = '#15803d'; icon = '✓'
                          } else if (isChosen && !isCorrect) {
                            bg = '#fee2e2'; border = '#dc2626'; color = '#b91c1c'; icon = '✗'
                          } else {
                            bg = '#f8faff'; border = '#e2e8f0'; color = '#94a3b8'
                          }
                        }

                        return (
                          <button key={opt.key}
                            onClick={() => handleOptionClick(q.id, opt.key)}
                            disabled={isRevealed}
                            className="w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl transition-all"
                            style={{
                              background: bg,
                              border: `2px solid ${border}`,
                              color,
                              cursor: isRevealed ? 'default' : 'pointer',
                            }}
                            onMouseEnter={e => {
                              if (!isRevealed) (e.currentTarget as HTMLElement).style.borderColor = q.subjectColor
                            }}
                            onMouseLeave={e => {
                              if (!isRevealed) (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'
                            }}>
                            <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                              style={{
                                background: isRevealed ? (isCorrect ? '#16a34a' : isChosen ? '#dc2626' : '#e2e8f0')
                                  : q.subjectColor + '18',
                                color: isRevealed ? (isCorrect || isChosen ? 'white' : '#94a3b8') : q.subjectColor,
                              }}>
                              {icon || opt.key}
                            </span>
                            <span className="flex-1 text-sm leading-relaxed font-medium">{opt.text}</span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Answer reveal banner */}
                    {isRevealed && (
                      <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{
                          background: chosen === q.correct ? '#f0fdf4' : '#fff7ed',
                          border: `1px solid ${chosen === q.correct ? '#bbf7d0' : '#fed7aa'}`,
                        }}>
                        <span className="text-2xl">{chosen === q.correct ? '🎉' : '📖'}</span>
                        <div>
                          <div className="text-sm font-bold"
                            style={{ color: chosen === q.correct ? '#15803d' : '#9a3412' }}>
                            {chosen === q.correct ? 'सही! शानदार।' : `गलत! सही उत्तर: ${q.correct}`}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                            सही विकल्प {q.correct}: {options.find(o => o.key === q.correct)?.text}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Pagination ───────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => { setPage(p => Math.max(1, p - 1)); setAnswered({}); setRevealed({}) }}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                background: page === 1 ? '#f1f5f9' : 'white',
                color: page === 1 ? '#94a3b8' : '#1e40af',
                border: '1.5px solid #e4e9f2',
                cursor: page === 1 ? 'default' : 'pointer',
              }}>
              ← पिछला
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pg: number
                if (totalPages <= 5) pg = i + 1
                else if (page <= 3) pg = i + 1
                else if (page >= totalPages - 2) pg = totalPages - 4 + i
                else pg = page - 2 + i
                return (
                  <button key={pg}
                    onClick={() => { setPage(pg); setAnswered({}); setRevealed({}) }}
                    className="w-9 h-9 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: pg === page ? '#1e40af' : 'white',
                      color: pg === page ? 'white' : '#475569',
                      border: `1.5px solid ${pg === page ? '#1e40af' : '#e4e9f2'}`,
                    }}>
                    {pg}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => { setPage(p => Math.min(totalPages, p + 1)); setAnswered({}); setRevealed({}) }}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                background: page === totalPages ? '#f1f5f9' : 'white',
                color: page === totalPages ? '#94a3b8' : '#1e40af',
                border: '1.5px solid #e4e9f2',
                cursor: page === totalPages ? 'default' : 'pointer',
              }}>
              अगला →
            </button>
          </div>
        )}

        <p className="text-center text-xs mt-4" style={{ color: '#94a3b8' }}>
          पेज {page} / {totalPages} · कुल {total} प्रश्न
        </p>
      </div>
    </div>
  )
}
