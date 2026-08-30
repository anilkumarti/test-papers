'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { formatTime, getDifficultyLabel, getDifficultyColor } from '@/lib/utils'

interface QAttempt {
  id: string; questionId: string; selectedOption: string | null; isCorrect: boolean | null; timeTaken: number | null
  question: { id: string; textHi: string; optionA: string; optionB: string; optionC: string; optionD: string; correct: string; explanation: string; difficulty: string; subject: { nameHi: string; color: string }; topic: { nameHi: string } }
}

export default function ResultsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<{ attempt: { test: { titleHi: string; totalMarks: number; totalQuestions: number; duration: number; negativeMarks: number }; score: number; percentage: number; timeTaken: number; answers: QAttempt[] }; stats: { totalCorrect: number; totalWrong: number; totalUnattempted: number; attempted: number; accuracy: number }; subjectStats: { name: string; nameHi: string; color: string; correct: number; wrong: number; unattempted: number; total: number }[] } | null>(null)
  const [tab, setTab] = useState<'overview' | 'review'>('overview')
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'wrong' | 'unattempted'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/results/${id}`).then(r => {
      if (r.status === 401) { router.push('/auth/login'); return null }
      return r.json()
    }).then(d => {
      if (d) { setData(d); setLoading(false) }
    })
  }, [id, router])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div></div>
  )
  if (!data) return <div className="min-h-screen flex items-center justify-center text-slate-500">परिणाम नहीं मिला</div>

  const { attempt, stats, subjectStats } = data
  const pct = Math.round(attempt.percentage ?? 0)
  const grade = pct >= 80 ? '🏆 उत्कृष्ट' : pct >= 60 ? '👍 अच्छा' : pct >= 40 ? '📚 सामान्य' : '💪 और मेहनत करें'
  const gradeColor = pct >= 80 ? 'text-green-700' : pct >= 60 ? 'text-blue-700' : pct >= 40 ? 'text-amber-700' : 'text-red-700'

  const optLabels = { A: attempt.answers[0]?.question.optionA, B: '', C: '', D: '' }
  const getOpt = (q: QAttempt['question'], key: string) => ({ A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD }[key] ?? '')

  const reviewedAnswers = attempt.answers.filter(a => {
    if (reviewFilter === 'correct') return a.isCorrect
    if (reviewFilter === 'wrong') return a.selectedOption && !a.isCorrect
    if (reviewFilter === 'unattempted') return !a.selectedOption
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Score Card */}
        <div className="card bg-gradient-to-br from-blue-800 to-blue-700 text-white mb-6">
          <div className="text-center">
            <div className="text-sm text-blue-200 mb-2">{attempt.test.titleHi}</div>
            <div className={`text-4xl font-bold mb-1 ${gradeColor.replace('text-', 'text-')} text-white`}>
              {attempt.score}/{attempt.test.totalMarks}
            </div>
            <div className="text-blue-200 text-sm mb-4">{pct}% अंक</div>
            <div className={`text-lg font-bold ${gradeColor} bg-white px-6 py-2 rounded-full inline-block`}>{grade}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="text-center bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-green-300">{stats.totalCorrect}</div>
              <div className="text-blue-200 text-xs">सही</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-red-300">{stats.totalWrong}</div>
              <div className="text-blue-200 text-xs">गलत</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-slate-300">{stats.totalUnattempted}</div>
              <div className="text-blue-200 text-xs">अनुत्तरित</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-amber-300">{stats.accuracy}%</div>
              <div className="text-blue-200 text-xs">सटीकता</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-blue-200">
            <span>⏱ {attempt.timeTaken ? formatTime(attempt.timeTaken) : '—'}</span>
            <span>📊 प्रयास: {stats.attempted}/{attempt.test.totalQuestions}</span>
            {attempt.test.negativeMarks > 0 && <span>❌ नकारात्मक: {attempt.test.negativeMarks}</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('overview')} className={`px-5 py-2 rounded-full font-semibold text-sm ${tab === 'overview' ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}>विश्लेषण</button>
          <button onClick={() => setTab('review')} className={`px-5 py-2 rounded-full font-semibold text-sm ${tab === 'review' ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}>प्रश्न समीक्षा</button>
        </div>

        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Subject Analysis */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4">विषयवार प्रदर्शन</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-slate-200 text-slate-500">
                    <th className="text-left py-2 font-semibold">विषय</th>
                    <th className="text-center py-2 font-semibold">सही</th>
                    <th className="text-center py-2 font-semibold">गलत</th>
                    <th className="text-center py-2 font-semibold">अनुत्तरित</th>
                    <th className="text-center py-2 font-semibold">सटीकता</th>
                    <th className="text-right py-2 font-semibold">अंक</th>
                  </tr></thead>
                  <tbody>
                    {subjectStats.map((s, i) => {
                      const acc = s.correct + s.wrong > 0 ? Math.round(s.correct / (s.correct + s.wrong) * 100) : 0
                      return (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }}></div>
                              <span className="font-medium text-slate-700">{s.nameHi}</span>
                            </div>
                          </td>
                          <td className="text-center py-3 text-green-700 font-semibold">{s.correct}</td>
                          <td className="text-center py-3 text-red-600 font-semibold">{s.wrong}</td>
                          <td className="text-center py-3 text-slate-500">{s.unattempted}</td>
                          <td className="text-center py-3">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="flex-1 max-w-16 bg-slate-200 rounded-full h-1.5">
                                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${acc}%` }}></div>
                              </div>
                              <span className="text-slate-700 font-medium">{acc}%</span>
                            </div>
                          </td>
                          <td className="text-right py-3 font-bold text-slate-800">{s.correct - s.wrong * (attempt.test.negativeMarks)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/tests" className="btn-secondary flex-1 justify-center py-3">📋 और टेस्ट दें</Link>
              <Link href="/dashboard" className="btn-primary flex-1 justify-center py-3">📊 डैशबोर्ड देखें</Link>
            </div>
          </div>
        )}

        {tab === 'review' && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap mb-2">
              {(['all', 'correct', 'wrong', 'unattempted'] as const).map(f => (
                <button key={f} onClick={() => setReviewFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${reviewFilter === f ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-300'}`}>
                  {f === 'all' ? 'सभी' : f === 'correct' ? `✓ सही (${stats.totalCorrect})` : f === 'wrong' ? `✗ गलत (${stats.totalWrong})` : `— छोड़े (${stats.totalUnattempted})`}
                </button>
              ))}
            </div>
            {reviewedAnswers.map((qa, idx) => {
              const q = qa.question
              const opts = [{ k: 'A', t: q.optionA }, { k: 'B', t: q.optionB }, { k: 'C', t: q.optionC }, { k: 'D', t: q.optionD }]
              return (
                <div key={qa.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="badge text-xs text-white" style={{ background: q.subject.color }}>{q.subject.nameHi}</span>
                      <span className={`badge text-xs bg-slate-100 ${getDifficultyColor(q.difficulty)}`}>{getDifficultyLabel(q.difficulty)}</span>
                    </div>
                    <span className={`text-sm font-bold ${qa.isCorrect ? 'text-green-700' : !qa.selectedOption ? 'text-slate-500' : 'text-red-600'}`}>
                      {qa.isCorrect ? '✓ सही' : !qa.selectedOption ? '— छोड़ा' : '✗ गलत'}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium mb-3 leading-relaxed">{q.textHi}</p>
                  <div className="space-y-2">
                    {opts.map(o => {
                      const isCorrect = o.k === q.correct
                      const isSelected = o.k === qa.selectedOption
                      return (
                        <div key={o.k} className={`option-btn text-sm ${isCorrect ? 'correct' : isSelected && !isCorrect ? 'wrong' : ''}`}>
                          <span className={`w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center font-bold text-xs ${isCorrect ? 'border-green-600 bg-green-600 text-white' : isSelected ? 'border-red-500 bg-red-500 text-white' : 'border-slate-300 text-slate-500'}`}>{o.k}</span>
                          <span>{o.t}</span>
                          {isCorrect && <span className="ml-auto text-green-700 text-xs font-semibold">✓ सही उत्तर</span>}
                          {isSelected && !isCorrect && <span className="ml-auto text-red-600 text-xs font-semibold">आपका उत्तर</span>}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <span className="text-blue-700 font-semibold text-sm">💡 व्याख्या: </span>
                    <span className="text-blue-900 text-sm">{q.explanation}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
