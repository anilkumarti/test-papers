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
interface SubjectStat { name: string; nameHi: string; color: string; correct: number; wrong: number; unattempted: number; total: number; timeTaken: number }
interface TopicStat { subjectNameHi: string; subjectColor: string; nameHi: string; correct: number; wrong: number; unattempted: number; total: number; timeTaken: number; accuracy?: number }
interface DiffStat { correct: number; wrong: number; unattempted: number; total: number }

export default function ResultsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<{
    attempt: { test: { titleHi: string; totalMarks: number; totalQuestions: number; duration: number; negativeMarks: number }; score: number; percentage: number; timeTaken: number; answers: QAttempt[] }
    stats: { totalCorrect: number; totalWrong: number; totalUnattempted: number; attempted: number; accuracy: number }
    subjectStats: SubjectStat[]
    topicStats: TopicStat[]
    difficultyStats: { EASY: DiffStat; MEDIUM: DiffStat; HARD: DiffStat }
    weakAreas: (TopicStat & { accuracy: number })[]
  } | null>(null)
  const [tab, setTab] = useState<'overview' | 'time' | 'review'>('review')
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'wrong' | 'unattempted'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/results/${id}`).then(r => {
      if (r.status === 401) { router.push('/auth/login'); return null }
      return r.json()
    }).then(d => { if (d) { setData(d); setLoading(false) } })
  }, [id, router])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div></div>
  if (!data) return <div className="min-h-screen flex items-center justify-center text-slate-500">परिणाम नहीं मिला</div>

  const { attempt, stats, subjectStats, topicStats, difficultyStats, weakAreas } = data
  const pct = Math.round(attempt.percentage ?? 0)
  const grade = pct >= 80 ? '🏆 उत्कृष्ट' : pct >= 60 ? '👍 अच्छा' : pct >= 40 ? '📚 सामान्य' : '💪 और मेहनत करें'
  const gradeColor = pct >= 80 ? 'text-green-700' : pct >= 60 ? 'text-blue-700' : pct >= 40 ? 'text-amber-700' : 'text-red-700'

  const getOpt = (q: QAttempt['question'], key: string) => ({ A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD }[key] ?? '')

  const reviewedAnswers = attempt.answers.filter(a => {
    if (reviewFilter === 'correct') return a.isCorrect
    if (reviewFilter === 'wrong') return a.selectedOption && !a.isCorrect
    if (reviewFilter === 'unattempted') return !a.selectedOption
    return true
  })

  const totalTimeSec = attempt.timeTaken ?? 0
  const avgTimeSec = stats.attempted > 0 ? Math.round(totalTimeSec / attempt.answers.length) : 0
  const durationSec = attempt.test.duration * 60
  const timeUsedPct = durationSec > 0 ? Math.min(100, Math.round((totalTimeSec / durationSec) * 100)) : 0

  const diffLabels: Record<string, string> = { EASY: 'आसान', MEDIUM: 'मध्यम', HARD: 'कठिन' }
  const diffColors: Record<string, string> = { EASY: '#10b981', MEDIUM: '#f59e0b', HARD: '#ef4444' }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Score Card */}
        <div className="card bg-gradient-to-br from-blue-800 to-blue-700 text-white mb-6">
          <div className="text-center">
            <div className="text-sm text-blue-200 mb-2">{attempt.test.titleHi}</div>
            <div className="text-5xl font-bold mb-1 text-white">{attempt.score}<span className="text-2xl text-blue-200">/{attempt.test.totalMarks}</span></div>
            <div className="text-blue-200 text-sm mb-4">{pct}% अंक</div>
            <div className={`text-lg font-bold ${gradeColor} bg-white px-6 py-2 rounded-full inline-block`}>{grade}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="text-center bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-green-300">{stats.totalCorrect}</div>
              <div className="text-blue-200 text-xs mt-0.5">✓ सही</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-red-300">{stats.totalWrong}</div>
              <div className="text-blue-200 text-xs mt-0.5">✗ गलत</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-slate-300">{stats.totalUnattempted}</div>
              <div className="text-blue-200 text-xs mt-0.5">— छोड़े</div>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-3">
              <div className="text-2xl font-bold text-amber-300">{stats.accuracy}%</div>
              <div className="text-blue-200 text-xs mt-0.5">सटीकता</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-blue-200">
            <span>⏱ कुल समय: {formatTime(totalTimeSec)}</span>
            <span>📊 प्रयास: {stats.attempted}/{attempt.test.totalQuestions}</span>
            <span>⚡ औसत: {avgTimeSec}s/प्रश्न</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([['review', '📝 उत्तर देखें'], ['overview', '📊 विश्लेषण'], ['time', '⏱ समय']] as const).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full font-semibold text-sm ${tab === t ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Subject Analysis */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4 text-lg">📚 विषयवार प्रदर्शन</h2>
              <div className="space-y-4">
                {subjectStats.map((s, i) => {
                  const acc = s.correct + s.wrong > 0 ? Math.round(s.correct / (s.correct + s.wrong) * 100) : 0
                  const score = s.correct - s.wrong * attempt.test.negativeMarks
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }}></div>
                          <span className="font-semibold text-slate-700 text-sm">{s.nameHi}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-green-700 font-semibold">✓{s.correct}</span>
                          <span className="text-red-600 font-semibold">✗{s.wrong}</span>
                          <span className="text-slate-400">—{s.unattempted}</span>
                          <span className="font-bold text-slate-800 w-12 text-right">{score} अंक</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden flex">
                          <div className="bg-green-500 h-full transition-all" style={{ width: `${(s.correct / s.total) * 100}%` }}></div>
                          <div className="bg-red-400 h-full transition-all" style={{ width: `${(s.wrong / s.total) * 100}%` }}></div>
                          <div className="bg-slate-300 h-full transition-all" style={{ width: `${(s.unattempted / s.total) * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 w-10 text-right">{acc}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4 text-lg">🎯 कठिनाई स्तर विश्लेषण</h2>
              <div className="grid grid-cols-3 gap-4">
                {(['EASY', 'MEDIUM', 'HARD'] as const).map(d => {
                  const s = difficultyStats[d]
                  const acc = s.correct + s.wrong > 0 ? Math.round(s.correct / (s.correct + s.wrong) * 100) : 0
                  return (
                    <div key={d} className="text-center p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="text-sm font-bold mb-2" style={{ color: diffColors[d] }}>{diffLabels[d]}</div>
                      <div className="text-3xl font-bold text-slate-800 mb-1">{acc}%</div>
                      <div className="text-xs text-slate-500 mb-3">सटीकता</div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                        <div className="h-2 rounded-full" style={{ width: `${acc}%`, background: diffColors[d] }}></div>
                      </div>
                      <div className="text-xs space-y-1 text-left">
                        <div className="flex justify-between"><span className="text-slate-500">कुल:</span><span className="font-semibold">{s.total}</span></div>
                        <div className="flex justify-between"><span className="text-green-600">सही:</span><span className="font-semibold text-green-700">{s.correct}</span></div>
                        <div className="flex justify-between"><span className="text-red-500">गलत:</span><span className="font-semibold text-red-600">{s.wrong}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">छोड़े:</span><span className="font-semibold text-slate-500">{s.unattempted}</span></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Weak Areas */}
            {weakAreas.length > 0 && (
              <div className="card border-l-4 border-red-400">
                <h2 className="font-bold text-slate-800 mb-1 text-lg">⚠️ कमजोर क्षेत्र</h2>
                <p className="text-slate-500 text-xs mb-4">इन टॉपिक्स में अधिक अभ्यास करें</p>
                <div className="space-y-3">
                  {weakAreas.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: t.subjectColor }}>{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-semibold text-slate-700 truncate">{t.nameHi}</span>
                          <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: t.accuracy < 30 ? '#ef4444' : t.accuracy < 60 ? '#f59e0b' : '#10b981' }}>{t.accuracy}%</span>
                        </div>
                        <div className="text-xs text-slate-400">{t.subjectNameHi} · {t.correct}/{t.correct + t.wrong} सही</div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                          <div className="h-1.5 rounded-full bg-red-400 transition-all" style={{ width: `${t.accuracy}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/tests" className="btn-secondary flex-1 justify-center py-3">📋 और टेस्ट दें</Link>
              <Link href="/dashboard" className="btn-primary flex-1 justify-center py-3">📊 डैशबोर्ड</Link>
            </div>
          </div>
        )}

        {/* TIME TAB */}
        {tab === 'time' && (
          <div className="space-y-6">
            {/* Overall Time */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4 text-lg">⏱ समय सारांश</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-700">{formatTime(totalTimeSec)}</div>
                  <div className="text-xs text-slate-500 mt-1">कुल समय</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-700">{formatTime(durationSec - totalTimeSec > 0 ? durationSec - totalTimeSec : 0)}</div>
                  <div className="text-xs text-slate-500 mt-1">बचा समय</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-700">{avgTimeSec}s</div>
                  <div className="text-xs text-slate-500 mt-1">औसत/प्रश्न</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-700">{timeUsedPct}%</div>
                  <div className="text-xs text-slate-500 mt-1">समय उपयोग</div>
                </div>
              </div>
              <div className="mb-2 flex justify-between text-xs text-slate-500">
                <span>समय उपयोग</span>
                <span>{formatTime(totalTimeSec)} / {attempt.test.duration} मिनट</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <div className={`h-4 rounded-full transition-all ${timeUsedPct > 90 ? 'bg-red-500' : timeUsedPct > 70 ? 'bg-amber-500' : 'bg-blue-500'}`}
                  style={{ width: `${timeUsedPct}%` }}></div>
              </div>
            </div>

            {/* Time per Subject */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4 text-lg">📚 विषयवार समय</h2>
              <div className="space-y-4">
                {subjectStats.map((s, i) => {
                  const avgT = s.total > 0 ? Math.round(s.timeTaken / s.total) : 0
                  const pctTime = totalTimeSec > 0 ? Math.round((s.timeTaken / totalTimeSec) * 100) : 0
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: s.color }}></div>
                          <span className="text-sm font-semibold text-slate-700">{s.nameHi}</span>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span>कुल: <strong className="text-slate-700">{formatTime(s.timeTaken)}</strong></span>
                          <span>औसत: <strong className="text-slate-700">{avgT}s</strong></span>
                          <span className="font-bold text-slate-600">{pctTime}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3">
                        <div className="h-3 rounded-full" style={{ width: `${pctTime}%`, background: s.color }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Per-question time list: fastest and slowest */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4 text-lg">🐢 सबसे अधिक समय वाले प्रश्न</h2>
              <div className="space-y-2">
                {[...attempt.answers]
                  .filter(a => (a.timeTaken ?? 0) > 0)
                  .sort((a, b) => (b.timeTaken ?? 0) - (a.timeTaken ?? 0))
                  .slice(0, 5)
                  .map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate">{a.question.textHi}</p>
                        <span className="text-xs text-slate-400">{a.question.subject.nameHi} · {a.question.topic.nameHi}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-amber-700">{a.timeTaken}s</div>
                        <div className={`text-xs font-semibold ${a.isCorrect ? 'text-green-600' : !a.selectedOption ? 'text-slate-400' : 'text-red-500'}`}>
                          {a.isCorrect ? '✓ सही' : !a.selectedOption ? '— छोड़ा' : '✗ गलत'}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4 text-lg">⚡ सबसे कम समय वाले प्रश्न</h2>
              <div className="space-y-2">
                {[...attempt.answers]
                  .filter(a => (a.timeTaken ?? 0) > 0 && a.selectedOption !== null)
                  .sort((a, b) => (a.timeTaken ?? 0) - (b.timeTaken ?? 0))
                  .slice(0, 5)
                  .map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate">{a.question.textHi}</p>
                        <span className="text-xs text-slate-400">{a.question.subject.nameHi} · {a.question.topic.nameHi}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-green-700">{a.timeTaken}s</div>
                        <div className={`text-xs font-semibold ${a.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                          {a.isCorrect ? '✓ सही' : '✗ गलत'}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEW TAB */}
        {tab === 'review' && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap mb-2">
              {(['all', 'correct', 'wrong', 'unattempted'] as const).map(f => (
                <button key={f} onClick={() => setReviewFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${reviewFilter === f ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-300'}`}>
                  {f === 'all' ? `सभी (${attempt.answers.length})` : f === 'correct' ? `✓ सही (${stats.totalCorrect})` : f === 'wrong' ? `✗ गलत (${stats.totalWrong})` : `— छोड़े (${stats.totalUnattempted})`}
                </button>
              ))}
            </div>
            {reviewedAnswers.map((qa, idx) => {
              const q = qa.question
              const opts = [{ k: 'A', t: q.optionA }, { k: 'B', t: q.optionB }, { k: 'C', t: q.optionC }, { k: 'D', t: q.optionD }]
              return (
                <div key={qa.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge text-xs text-white" style={{ background: q.subject.color }}>{q.subject.nameHi}</span>
                      <span className="badge text-xs bg-slate-100 text-slate-600">{q.topic.nameHi}</span>
                      <span className={`badge text-xs bg-slate-100 ${getDifficultyColor(q.difficulty)}`}>{getDifficultyLabel(q.difficulty)}</span>
                      {qa.timeTaken && <span className="badge text-xs bg-amber-50 text-amber-700">⏱ {qa.timeTaken}s</span>}
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ml-2 ${qa.isCorrect ? 'text-green-700' : !qa.selectedOption ? 'text-slate-500' : 'text-red-600'}`}>
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
                          <span className="flex-1">{o.t}</span>
                          {isCorrect && <span className="ml-auto text-green-700 text-xs font-semibold flex-shrink-0">✓ सही उत्तर</span>}
                          {isSelected && !isCorrect && <span className="ml-auto text-red-600 text-xs font-semibold flex-shrink-0">आपका उत्तर</span>}
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
