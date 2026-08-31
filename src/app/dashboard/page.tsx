'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { formatDate } from '@/lib/utils'

interface DashData {
  totalTests: number; bestScore: number; avgScore: number; avgPercentage: number; totalQuestions: number
  recentAttempts: { id: string; test: { titleHi: string; totalMarks: number }; score: number; percentage: number; submittedAt: string; timeTaken: number }[]
  subjectStats: { name: string; nameHi: string; color: string; correct: number; total: number; accuracy: number }[]
  strongSubjects: { nameHi: string; color: string; accuracy: number }[]
  weakSubjects: { nameHi: string; color: string; accuracy: number }[]
}

function ScorePill({ pct }: { pct: number }) {
  const p = Math.round(pct)
  const style = p >= 60
    ? { color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0' }
    : p >= 40
    ? { color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a' }
    : { color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }
  return (
    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ ...style, fontVariantNumeric: 'tabular-nums' }}>
      {p}%
    </span>
  )
}

const STAT_META = [
  { key: 'totalTests',     label: 'टेस्ट दिए',        sub: 'कुल प्रयास',       icon: '📋', accent: '#2563eb', bg: '#eff6ff' },
  { key: 'bestScore',      label: 'सर्वश्रेष्ठ अंक',   sub: 'उच्चतम स्कोर',     icon: '🏆', accent: '#b45309', bg: '#fffbeb' },
  { key: 'avgPercentage',  label: 'औसत प्रतिशत',       sub: 'सभी टेस्ट का',     icon: '📊', accent: '#15803d', bg: '#f0fdf4' },
  { key: 'totalQuestions', label: 'कुल प्रश्न',        sub: 'हल किए गए',       icon: '✏️', accent: '#6d28d9', bg: '#f5f3ff' },
]

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
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="flex items-center justify-center h-80">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}></div>
      </div>
    </div>
  )

  const statValues: Record<string, string | number> = data
    ? {
        totalTests: data.totalTests,
        bestScore: data.bestScore,
        avgPercentage: `${data.avgPercentage}%`,
        totalQuestions: data.totalQuestions,
      }
    : {}

  return (
    <div className="min-h-screen" style={{ background: '#f1f5f9' }}>
      <Navbar />

      {/* ── Gradient header banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #2563eb 100%)' }}
        className="px-4 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ color: '#93c5fd', letterSpacing: '0.12em' }}>
            MP Patwari 2026
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">डैशबोर्ड</h1>
          <p className="text-sm" style={{ color: '#bfdbfe' }}>आपकी तैयारी की प्रगति और प्रदर्शन विश्लेषण</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 pb-12">

        {/* ── Floating stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
          {STAT_META.map(s => (
            <div key={s.key}
              className="rounded-2xl p-4"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <span className="text-2xl font-bold leading-none mt-0.5"
                  style={{ color: s.accent, fontVariantNumeric: 'tabular-nums' }}>
                  {statValues[s.key] ?? '—'}
                </span>
              </div>
              <p className="text-sm font-semibold" style={{ color: '#1e293b' }}>{s.label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Recent tests — left 3/5 */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>

            <div className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid #f1f5f9' }}>
              <h2 className="font-bold text-base" style={{ color: '#0f172a' }}>हाल के टेस्ट</h2>
              <Link href="/tests"
                className="text-xs font-semibold hover:underline"
                style={{ color: '#2563eb' }}>
                और टेस्ट दें →
              </Link>
            </div>

            {!data?.recentAttempts?.length ? (
              <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4"
                  style={{ background: '#f1f5f9' }}>📋</div>
                <p className="text-sm font-medium" style={{ color: '#475569' }}>अभी तक कोई टेस्ट नहीं दिया</p>
                <p className="text-xs mt-1 mb-5" style={{ color: '#94a3b8' }}>पहला टेस्ट देकर अपनी तैयारी शुरू करें</p>
                <Link href="/tests" className="btn-primary text-sm py-2 px-5">टेस्ट दें</Link>
              </div>
            ) : (
              <div>
                {data.recentAttempts.map((a, idx) => {
                  const pct = Math.round(a.percentage ?? 0)
                  const barCol = pct >= 60 ? '#16a34a' : pct >= 40 ? '#d97706' : '#dc2626'
                  return (
                    <Link key={a.id} href={`/results/${a.id}`}
                      className="flex items-center gap-4 px-5 py-3.5 group transition-colors"
                      style={{ borderBottom: idx < (data.recentAttempts.length - 1) ? '1px solid #f8fafc' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                      {/* Index badge */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: '#f1f5f9', color: '#64748b' }}>
                        {idx + 1}
                      </div>

                      {/* Info + mini bar */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#1e293b' }}>
                          {a.test.titleHi}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                          {formatDate(a.submittedAt)}
                        </p>
                        <div className="mt-2 h-1.5 w-full rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                          <div className="h-full rounded-full"
                            style={{ width: `${Math.max(2, pct)}%`, background: barCol, transition: 'width 0.6s ease' }}>
                          </div>
                        </div>
                      </div>

                      {/* Score + pill */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold" style={{ color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>
                          {a.score}
                          <span className="font-normal text-xs" style={{ color: '#94a3b8' }}>/{a.test.totalMarks}</span>
                        </p>
                        <div className="mt-1">
                          <ScorePill pct={a.percentage} />
                        </div>
                      </div>

                      <span className="text-sm transition-colors" style={{ color: '#cbd5e1' }}>›</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right column — 2/5 */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Subject progress */}
            {data?.subjectStats?.length ? (
              <div className="rounded-2xl overflow-hidden flex-1"
                style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <h2 className="font-bold text-base" style={{ color: '#0f172a' }}>विषयवार प्रगति</h2>
                </div>
                <div className="px-5 py-4 space-y-4">
                  {data.subjectStats.map((s, i) => {
                    const textCol = s.accuracy >= 60 ? '#15803d' : s.accuracy >= 40 ? '#b45309' : '#b91c1c'
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ background: s.color }}></div>
                            <span className="text-sm font-medium truncate" style={{ color: '#334155' }}>
                              {s.nameHi}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span className="text-xs" style={{ color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                              {s.correct}/{s.total}
                            </span>
                            <span className="text-xs font-bold" style={{ color: textCol, fontVariantNumeric: 'tabular-nums' }}>
                              {s.accuracy}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                          <div className="h-full rounded-full"
                            style={{
                              width: `${s.accuracy}%`,
                              background: s.color,
                              transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
                            }}>
                          </div>
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
                <p className="text-sm" style={{ color: '#64748b' }}>टेस्ट देने के बाद यहाँ विश्लेषण दिखेगा</p>
                <Link href="/tests" className="btn-primary mt-4 text-sm py-2 px-4">टेस्ट दें</Link>
              </div>
            )}

            {/* Strong + Weak panels */}
            {(data?.strongSubjects?.length || data?.weakSubjects?.length) ? (
              <div className="grid grid-cols-2 gap-3">
                {data?.strongSubjects?.length ? (
                  <div className="rounded-2xl p-4"
                    style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <p className="text-xs font-bold mb-3 flex items-center gap-1" style={{ color: '#15803d' }}>
                      💪 मजबूत
                    </p>
                    <div className="space-y-2.5">
                      {data.strongSubjects.map((s, i) => (
                        <div key={i} className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }}></div>
                            <span className="text-xs truncate" style={{ color: '#166534' }}>{s.nameHi}</span>
                          </div>
                          <span className="text-xs font-bold flex-shrink-0"
                            style={{ color: '#15803d', fontVariantNumeric: 'tabular-nums' }}>
                            {s.accuracy}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : <div />}

                {data?.weakSubjects?.length ? (
                  <div className="rounded-2xl p-4"
                    style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                    <p className="text-xs font-bold mb-3 flex items-center gap-1" style={{ color: '#b91c1c' }}>
                      📚 सुधारें
                    </p>
                    <div className="space-y-2.5">
                      {data.weakSubjects.map((s, i) => (
                        <div key={i} className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }}></div>
                            <span className="text-xs truncate" style={{ color: '#991b1b' }}>{s.nameHi}</span>
                          </div>
                          <span className="text-xs font-bold flex-shrink-0"
                            style={{ color: '#b91c1c', fontVariantNumeric: 'tabular-nums' }}>
                            {s.accuracy}%
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link href="/tests"
                      className="block text-center text-xs font-semibold mt-3 hover:underline"
                      style={{ color: '#b91c1c' }}>
                      अभ्यास करें →
                    </Link>
                  </div>
                ) : <div />}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
