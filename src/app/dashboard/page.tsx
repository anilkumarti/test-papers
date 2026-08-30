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
    <div className="min-h-screen"><Navbar />
      <div className="flex items-center justify-center h-80"><div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">डैशबोर्ड</h1>
          <p className="text-slate-500 text-sm mt-1">आपका प्रदर्शन और प्रगति</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'टेस्ट दिए', value: data?.totalTests ?? 0, icon: '📋', color: 'bg-blue-50 text-blue-800 border-blue-200' },
            { label: 'सर्वश्रेष्ठ अंक', value: `${data?.bestScore ?? 0}`, icon: '🏆', color: 'bg-amber-50 text-amber-800 border-amber-200' },
            { label: 'औसत प्रतिशत', value: `${data?.avgPercentage ?? 0}%`, icon: '📊', color: 'bg-green-50 text-green-800 border-green-200' },
            { label: 'कुल प्रश्न', value: data?.totalQuestions ?? 0, icon: '✏️', color: 'bg-purple-50 text-purple-800 border-purple-200' },
          ].map((s, i) => (
            <div key={i} className={`card border ${s.color} flex flex-col items-center text-center p-4`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold mb-0.5">{s.value}</div>
              <div className="text-xs font-medium opacity-80">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tests */}
          <div className="lg:col-span-2 card">
            <h2 className="font-bold text-slate-800 mb-4">हाल के टेस्ट</h2>
            {!data?.recentAttempts?.length ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">📋</div>
                <div className="text-slate-500 text-sm">अभी तक कोई टेस्ट नहीं दिया</div>
                <Link href="/tests" className="btn-primary mt-4 text-sm py-2 px-5 inline-flex">टेस्ट दें</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentAttempts.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-800 text-sm truncate">{a.test.titleHi}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{formatDate(a.submittedAt)}</div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right">
                        <div className="font-bold text-slate-800 text-sm">{a.score}/{a.test.totalMarks}</div>
                        <div className={`text-xs font-semibold ${Math.round(a.percentage) >= 60 ? 'text-green-600' : Math.round(a.percentage) >= 40 ? 'text-amber-600' : 'text-red-600'}`}>{Math.round(a.percentage)}%</div>
                      </div>
                      <Link href={`/results/${a.id}`} className="text-blue-600 text-xs font-semibold hover:underline whitespace-nowrap">देखें →</Link>
                    </div>
                  </div>
                ))}
                <Link href="/tests" className="block text-center text-blue-600 text-sm font-medium mt-4 hover:underline">और टेस्ट दें →</Link>
              </div>
            )}
          </div>

          {/* Subject Analysis */}
          <div className="space-y-4">
            {data?.strongSubjects?.length ? (
              <div className="card border-green-200 bg-green-50">
                <h3 className="font-bold text-green-800 mb-3 text-sm">💪 मजबूत विषय</h3>
                <div className="space-y-2">
                  {data.strongSubjects.map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }}></div>
                        <span className="text-sm text-green-900">{s.nameHi}</span>
                      </div>
                      <span className="text-green-700 font-bold text-sm">{s.accuracy}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {data?.weakSubjects?.length ? (
              <div className="card border-red-200 bg-red-50">
                <h3 className="font-bold text-red-800 mb-3 text-sm">📚 सुधार की जरूरत</h3>
                <div className="space-y-2">
                  {data.weakSubjects.map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }}></div>
                        <span className="text-sm text-red-900">{s.nameHi}</span>
                      </div>
                      <span className="text-red-700 font-bold text-sm">{s.accuracy}%</span>
                    </div>
                  ))}
                </div>
                <Link href="/tests" className="block text-center text-red-600 text-xs font-semibold mt-3 hover:underline">अभ्यास करें →</Link>
              </div>
            ) : null}

            {data?.subjectStats?.length ? (
              <div className="card">
                <h3 className="font-bold text-slate-800 mb-3 text-sm">विषयवार प्रगति</h3>
                <div className="space-y-3">
                  {data.subjectStats.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: s.color }}></div>
                          {s.nameHi}
                        </span>
                        <span className="font-semibold text-slate-700">{s.accuracy}%</span>
                      </div>
                      <div className="bg-slate-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${s.accuracy}%`, background: s.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card text-center text-sm text-slate-500 py-6">
                टेस्ट देने के बाद यहाँ विश्लेषण दिखेगा
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
