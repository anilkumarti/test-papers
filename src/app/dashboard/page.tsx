'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { formatDate } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScorePoint { date: string; percentage: number; score: number; totalMarks: number; titleHi: string }
interface SubjectStat { name: string; nameHi: string; color: string; correct: number; total: number; accuracy: number }
interface DiffStat { correct: number; wrong: number; skipped: number; total: number; accuracy: number }
interface TopicStat { nameHi: string; subjectNameHi: string; subjectColor: string; correct: number; total: number; accuracy: number }

interface DashData {
  totalTests: number; bestScore: number; avgPercentage: number; totalQuestions: number
  totalAttempted: number; totalWrong: number; totalSkipped: number; marksLost: number
  avgTimePerQuestion: number; streak: number
  scoreHistory: ScorePoint[]
  activityCalendar: { date: string; count: number }[]
  recentAttempts: { id: string; test: { titleHi: string; totalMarks: number }; score: number; percentage: number; submittedAt: string }[]
  subjectStats: SubjectStat[]
  difficultyStats: { EASY: DiffStat; MEDIUM: DiffStat; HARD: DiffStat }
  topicStats: TopicStat[]
  strongSubjects: SubjectStat[]
  weakSubjects: SubjectStat[]
}

// ─── Helper components ────────────────────────────────────────────────────────

function ScorePill({ pct }: { pct: number }) {
  const p = Math.round(pct)
  const s = p >= 60
    ? { color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0' }
    : p >= 40
    ? { color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a' }
    : { color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }
  return <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ ...s, fontVariantNumeric: 'tabular-nums' }}>{p}%</span>
}

// ─── Score Trend Chart (inline SVG) ──────────────────────────────────────────

function ScoreTrendChart({ history }: { history: ScorePoint[] }) {
  if (history.length === 0) return (
    <div className="flex items-center justify-center h-32 text-sm" style={{ color: '#94a3b8' }}>
      टेस्ट देने के बाद यहाँ प्रगति दिखेगी
    </div>
  )

  const W = 560, H = 130
  const pL = 30, pR = 30, pT = 12, pB = 22
  const pw = W - pL - pR, ph = H - pT - pB

  const xAt = (i: number) => pL + (history.length < 2 ? pw / 2 : (i / (history.length - 1)) * pw)
  const yAt = (p: number) => pT + (1 - Math.min(100, Math.max(0, p)) / 100) * ph

  const linePts = history.map((p, i) => `${xAt(i).toFixed(1)},${yAt(p.percentage).toFixed(1)}`).join(' ')
  const areaPath = `M ${xAt(0).toFixed(1)},${(pT + ph).toFixed(1)} ${history.map((p, i) => `L ${xAt(i).toFixed(1)},${yAt(p.percentage).toFixed(1)}`).join(' ')} L ${xAt(history.length - 1).toFixed(1)},${(pT + ph).toFixed(1)} Z`
  const cutY = yAt(60)

  const labelIdxs: number[] = history.length <= 6
    ? history.map((_, i) => i)
    : [0, Math.floor(history.length * 0.33), Math.floor(history.length * 0.66), history.length - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: 'block' }}>
      {/* Y-axis grid */}
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line x1={pL} y1={yAt(v)} x2={W - pR} y2={yAt(v)} stroke="#f1f5f9" strokeWidth="1" />
          <text x={pL - 5} y={yAt(v) + 3.5} textAnchor="end" fontSize="8.5" fill="#cbd5e1">{v}%</text>
        </g>
      ))}

      {/* Cutoff 60% line */}
      <line x1={pL} y1={cutY} x2={W - pR} y2={cutY} stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x={W - pR + 4} y={cutY + 3.5} fontSize="8.5" fill="#f87171">60%</text>

      {/* Area fill */}
      {history.length > 1 && <path d={areaPath} fill="rgba(37,99,235,0.07)" />}

      {/* Line */}
      <polyline points={linePts} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {/* Points */}
      {history.map((p, i) => (
        <circle key={i} cx={xAt(i)} cy={yAt(p.percentage)} r={4}
          fill={p.percentage >= 60 ? '#16a34a' : '#2563eb'} stroke="white" strokeWidth="2">
          <title>{p.titleHi} — {p.percentage}% ({p.date})</title>
        </circle>
      ))}

      {/* X labels */}
      {labelIdxs.map(i => (
        <text key={i} x={xAt(i)} y={H - 4} textAnchor="middle" fontSize="8.5" fill="#94a3b8">
          {history[i].date.slice(5).replace('-', '/')}
        </text>
      ))}
    </svg>
  )
}

