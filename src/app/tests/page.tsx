'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Test {
  id: string; title: string; titleHi: string; description: string | null;
  type: string; totalQuestions: number; totalMarks: number; duration: number;
  negativeMarks: number; order: number; _count: { attempts: number }
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
  const [userAttempts, setUserAttempts] = useState<Record<string, boolean>>({})
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tests').then(r => r.json()).then(d => {
      setTests(d.tests || [])
      setUserAttempts(d.userAttempts || {})
      setLoading(false)
    })
  }, [])

  const filters = ['ALL', 'FULL', 'SUBJECT', 'PREVIOUS_YEAR', 'CURRENT_AFFAIRS', 'PRACTICE']
  const filtered = filter === 'ALL' ? tests : tests.filter(t => t.type === filter)

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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(test => {
              const tl = typeLabels[test.type] || { label: test.type, color: 'bg-slate-100 text-slate-700' }
              const attempted = userAttempts[test.id]
              return (
                <div key={test.id} className="card hover:shadow-md transition-all flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`badge text-xs ${tl.color}`}>{tl.label}</span>
                    {attempted && <span className="badge bg-green-100 text-green-700 text-xs">✓ दिया</span>}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1 leading-snug">{test.titleHi}</h3>
                  {test.description && <p className="text-slate-500 text-sm mb-4 flex-1">{test.description}</p>}
                  <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
                    <div className="text-center"><div className="font-bold text-slate-800 text-base">{test.totalQuestions}</div><div>प्रश्न</div></div>
                    <div className="text-center border-x border-slate-200"><div className="font-bold text-slate-800 text-base">{test.totalMarks}</div><div>अंक</div></div>
                    <div className="text-center"><div className="font-bold text-slate-800 text-base">{test.duration}</div><div>मिनट</div></div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Link href={`/test/${test.id}`} className="btn-primary flex-1 justify-center text-sm py-2">
                      {attempted ? 'फिर दें' : 'शुरू करें'}
                    </Link>
                    {attempted && (
                      <Link href={`/tests/${test.id}/history`} className="btn-secondary text-sm py-2 px-3">इतिहास</Link>
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
