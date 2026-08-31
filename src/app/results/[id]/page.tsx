'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { formatTime, getDifficultyLabel, getDifficultyColor } from '@/lib/utils'

// ─── Score Card Generator ──────────────────────────────────────────────────────

function buildScoreCardCanvas(p: {
  testName: string; score: number; totalMarks: number; percentage: number
  grade: string; correct: number; wrong: number; skipped: number; accuracy: number; host: string
}): HTMLCanvasElement {
  const W = 800, H = 460, DPR = 2
  const canvas = document.createElement('canvas')
  canvas.width = W * DPR; canvas.height = H * DPR
  const ctx = canvas.getContext('2d')!
  ctx.scale(DPR, DPR)

  // Background
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#0c1a4e'); grad.addColorStop(0.55, '#1e3a8a'); grad.addColorStop(1, '#1d4ed8')
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H)

  // Decorative circles
  ctx.save(); ctx.globalAlpha = 0.055; ctx.fillStyle = '#fff'
  ;([[740, -30, 175], [50, 470, 140], [W / 2, H / 2, 250]] as [number, number, number][]).forEach(([x, y, r]) => {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
  })
  ctx.restore()

  // Rounded-rect helper
  function rr(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath()
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  const cx = W / 2

  // Header
  ctx.textAlign = 'center'; ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = '#93c5fd'
  ctx.fillText('MP PATWARI 2026  •  MOCK TEST SERIES', cx, 38)
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(60, 52); ctx.lineTo(W - 60, 52); ctx.stroke()

  // Test name
  const name = p.testName.length > 55 ? p.testName.slice(0, 55) + '…' : p.testName
  ctx.font = '15px sans-serif'; ctx.fillStyle = '#bfdbfe'; ctx.fillText(name, cx, 76)

  // Score — left half right-aligned, right half left-aligned
  ctx.textAlign = 'right'; ctx.font = 'bold 88px sans-serif'; ctx.fillStyle = '#ffffff'
  ctx.fillText(String(p.score), cx - 8, 162)
  ctx.textAlign = 'left'; ctx.font = 'bold 34px sans-serif'; ctx.fillStyle = '#93c5fd'
  ctx.fillText('/ ' + p.totalMarks, cx + 8, 160)

  // Percentage + grade
  ctx.textAlign = 'center'
  ctx.font = 'bold 22px sans-serif'; ctx.fillStyle = '#fbbf24'
  ctx.fillText(p.percentage + '% अंक', cx, 195)   // "% अंक"
  const gc = p.percentage >= 80 ? '#86efac' : p.percentage >= 60 ? '#93c5fd' : p.percentage >= 40 ? '#fcd34d' : '#fca5a5'
  ctx.font = 'bold 16px sans-serif'; ctx.fillStyle = gc; ctx.fillText(p.grade, cx, 222)

  // Separator
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.beginPath(); ctx.moveTo(60, 242); ctx.lineTo(W - 60, 242); ctx.stroke()

  // Stats boxes
  const statItems = [
    { val: String(p.correct),  label: '✓ सही',   color: '#86efac' },  // ✓ सही
    { val: String(p.wrong),    label: '✗ गलत',    color: '#fca5a5' },  // ✗ गलत
    { val: String(p.skipped),  label: '— छोड़े', color: '#cbd5e1' }, // — छोड़े
    { val: p.accuracy + '%',   label: 'सटीकता', color: '#fcd34d' }, // सटीकता
  ]
  const bW = 162, bH = 72, bGap = 13
  const bTW = statItems.length * bW + (statItems.length - 1) * bGap
  const bX0 = (W - bTW) / 2
  const bY = 260

  statItems.forEach((s, i) => {
    const bx = bX0 + i * (bW + bGap)
    ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = '#fff'; rr(bx, bY, bW, bH, 12); ctx.fill(); ctx.restore()
    ctx.textAlign = 'center'
    ctx.font = 'bold 28px sans-serif'; ctx.fillStyle = s.color; ctx.fillText(s.val, bx + bW / 2, bY + 34)
    ctx.font = '13px sans-serif'; ctx.fillStyle = '#bfdbfe'; ctx.fillText(s.label, bx + bW / 2, bY + 56)
  })

  // Challenge text
  ctx.font = 'bold 19px sans-serif'; ctx.fillStyle = '#fbbf24'
  // "क्या आप मुझे हरा सकते हैं?" in unicode to avoid any encoding issues
  ctx.fillText('क्या आप मुझे हरा सकते हैं?', cx, 374)

  // Bottom bar
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0, H - 40, W, 40)
  ctx.font = 'bold 11.5px sans-serif'; ctx.fillStyle = '#93c5fd'
  ctx.fillText(p.host + '  •  MP Patwari 2026 Mock Test Series', cx, H - 13)

  return canvas
}

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
  const [sharing, setSharing] = useState(false)

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

  async function shareCard() {
    setSharing(true)
    try {
      const canvas = buildScoreCardCanvas({
        testName: attempt.test.titleHi,
        score: attempt.score,
        totalMarks: attempt.test.totalMarks,
        percentage: pct,
        grade,
        correct: stats.totalCorrect,
        wrong: stats.totalWrong,
        skipped: stats.totalUnattempted,
        accuracy: stats.accuracy,
        host: window.location.host,
      })

      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/png'))
      const file = new File([blob], 'mp-patwari-score.png', { type: 'image/png' })
      const shareText = `MP Patwari 2026 Mock Test में मेरा Score: ${pct}% (${attempt.score}/${attempt.test.totalMarks})\nक्या आप मुझे हरा सकते हैं? 👇\n${window.location.origin}`

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'MP Patwari Score Card', text: shareText })
      } else {
        // Desktop fallback: download
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'mp-patwari-score.png'; a.click()
        URL.revokeObjectURL(url)
      }
    } finally {
      setSharing(false)
    }
  }

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
        <div className="mb-6 rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)', boxShadow: '0 4px 24px rgba(30,58,138,0.3)' }}>
          <div className="text-center">
            <div className="text-sm mb-2" style={{ color: '#93c5fd' }}>{attempt.test.titleHi}</div>
            <div className="text-6xl font-bold mb-1" style={{ color: '#ffffff', fontVariantNumeric: 'tabular-nums' }}>
              {attempt.score}
              <span className="text-3xl font-semibold" style={{ color: '#93c5fd' }}>/{attempt.test.totalMarks}</span>
            </div>
            <div className="text-sm mb-5" style={{ color: '#bfdbfe' }}>{pct}% अंक</div>
            <div className={`text-base font-bold ${gradeColor} bg-white px-6 py-2 rounded-full inline-block`}>{grade}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { val: stats.totalCorrect, label: '✓ सही', color: '#86efac' },
              { val: stats.totalWrong,   label: '✗ गलत', color: '#fca5a5' },
              { val: stats.totalUnattempted, label: '— छोड़े', color: '#cbd5e1' },
              { val: `${stats.accuracy}%`, label: 'सटीकता', color: '#fcd34d' },
            ].map((s, i) => (
              <div key={i} className="text-center rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.12)' }}>
                <div className="text-2xl font-bold" style={{ color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                <div className="text-xs mt-0.5" style={{ color: '#bfdbfe' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm" style={{ color: '#93c5fd' }}>
            <span>⏱ कुल समय: {formatTime(totalTimeSec)}</span>
            <span>📊 प्रयास: {stats.attempted}/{attempt.test.totalQuestions}</span>
            <span>⚡ औसत: {avgTimeSec}s/प्रश्न</span>
          </div>

          {/* Share button */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={shareCard}
              disabled={sharing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95"
              style={{
                background: sharing ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: sharing ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!sharing) e.currentTarget.style.background = 'rgba(255,255,255,0.28)' }}
              onMouseLeave={e => { e.currentTarget.style.background = sharing ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.18)' }}
            >
              {sharing
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> बन रहा है...</>
                : <>📤 Score Card Share करें</>
              }
            </button>
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