// ─── Activity Heatmap ─────────────────────────────────────────────────────────

function ActivityHeatmap({ calendar }: { calendar: { date: string; count: number }[] }) {
  const weeks: { date: string; count: number }[][] = []
  for (let i = 0; i < calendar.length; i += 7) weeks.push(calendar.slice(i, i + 7))

  const cellColor = (n: number) =>
    n === 0 ? '#f1f5f9' : n === 1 ? '#bfdbfe' : n === 2 ? '#60a5fa' : '#1d4ed8'

  const DAY_LABELS = ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श']

  return (
    <div className="flex gap-1" style={{ overflowX: 'auto' }}>
      {/* Day labels */}
      <div className="flex flex-col gap-1 mr-1 flex-shrink-0">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="flex items-center justify-end text-xs" style={{ height: 12, color: '#94a3b8', fontSize: 9, width: 14 }}>{d}</div>
        ))}
      </div>
      {/* Week columns */}
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1 flex-shrink-0">
          {week.map((day, di) => (
            <div key={di} className="rounded-sm" title={`${day.date}: ${day.count} टेस्ट`}
              style={{ width: 12, height: 12, background: cellColor(day.count), flexShrink: 0 }} />
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Cutoff Tracker ───────────────────────────────────────────────────────────

function CutoffTracker({ avgPct }: { avgPct: number }) {
  const CUTOFF = 60
  const gap = CUTOFF - avgPct
  const above = avgPct >= CUTOFF

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs font-semibold" style={{ color: '#475569' }}>कटऑफ लक्ष्य (60%)</span>
        <span className="text-xs font-bold" style={{ color: above ? '#15803d' : '#b91c1c' }}>
          {above ? `+${Math.round(avgPct - CUTOFF)}% ऊपर ✓` : `${Math.round(gap)}% और चाहिए`}
        </span>
      </div>
      <div className="relative h-3 rounded-full overflow-visible" style={{ background: '#f1f5f9' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, avgPct)}%`, background: above ? '#16a34a' : '#2563eb' }} />
        {/* Cutoff marker */}
        <div className="absolute top-0 h-full w-0.5 rounded-full" style={{ left: `${CUTOFF}%`, background: '#ef4444', transform: 'translateX(-50%)' }} />
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: '#94a3b8' }}>
        <span>0%</span>
        <span style={{ color: '#ef4444', position: 'absolute', left: `calc(${CUTOFF}% )`, transform: 'translateX(-50%)' }}>60%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STAT_META = [
  { key: 'totalTests',     label: 'टेस्ट दिए',      sub: 'कुल प्रयास',      icon: '📋', accent: '#2563eb', bg: '#eff6ff' },
  { key: 'bestScore',      label: 'सर्वश्रेष्ठ',     sub: 'उच्चतम अंक',      icon: '🏆', accent: '#b45309', bg: '#fffbeb' },
  { key: 'avgPercentage',  label: 'औसत प्रतिशत',     sub: 'सभी टेस्ट का',    icon: '📊', accent: '#15803d', bg: '#f0fdf4', suffix: '%' },
  { key: 'totalQuestions', label: 'कुल प्रश्न',      sub: 'हल किए गए',       icon: '✏️', accent: '#6d28d9', bg: '#f5f3ff' },
]

const DIFF_META = {
  EASY:   { label: 'आसान',  color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  MEDIUM: { label: 'मध्यम', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  HARD:   { label: 'कठिन',  color: '#b91c1c', bg: '#fef2f2', border: '#fecaca' },
}

export default function DashboardPage() {
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) { router.push('/auth/login'); return }
      fetch('/api/dashboard').then(r => r.json()).then(d => { setData(d); setLoading(false) })
    })
  }, [router])

  if (loading) return (
    <div className="min-h-screen" style={{ background: '#f1f5f9' }}>
      <Navbar />
      <div className="flex items-center justify-center h-80">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1e40af', borderTopColor: 'transparent' }} />
      </div>
    </div>
  )

  const statVals: Record<string, string | number> = data ? {
    totalTests: data.totalTests,
    bestScore: data.bestScore,
    avgPercentage: data.avgPercentage,
    totalQuestions: data.totalQuestions,
  } : {}

  const hasData = (data?.totalTests ?? 0) > 0

  return (
    <div className="min-h-screen" style={{ background: '#f1f5f9' }}>
      <Navbar />

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)' }} className="px-4 pt-8 pb-16">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#93c5fd' }}>MP Patwari 2026</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">डैशबोर्ड</h1>
            <p className="text-sm" style={{ color: '#bfdbfe' }}>तैयारी की प्रगति और प्रदर्शन विश्लेषण</p>
          </div>
          {/* Streak badge */}
          {(data?.streak ?? 0) > 0 && (
            <div className="flex flex-col items-center px-4 py-3 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <span className="text-2xl">🔥</span>
              <span className="text-xl font-bold text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>{data!.streak}</span>
              <span className="text-xs" style={{ color: '#93c5fd' }}>दिन की streak</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 pb-12">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {STAT_META.map(s => (
            <div key={s.key} className="rounded-2xl p-4"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: s.bg }}>{s.icon}</div>
                <span className="text-2xl font-bold leading-none mt-0.5" style={{ color: s.accent, fontVariantNumeric: 'tabular-nums' }}>
                  {statVals[s.key] ?? '—'}{s.suffix ?? ''}
                </span>
              </div>
              <p className="text-sm font-semibold" style={{ color: '#1e293b' }}>{s.label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Score Trend + Cutoff ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="px-5 pt-4 pb-2 flex items-center justify-between" style={{ borderBottom: '1px solid #f8fafc' }}>
              <div>
                <h2 className="font-bold" style={{ color: '#0f172a' }}>स्कोर ट्रेंड</h2>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>प्रत्येक टेस्ट का प्रतिशत (लाल रेखा = कटऑफ 60%)</p>
              </div>
              {hasData && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={(data?.avgPercentage ?? 0) >= 60
                    ? { color: '#15803d', background: '#f0fdf4' }
                    : { color: '#b91c1c', background: '#fef2f2' }}>
                  औसत {data?.avgPercentage}%
                </span>
              )}
            </div>
            <div className="px-3 py-3">
              <ScoreTrendChart history={data?.scoreHistory ?? []} />
            </div>
          </div>

          <div className="rounded-2xl p-5 flex flex-col justify-between gap-5"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            {/* Cutoff */}
            <div>
              <h2 className="font-bold mb-4" style={{ color: '#0f172a' }}>कटऑफ ट्रैकर</h2>
              <div className="relative">
                <CutoffTracker avgPct={data?.avgPercentage ?? 0} />
              </div>
            </div>

            {/* Quick stats */}
            <div className="space-y-3 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
              {[
                { label: 'प्रयास दर', val: data && data.totalQuestions > 0 ? `${Math.round(data.totalAttempted / data.totalQuestions * 100)}%` : '—', icon: '📝' },
                { label: 'औसत समय/प्रश्न', val: data?.avgTimePerQuestion ? `${data.avgTimePerQuestion}s` : '—', icon: '⚡' },
                { label: 'गलत उत्तर से अंक कटे', val: data?.marksLost ? `-${data.marksLost}` : '0', icon: '⚠️', danger: (data?.marksLost ?? 0) > 5 },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-1.5" style={{ color: '#475569' }}>
                    <span>{s.icon}</span>{s.label}
                  </span>
                  <span className="text-sm font-bold" style={{ color: s.danger ? '#b91c1c' : '#1e293b', fontVariantNumeric: 'tabular-nums' }}>
                    {s.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Activity Heatmap ── */}
        <div className="rounded-2xl p-5 mb-5"
          style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold" style={{ color: '#0f172a' }}>अभ्यास कैलेंडर</h2>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>पिछले 12 हफ्ते की गतिविधि</p>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#94a3b8' }}>
              <div className="w-3 h-3 rounded-sm" style={{ background: '#f1f5f9' }} /><span>0</span>
              <div className="w-3 h-3 rounded-sm" style={{ background: '#bfdbfe' }} /><span>1</span>
              <div className="w-3 h-3 rounded-sm" style={{ background: '#60a5fa' }} /><span>2</span>
              <div className="w-3 h-3 rounded-sm" style={{ background: '#1d4ed8' }} /><span>3+</span>
            </div>
          </div>
          <ActivityHeatmap calendar={data?.activityCalendar ?? []} />
        </div>

        {/* ── Main grid: Recent tests + Subject analysis ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">

          {/* Recent tests */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f8fafc' }}>
              <h2 className="font-bold" style={{ color: '#0f172a' }}>हाल के टेस्ट</h2>
              <Link href="/tests" className="text-xs font-semibold hover:underline" style={{ color: '#2563eb' }}>और टेस्ट दें →</Link>
            </div>
            {!data?.recentAttempts?.length ? (
              <div className="flex flex-col items-center py-14 px-4 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4" style={{ background: '#f1f5f9' }}>📋</div>
                <p className="text-sm font-medium" style={{ color: '#475569' }}>अभी तक कोई टेस्ट नहीं दिया</p>
                <Link href="/tests" className="btn-primary mt-4 text-sm py-2 px-5">टेस्ट दें</Link>
              </div>
            ) : (
              <>
                {data.recentAttempts.map((a, idx) => {
                  const pct = Math.round(a.percentage ?? 0)
                  const barCol = pct >= 60 ? '#16a34a' : pct >= 40 ? '#d97706' : '#dc2626'
                  return (
                    <Link key={a.id} href={`/results/${a.id}`}
                      className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                      style={{ borderBottom: idx < data.recentAttempts.length - 1 ? '1px solid #f8fafc' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: '#f1f5f9', color: '#64748b' }}>{idx + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#1e293b' }}>{a.test.titleHi}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{formatDate(a.submittedAt)}</p>
                        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                          <div className="h-full rounded-full" style={{ width: `${Math.max(2, pct)}%`, background: barCol }} />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold" style={{ color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>
                          {a.score}<span className="font-normal text-xs" style={{ color: '#94a3b8' }}>/{a.test.totalMarks}</span>
                        </p>
                        <div className="mt-1"><ScorePill pct={a.percentage} /></div>
                      </div>
                      <span style={{ color: '#cbd5e1' }}>›</span>
                    </Link>
                  )
                })}
              </>
            )}
          </div>

          {/* Subject analysis */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {data?.subjectStats?.length ? (
              <div className="rounded-2xl overflow-hidden flex-1"
                style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid #f8fafc' }}>
                  <h2 className="font-bold" style={{ color: '#0f172a' }}>विषयवार प्रगति</h2>
                </div>
                <div className="px-5 py-4 space-y-4">
                  {data.subjectStats.map((s, i) => {
                    const tc = s.accuracy >= 60 ? '#15803d' : s.accuracy >= 40 ? '#b45309' : '#b91c1c'
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                            <span className="text-sm font-medium truncate" style={{ color: '#334155' }}>{s.nameHi}</span>
                          </div>
                          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            <span className="text-xs" style={{ color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>{s.correct}/{s.total}</span>
                            <span className="text-xs font-bold" style={{ color: tc, fontVariantNumeric: 'tabular-nums' }}>{s.accuracy}%</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                          <div className="h-full rounded-full" style={{ width: `${s.accuracy}%`, background: s.color, transition: 'width 0.7s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl flex flex-col items-center justify-center py-10 px-4 text-center"
                style={{ background: '#fff', border: '1px solid #e2e8f0' }}>
                <div className="text-3xl mb-3">📚</div>
                <p className="text-sm" style={{ color: '#64748b' }}>टेस्ट देने के बाद विश्लेषण दिखेगा</p>
              </div>
            )}

            {(data?.strongSubjects?.length || data?.weakSubjects?.length) ? (
              <div className="grid grid-cols-2 gap-3">
                {data?.strongSubjects?.length ? (
                  <div className="rounded-2xl p-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <p className="text-xs font-bold mb-3" style={{ color: '#15803d' }}>💪 मजबूत</p>
                    <div className="space-y-2">
                      {data.strongSubjects.map((s, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-xs flex items-center gap-1.5 truncate" style={{ color: '#166534' }}>
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />{s.nameHi}
                          </span>
                          <span className="text-xs font-bold ml-1 flex-shrink-0" style={{ color: '#15803d', fontVariantNumeric: 'tabular-nums' }}>{s.accuracy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <div />}
                {data?.weakSubjects?.length ? (
                  <div className="rounded-2xl p-4" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                    <p className="text-xs font-bold mb-3" style={{ color: '#b91c1c' }}>📚 सुधारें</p>
                    <div className="space-y-2">
                      {data.weakSubjects.map((s, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-xs flex items-center gap-1.5 truncate" style={{ color: '#991b1b' }}>
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />{s.nameHi}
                          </span>
                          <span className="text-xs font-bold ml-1 flex-shrink-0" style={{ color: '#b91c1c', fontVariantNumeric: 'tabular-nums' }}>{s.accuracy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <div />}
              </div>
            ) : null}
          </div>
        </div>

        {/* ── Bottom row: Difficulty + Negative marking + Topic recs ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Difficulty breakdown */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #f8fafc' }}>
              <h2 className="font-bold" style={{ color: '#0f172a' }}>कठिनाई स्तर</h2>
            </div>
            <div className="p-4 space-y-3">
              {(['EASY', 'MEDIUM', 'HARD'] as const).map(d => {
                const m = DIFF_META[d]
                const s = data?.difficultyStats?.[d]
                const acc = s?.accuracy ?? 0
                const total = s?.total ?? 0
                return (
                  <div key={d} className="rounded-xl p-3" style={{ background: m.bg, border: `1px solid ${m.border}` }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold" style={{ color: m.color }}>{m.label}</span>
                      <span className="text-base font-bold" style={{ color: m.color, fontVariantNumeric: 'tabular-nums' }}>{acc}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                      <div className="h-full rounded-full" style={{ width: `${acc}%`, background: m.color }} />
                    </div>
                    <div className="flex justify-between mt-2 text-xs" style={{ color: m.color, opacity: 0.7, fontVariantNumeric: 'tabular-nums' }}>
                      <span>✓{s?.correct ?? 0} ✗{s?.wrong ?? 0} —{s?.skipped ?? 0}</span>
                      <span>{total} प्रश्न</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Negative marking impact */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #f8fafc' }}>
              <h2 className="font-bold" style={{ color: '#0f172a' }}>नेगेटिव मार्किंग</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'गलत उत्तर', val: data?.totalWrong ?? 0, icon: '✗', color: '#b91c1c', bg: '#fef2f2' },
                { label: 'छोड़े गए', val: data?.totalSkipped ?? 0, icon: '—', color: '#64748b', bg: '#f8fafc' },
                { label: 'कटे हुए अंक', val: `−${data?.marksLost ?? 0}`, icon: '📉', color: '#b91c1c', bg: '#fef2f2', warn: (data?.marksLost ?? 0) > 5 },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: s.bg }}>
                  <span className="text-sm" style={{ color: '#475569' }}>{s.label}</span>
                  <span className="text-xl font-bold" style={{ color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.val}</span>
                </div>
              ))}

              {(data?.marksLost ?? 0) > 5 && (
                <div className="rounded-xl p-3 text-xs" style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}>
                  ⚠️ आप अनुमान लगाकर अंक खो रहे हैं। अनिश्चित प्रश्न छोड़ें।
                </div>
              )}

              {(data?.totalSkipped ?? 0) > (data?.totalQuestions ?? 1) * 0.3 && (
                <div className="rounded-xl p-3 text-xs" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' }}>
                  💡 30%+ प्रश्न छोड़े — समय प्रबंधन पर ध्यान दें।
                </div>
              )}
            </div>
          </div>

          {/* Topic recommendations */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #f8fafc' }}>
              <h2 className="font-bold" style={{ color: '#0f172a' }}>आज क्या करें</h2>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>कमजोर टॉपिक — पहले इन्हें सुधारें</p>
            </div>
            <div className="p-4">
              {data?.topicStats?.length ? (
                <div className="space-y-2">
                  {data.topicStats.slice(0, 6).map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl"
                      style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.subjectColor }} />
                          <span className="text-xs font-medium truncate" style={{ color: '#334155' }}>{t.nameHi}</span>
                        </div>
                        <span className="text-xs ml-3" style={{ color: '#94a3b8' }}>{t.subjectNameHi}</span>
                      </div>
                      <span className="text-xs font-bold ml-2 flex-shrink-0"
                        style={{ color: t.accuracy < 40 ? '#b91c1c' : '#b45309', fontVariantNumeric: 'tabular-nums' }}>
                        {t.accuracy}%
                      </span>
                    </div>
                  ))}
                  <Link href="/tests"
                    className="block text-center text-sm font-semibold mt-3 py-2.5 rounded-xl transition-colors"
                    style={{ background: '#eff6ff', color: '#1e40af' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#dbeafe')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#eff6ff')}>
                    अभ्यास टेस्ट दें →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-3xl mb-3">🎯</div>
                  <p className="text-sm" style={{ color: '#64748b' }}>टेस्ट देने के बाद कमजोर टॉपिक दिखेंगे</p>
                  <Link href="/tests" className="btn-primary mt-4 text-sm py-2 px-4 inline-flex">टेस्ट दें</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
