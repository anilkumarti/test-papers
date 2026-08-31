'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Subject { id: string; name: string; nameHi: string; color: string; code: string; order: number }
interface Test {
  id: string; title: string; titleHi: string; description: string | null;
  type: string; totalQuestions: number; totalMarks: number; duration: number;
  negativeMarks: number; order: number; subjectId: string | null;
  _count: { attempts: number }
}

const typeLabels: Record<string, { label: string; color: string }> = {
  FULL: { label: 'फुल मॉक टेस्ट', color: 'bg-blue-100 text-blue-800' },
  SUBJECT: { label: 'विषयवार टेस्ट', color: 'bg-purple-100 text-purple-800' },
  TOPIC: { label: 'टॉपिक टेस्ट', color: 'bg-green-100 text-green-800' },
  PREVIOUS_YEAR: { label: 'पिछले वर्ष पैटर्न', color: 'bg-amber-100 text-amber-800' },
  CURRENT_AFFAIRS: { label: 'करंट अफेयर्स', color: 'bg-red-100 text-red-800' },
  PRACTICE: { label: 'अभ्यास टेस्ट', color: 'bg-teal-100 text-teal-800' },
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [userAttempts, setUserAttempts] = useState<Record<string, { completed: boolean; lastId: string }>>({})
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

  // Build subject lookup map
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

  const SUBJECT_ICONS: Record<string, string> = {
    MATH: '📐', HIN: '📝', GK: '🌍', COMP: '💻', REASON: '🧠', RURAL: '🏡', ENG: '🔤',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">मॉक टेस्ट सीरीज</h1>
          <p className="text-slate-500">MP Patwari 2026 की तैयारी के लिए उपलब्ध टेस्ट</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${filter === f ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300'}`}>
              {f === 'ALL' ? 'सभी' : typeLabels[f]?.label || f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">टेस्ट लोड हो रहे हैं...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <div className="text-5xl mb-4">📋</div>
            <div className="font-semibold text-slate-700 mb-2">कोई टेस्ट नहीं मिला</div>
            <p className="text-sm">जल्द ही नए टेस्ट जोड़े जाएंगे</p>
          </div>
        ) : filter === 'SUBJECT' ? (
          <div className="space-y-10">
            {subjectGroups.map(({ subject, tests: grpTests }) => (
              <div key={subject.code}>
                {/* Subject heading */}
                <div className="flex items-center gap-3 mb-4 pb-2 border-b-2" style={{ borderColor: subject.color }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                    style={{ background: subject.color }}>
                    {SUBJECT_ICONS[subject.code] ?? '📚'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{subject.nameHi}</h2>
                    <p className="text-xs text-slate-500">{grpTests.length} पेपर उपलब्ध</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {grpTests.map((test, idx) => {
                    const attempt = userAttempts[test.id]
                    return (
                      <div key={test.id} className="card hover:shadow-md transition-all flex flex-col"
                        style={{ borderLeft: `4px solid ${subject.color}` }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: subject.color + '20', color: subject.color }}>
                            पेपर {idx + 1}
                          </span>
                          {attempt && <span className="badge bg-green-100 text-green-700 text-xs">✓ दिया</span>}
                        </div>
                        <h3 className="font-bold text-slate-800 text-base mb-1 leading-snug">{test.titleHi}</h3>
                        <div className="grid grid-cols-3 gap-2 mb-4 mt-2 bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                          <div className="text-center"><div className="font-bold text-slate-800 text-base">{test.totalQuestions}</div><div>प्रश्न</div></div>
                          <div className="text-center border-x border-slate-200"><div className="font-bold text-slate-800 text-base">{test.totalMarks}</div><div>अंक</div></div>
                          <div className="text-center"><div className="font-bold text-slate-800 text-base">{test.duration}</div><div>मिनट</div></div>
                        </div>
                        <div className="flex gap-2 mt-auto">
                          <Link href={`/test/${test.id}`} className="btn-primary flex-1 justify-center text-sm py-2"
                            style={{ background: subject.color }}>
                            {attempt ? 'फिर दें' : 'शुरू करें'}
                          </Link>
                          {attempt && (
                            <Link href={`/results/${attempt.lastId}`}
                              className="btn-secondary text-sm py-2 px-3"
                              title="परिणाम देखें">📊</Link>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(test => {
              const tl = typeLabels[test.type] || { label: test.type, color: 'bg-slate-100 text-slate-700' }
              const attempt = userAttempts[test.id]
              return (
                <div key={test.id} className="card hover:shadow-md transition-all flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`badge text-xs ${tl.color}`}>{tl.label}</span>
                    {attempt && <span className="badge bg-green-100 text-green-700 text-xs">✓ दिया</span>}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1 leading-snug">{test.titleHi}</h3>
                  {test.description && <p className="text-slate-500 text-sm mb-4 flex-1">{test.description}</p>}
                  <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                    <div className="text-center"><div className="font-bold text-slate-800 text-base">{test.totalQuestions}</div><div>प्रश्न</div></div>
                    <div className="text-center border-x border-slate-200"><div className="font-bold text-slate-800 text-base">{test.totalMarks}</div><div>अंक</div></div>
                    <div className="text-center"><div className="font-bold text-slate-800 text-base">{test.duration}</div><div>मिनट</div></div>
                  </div>
                  <div className="flex gap-2 mt-auto flex-wrap">
                    <Link href={`/test/${test.id}`} className="btn-primary flex-1 justify-center text-sm py-2">
                      {attempt ? 'फिर दें' : 'शुरू करें'}
                    </Link>
                    {attempt && (
                      <Link href={`/results/${attempt.lastId}`}
                        className="btn-secondary text-sm py-2 px-3 flex items-center gap-1"
                        title="अंतिम प्रयास का परिणाम देखें">
                        📊 परिणाम
                      </Link>
                    )}
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
