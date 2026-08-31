'use client'
import { useState, useEffect, useCallback } from 'react'
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

// ── Subject card ───────────────────────────────────────────────
function SubjectCard({ subject, count, onSelect }: { subject: Subject; count: number; onSelect: () => void }) {
  return (
    <button onClick={onSelect}
      className="w-full text-left rounded-2xl overflow-hidden bg-white transition-all"
      style={{ border: '1px solid #e4e9f2', boxShadow: '0 2px 10px rgba(15,23,42,0.06)' }}>
      <div className="h-1.5" style={{ background: subject.color }} />
      <div className="p-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
          style={{ background: subject.color + '20' }}>
          {SUBJECT_ICONS[subject.code] ?? '📋'}
        </div>
        <div className="font-bold text-lg leading-snug mb-1" style={{ color: '#0f172a' }}>
          {subject.name_hi}
        </div>
        <div className="text-sm font-medium mb-4" style={{ color: '#64748b' }}>
          {count} प्रश्न उपलब्ध
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: subject.color + '15', color: subject.color }}>
            PYQ बैंक
          </span>
          <span className="text-sm font-bold" style={{ color: subject.color }}>
            शुरू करें →
          </span>
        </div>
      </div>
    </button>
  )
}

// ── Question viewer ────────────────────────────────────────────
function QuestionViewer({ subject, count, onBack }: { subject: Subject; count: number; onBack: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [loading, setLoading]     = useState(true)
  const [answered, setAnswered]   = useState<Record<string, string>>({})
  const [revealed, setRevealed]   = useState<Record<string, boolean>>({})
  const PAGE_SIZE = 20

  const fetchPage = useCallback(async (pg: number) => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/question-bank?subject=${subject.code}&page=${pg}`)
      const data = await res.json()
      setQuestions(data.questions || [])
      setTotal(data.total || 0)
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [subject.code])

  useEffect(() => { fetchPage(page) }, [page, fetchPage])

  const handleOption = (qId: string, opt: string) => {
    if (revealed[qId]) return
    setAnswered(p => ({ ...p, [qId]: opt }))
    setRevealed(p => ({ ...p, [qId]: true }))
  }

  const changePage = (pg: number) => {
    setPage(pg); setAnswered({}); setRevealed({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages    = Math.ceil(total / PAGE_SIZE)
  const answeredCount = Object.keys(revealed).length
  const correctCount  = Object.entries(revealed).filter(([id]) => {
    const q = questions.find(x => x.id === id)
    return q && answered[id] === q.correct
  }).length
  const accuracy = answeredCount ? Math.round(correctCount / answeredCount * 100) : null

  const options = (q: Question) => [
    { key: 'A', text: q.optionA }, { key: 'B', text: q.optionB },
    { key: 'C', text: q.optionC }, { key: 'D', text: q.optionD },
  ]

  return (
    <div>
      {/* Header */}
      <div className="rounded-2xl p-4 mb-5 flex items-center gap-3"
        style={{ background: subject.color + '12', border: `1.5px solid ${subject.color}30` }}>
        <button onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 bg-white"
          style={{ border: '1.5px solid #e4e9f2', color: '#475569' }}>
          ←
        </button>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: subject.color, color: 'white' }}>
          {SUBJECT_ICONS[subject.code] ?? '📋'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-base" style={{ color: '#0f172a' }}>{subject.name_hi}</div>
          <div className="text-xs" style={{ color: '#64748b' }}>{total} प्रश्न · पेज {page}/{totalPages}</div>
        </div>
        {accuracy !== null && (
          <div className="text-center">
            <div className="text-xl font-bold"
              style={{ color: accuracy >= 60 ? '#16a34a' : accuracy >= 40 ? '#f59e0b' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
              {accuracy}%
            </div>
            <div className="text-xs" style={{ color: '#94a3b8' }}>सटीकता</div>
          </div>
        )}
      </div>

      {/* Progress */}
      {answeredCount > 0 && (
        <div className="bg-white rounded-xl px-4 py-2.5 mb-4 flex items-center gap-3"
          style={{ border: '1px solid #e4e9f2' }}>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${(answeredCount / PAGE_SIZE) * 100}%`, background: subject.color }} />
          </div>
          <div className="text-xs font-bold whitespace-nowrap" style={{ color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>
            {answeredCount}/{PAGE_SIZE} · ✓{correctCount} ✗{answeredCount - correctCount}
          </div>
        </div>
      )}

      {/* Questions */}
      {loading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: subject.color, borderTopColor: 'transparent' }} />
          <p className="text-sm" style={{ color: '#94a3b8' }}>लोड हो रहा है...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isRevealed = revealed[q.id]
            const chosen     = answered[q.id]
            const opts       = options(q)

            return (
              <div key={q.id} className="bg-white rounded-2xl overflow-hidden"
                style={{ border: '1px solid #e4e9f2', boxShadow: '0 2px 8px rgba(15,23,42,0.05)' }}>
                <div className="h-1" style={{ background: subject.color }} />
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: subject.color + '15', color: subject.color }}>
                      {SUBJECT_ICONS[subject.code]} {subject.name_hi}
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                      Q{(page - 1) * PAGE_SIZE + idx + 1}
                    </span>
                  </div>

                  <p className="font-semibold text-base leading-relaxed mb-4" style={{ color: '#0f172a' }}>
                    {q.textHi}
                  </p>

                  <div className="space-y-2">
                    {opts.map(opt => {
                      const isCorrect = opt.key === q.correct
                      const isChosen  = chosen === opt.key
                      let bg = 'white', border = '#e2e8f0', color = '#334155', icon = opt.key

                      if (isRevealed) {
                        if (isCorrect)      { bg = '#dcfce7'; border = '#16a34a'; color = '#15803d'; icon = '✓' }
                        else if (isChosen)  { bg = '#fee2e2'; border = '#dc2626'; color = '#b91c1c'; icon = '✗' }
                        else               { bg = '#f8faff'; border = '#e4e9f2'; color = '#94a3b8' }
                      }

                      return (
                        <button key={opt.key}
                          onClick={() => handleOption(q.id, opt.key)}
                          disabled={isRevealed}
                          className="w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl transition-colors"
                          style={{ background: bg, border: `2px solid ${border}`, color, cursor: isRevealed ? 'default' : 'pointer' }}>
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                            style={{
                              background: isRevealed
                                ? (isCorrect ? '#16a34a' : isChosen ? '#dc2626' : '#e2e8f0')
                                : subject.color + '20',
                              color: isRevealed
                                ? ((isCorrect || isChosen) ? 'white' : '#94a3b8')
                                : subject.color,
                            }}>
                            {icon}
                          </span>
                          <span className="flex-1 text-sm leading-relaxed">{opt.text}</span>
                        </button>
                      )
                    })}
                  </div>

                  {isRevealed && (
                    <div className="mt-3 flex items-start gap-3 px-4 py-3 rounded-xl"
                      style={{
                        background: chosen === q.correct ? '#f0fdf4' : '#fff7ed',
                        border: `1px solid ${chosen === q.correct ? '#bbf7d0' : '#fed7aa'}`,
                      }}>
                      <span className="text-lg mt-0.5">{chosen === q.correct ? '🎉' : '📖'}</span>
                      <div>
                        <div className="text-sm font-bold"
                          style={{ color: chosen === q.correct ? '#15803d' : '#9a3412' }}>
                          {chosen === q.correct ? 'बिल्कुल सही!' : `गलत — सही उत्तर: विकल्प ${q.correct}`}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                          {opts.find(o => o.key === q.correct)?.text}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
          <button onClick={() => changePage(Math.max(1, page - 1))} disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: page === 1 ? '#f1f5f9' : 'white', color: page === 1 ? '#94a3b8' : subject.color, border: '1.5px solid #e4e9f2' }}>
            ← पिछला
          </button>
          {(() => {
            const start = Math.max(1, Math.min(page - 2, totalPages - 4))
            const end   = Math.min(totalPages, start + 4)
            return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(pg => (
              <button key={pg} onClick={() => changePage(pg)}
                className="w-9 h-9 rounded-xl text-sm font-bold"
                style={{ background: pg === page ? subject.color : 'white', color: pg === page ? 'white' : '#475569', border: `1.5px solid ${pg === page ? subject.color : '#e4e9f2'}` }}>
                {pg}
              </button>
            ))
          })()}
          <button onClick={() => changePage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
            className="px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: page === totalPages ? '#f1f5f9' : 'white', color: page === totalPages ? '#94a3b8' : subject.color, border: '1.5px solid #e4e9f2' }}>
            अगला →
          </button>
        </div>
      )}
      <p className="text-center text-xs mt-3 pb-4" style={{ color: '#94a3b8' }}>
        पेज {page} / {totalPages} · कुल {total} प्रश्न
      </p>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────
