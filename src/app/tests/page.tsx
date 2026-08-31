'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Subject { id: string; name: string; nameHi: string; color: string; code: string; order: number }
interface Test {
  id: string; title: string; titleHi: string; description: string | null
  type: string; totalQuestions: number; totalMarks: number; duration: number
  negativeMarks: number; order: number; subjectId: string | null
  _count: { attempts: number }
}

function ScoreBadge({ pct, score, total }: { pct: number; score: number; total: number }) {
  const s = pct >= 60
    ? { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' }
    : pct >= 40
    ? { bg: '#fffbeb', text: '#b45309', border: '#fde68a' }
    : { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}`, fontVariantNumeric: 'tabular-nums' }}>
      ✓ {pct}% ({score}/{total})
    </span>
  )
}

const TYPE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  FULL:            { label: 'फुल मॉक टेस्ट',     color: '#1e40af', bg: '#dbeafe', icon: '📋' },
  SUBJECT:         { label: 'विषयवार टेस्ट',      color: '#6d28d9', bg: '#f3e8ff', icon: '📚' },
  TOPIC:           { label: 'टॉपिक टेस्ट',        color: '#065f46', bg: '#d1fae5', icon: '🎯' },
  PREVIOUS_YEAR:   { label: 'पिछले वर्ष पैटर्न',   color: '#92400e', bg: '#fef3c7', icon: '📅' },
  CURRENT_AFFAIRS: { label: 'करंट अफेयर्स',       color: '#991b1b', bg: '#fee2e2', icon: '📰' },
  PRACTICE:        { label: 'अभ्यास टेस्ट',        color: '#0e7490', bg: '#cffafe', icon: '🔄' },
}

const SUBJECT_ICONS: Record<string, string> = {
  MATH: '📐', HIN: '📝', GK: '🌍', COMP: '💻', REASON: '🧠', MGMT: '🏛️', ENG: '🔤', SCI: '🔬',
}

const FILTER_LABELS: Record<string, string> = {
  ALL: 'सभी', FULL: 'फुल मॉक', SUBJECT: 'विषयवार', PREVIOUS_YEAR: 'पिछले वर्ष', CURRENT_AFFAIRS: 'करंट अफेयर्स', PRACTICE: 'अभ्यास',
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [userAttempts, setUserAttempts] = useState<Record<string, { completed: boolean; lastId: string; percentage: number; score: number; totalMarks: number }>>({})
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/tests').then(r => r.json()),
      fetch('/api/subjects').then(r => r.json()),
    ]).then(([td, sd]) => {
      setTests(td.tests || [])
      setSubjects(sd.subjects || [])
      setUserAttempts(td.userAttempts || {})
      setLoading(false)
    })
  }, [])

  const filters = ['ALL', 'FULL', 'SUBJECT', 'PREVIOUS_YEAR', 'CURRENT_AFFAIRS', 'PRACTICE']
  const filtered = filter === 'ALL' ? tests : tests.filter(t => t.type === filter)
  const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s]))

  // Group SUBJECT tests by subject
  const subjectGroups: { subject: Subject; tests: Test[] }[] = []
  if (filter === 'SUBJECT') {
    const map = new Map<string, { subject: Subject; tests: Test[] }>()
    filtered.forEach(t => {
      const key = t.subjectId ?? 'other'
      const sub = subjectMap[key] ?? { id: 'other', name: 'Other', nameHi: 'अन्य', color: '#64748b', code: 'OTHER', order: 99 }
      if (!map.has(key)) map.set(key, { subject: sub, tests: [] })
      map.get(key)!.tests.push(t)
    })
    map.forEach(v => subjectGroups.push(v))
    subjectGroups.sort((a, b) => (a.subject.order ?? 99) - (b.subject.order ?? 99))
  }

  // Counts per type for filter badges
  const typeCounts: Record<string, number> = { ALL: tests.length }
  tests.forEach(t => { typeCounts[t.type] = (typeCounts[t.type] ?? 0) + 1 })

  const attemptedCount = Object.keys(userAttempts).filter(id => userAttempts[id]?.completed).length

  return (
    <div className="min-h-screen" style={{ background: '#f4f6fb' }}>
      <Navbar />

      {/* ── Page header ───────────────────────────────── */}
      <div className="text-white px-4 pt-10 pb-16"
        style={{ background: 'linear-gradient(135deg, #0c1a4e 0%, #1e3a8a 60%, #2563eb 100%)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#93c5fd' }}>MP Patwari 2026</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">मॉक टेस्ट सीरीज</h1>
            <p className="text-sm mt-1" style={{ color: '#bfdbfe' }}>परीक्षा पैटर्न पर आधारित {tests.length}+ टेस्ट उपलब्ध</p>
          </div>
          {attemptedCount > 0 && (
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div className="text-2xl font-bold text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>{attemptedCount}</div>
              <div className="text-xs" style={{ color: '#93c5fd' }}>टेस्ट<br />पूर्ण किए</div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6 pb-12">

        {/* ── Filter pills ───────────────────────────── */}
        <div className="bg-white rounded-2xl p-1.5 mb-6 flex flex-wrap gap-1"
          style={{ boxShadow: '0 4px 20px rgba(15,23,42,0.1)', border: '1px solid #e4e9f2' }}>
          {filters.map(f => {
            const active = filter === f
            const meta = TYPE_META[f]
            return (
              <button key={f} onClick={() => setFilter(f)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: active ? (meta?.bg ?? '#eff6ff') : 'transparent',
                  color: active ? (meta?.color ?? '#1e40af') : '#64748b',
                  border: active ? `1.5px solid ${meta?.color ?? '#1e40af'}20` : '1.5px solid transparent',
                }}>
                {meta?.icon && <span>{meta.icon}</span>}
                {FILTER_LABELS[f] ?? f}
                <span className="text-xs font-normal opacity-60" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {typeCounts[f] ?? 0}
                </span>
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1e40af', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: '#94a3b8' }}>टेस्ट लोड हो रहे हैं...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl flex flex-col items-center py-20 px-4 text-center"
            style={{ border: '1px solid #e4e9f2' }}>
            <div className="text-5xl mb-4">📋</div>
            <div className="font-bold text-lg mb-1" style={{ color: '#1e293b' }}>कोई टेस्ट नहीं मिला</div>
            <p className="text-sm" style={{ color: '#94a3b8' }}>जल्द ही नए टेस्ट जोड़े जाएंगे</p>
          </div>
        ) : filter === 'SUBJECT' ? (
          <div className="space-y-10">
            {subjectGroups.map(({ subject, tests: grpTests }) => (
              <div key={subject.code}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl text-white flex-shrink-0 font-bold"
                    style={{ background: subject.color }}>
                    {SUBJECT_ICONS[subject.code] ?? '📚'}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg" style={{ color: '#0f172a' }}>{subject.nameHi}</h2>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>{grpTests.length} पेपर उपलब्ध</p>
                  </div>
                  <div className="flex-1 h-px ml-2" style={{ background: subject.color + '40' }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grpTests.map((test, idx) => {
                    const attempt = userAttempts[test.id]
                    return <TestCard key={test.id} test={test} attempt={attempt} subjectColor={subject.color} idx={idx} />
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(test => {
              const meta = TYPE_META[test.type] ?? { label: test.type, color: '#64748b', bg: '#f1f5f9', icon: '📋' }
              const attempt = userAttempts[test.id]
              return <TestCard key={test.id} test={test} attempt={attempt} meta={meta} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function TestCard({
  test, attempt, subjectColor, meta, idx,
}: {
  test: Test
  attempt?: { completed: boolean; lastId: string; percentage: number; score: number; totalMarks: number }
  subjectColor?: string
  meta?: { label: string; color: string; bg: string; icon: string }
  idx?: number
}) {
  const accentColor = subjectColor ?? meta?.color ?? '#1e40af'
  const done = !!attempt?.completed

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all"
      style={{
        border: '1px solid #e4e9f2',
        boxShadow: '0 2px 10px rgba(15,23,42,0.06)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 10px 32px rgba(15,23,42,0.12)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.boxShadow = '0 2px 10px rgba(15,23,42,0.06)'
        el.style.transform = 'translateY(0)'
      }}>

      {/* Colored top stripe */}
      <div className="h-1" style={{ background: accentColor }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Type badge + attempt score */}
        <div className="flex items-center justify-between mb-3">
          {meta ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: meta.bg, color: meta.color }}>
              {meta.icon} {meta.label}
            </span>
          ) : idx !== undefined ? (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: accentColor + '18', color: accentColor }}>
              पेपर {idx + 1}
            </span>
          ) : null}
          {attempt?.completed
            ? <ScoreBadge pct={attempt.percentage} score={attempt.score} total={attempt.totalMarks} />
            : attempt
            ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: '#fefce8', color: '#a16207', border: '1px solid #fde68a' }}>
                ⏳ जारी है...
              </span>
            : null
          }
        </div>

        {/* Title */}
        <h3 className="font-bold text-base leading-snug mb-3" style={{ color: '#0f172a' }}>{test.titleHi}</h3>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4 rounded-xl p-3" style={{ background: '#f8faff' }}>
          {[
            { val: test.totalQuestions, label: 'प्रश्न' },
            { val: test.totalMarks,     label: 'अंक' },
            { val: test.duration,       label: 'मिनट' },
          ].map((s, i) => (
            <div key={i} className="text-center" style={{ borderRight: i < 2 ? '1px solid #e4e9f2' : 'none' }}>
              <div className="font-bold text-base" style={{ color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Attempt progress bar (if done) */}
        {done && (
          <div className="mb-3">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${attempt!.percentage}%`,
                  background: attempt!.percentage >= 60 ? '#16a34a' : attempt!.percentage >= 40 ? '#f59e0b' : '#dc2626',
                }} />
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <Link href={`/test/${test.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: accentColor, boxShadow: `0 4px 12px ${accentColor}40` }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
            {done ? '🔄 फिर दें' : attempt ? '▶ जारी रखें' : '▶ शुरू करें'}
          </Link>
          {attempt?.completed && (
            <Link href={`/results/${attempt.lastId}`}
              className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: '#f8faff', color: '#475569', border: '1.5px solid #e4e9f2' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#1e40af' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8faff'; e.currentTarget.style.color = '#475569' }}>
              📊
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