export default function QuestionBankPage() {
  const [subjects, setSubjects]         = useState<Subject[]>([])
  const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>({})
  const [totalAll, setTotalAll]         = useState(0)
  const [selected, setSelected]         = useState<Subject | null>(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    fetch('/api/question-bank?subject=ALL&page=1')
      .then(r => r.json())
      .then(data => {
        setSubjects(data.subjects || [])
        setSubjectCounts(data.subjectCounts || {})
        setTotalAll(data.totalAll || data.total || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#f0f4ff' }}>
      <Navbar />

      {/* Hero */}
      <div className="px-4 pt-10 pb-20 text-white"
        style={{ background: 'linear-gradient(135deg, #0c1a4e 0%, #1e3a8a 60%, #7c3aed 100%)' }}>
        <div className="max-w-5xl mx-auto">
          {selected ? (
            <>
              <button onClick={() => { setSelected(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="flex items-center gap-1.5 text-sm font-bold mb-4"
                style={{ color: '#c4b5fd', opacity: 0.85 }}>
                ← सभी विषय
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(255,255,255,0.15)' }}>
                  {SUBJECT_ICONS[selected.code] ?? '📋'}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{selected.name_hi}</h1>
                  <p className="text-sm" style={{ color: '#bfdbfe' }}>
                    {subjectCounts[selected.code] ?? 0} PYQ प्रश्न · उत्तर चुनें और तुरंत सही जवाब देखें
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#c4b5fd' }}>
                📚 MPESB आधिकारिक पिछले वर्ष प्रश्न
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">प्रश्न बैंक</h1>
              <p className="text-sm mb-5" style={{ color: '#bfdbfe' }}>
                विषय चुनें और अभ्यास शुरू करें — {totalAll}+ PYQ प्रश्न, उत्तर चुनते ही सही जवाब दिखता है
              </p>
              <div className="flex flex-wrap gap-2">
                {subjects.map(s => (
                  <button key={s.code} onClick={() => setSelected(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {SUBJECT_ICONS[s.code]} {s.name_hi} ({subjectCounts[s.code] ?? 0})
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-16">
        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#7c3aed', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: '#94a3b8' }}>लोड हो रहा है...</p>
          </div>
        ) : selected ? (
          <QuestionViewer
            subject={selected}
            count={subjectCounts[selected.code] ?? 0}
            onBack={() => { setSelected(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {subjects.map(s => (
                <SubjectCard key={s.code} subject={s}
                  count={subjectCounts[s.code] ?? 0}
                  onSelect={() => setSelected(s)} />
              ))}
            </div>
            <div className="mt-6 rounded-2xl p-5 flex items-center gap-4"
              style={{ background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)', color: 'white' }}>
              <div className="text-3xl">📚</div>
              <div>
                <div className="font-bold text-base">कुल {totalAll} प्रश्न उपलब्ध</div>
                <div className="text-sm opacity-80">MPESB आधिकारिक PYQ से चुने गए प्रश्न — विषय चुनकर अभ्यास शुरू करें</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
