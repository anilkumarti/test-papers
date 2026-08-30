'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Test { id: string; title: string; titleHi: string; type: string; totalQuestions: number; duration: number; isPublished: boolean; _count: { questions: number; attempts: number } }
interface Question { id: string; textHi: string; difficulty: string; subject: { nameHi: string; color: string }; topic: { nameHi: string }; isActive: boolean; needsReview: boolean }
interface Subject { id: string; name: string; nameHi: string; topics: { id: string; name: string; nameHi: string }[]; _count: { questions: number } }

const typeLabels: Record<string, string> = { FULL: 'फुल', SUBJECT: 'विषय', PREVIOUS_YEAR: 'पिछले वर्ष', CURRENT_AFFAIRS: 'करंट', PRACTICE: 'अभ्यास', TOPIC: 'टॉपिक' }

export default function AdminPage() {
  const [tab, setTab] = useState<'tests' | 'questions' | 'addtest' | 'addq'>('tests')
  const [tests, setTests] = useState<Test[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [qPage, setQPage] = useState(1)
  const [qTotal, setQTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const [newTest, setNewTest] = useState({ title: '', titleHi: '', description: '', type: 'FULL', totalQuestions: 100, totalMarks: 100, duration: 120, negativeMarks: 0, isPublished: false })
  const [newQ, setNewQ] = useState({ textHi: '', textEn: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: 'A', explanation: '', explanHi: '', subjectId: '', topicId: '', difficulty: 'MEDIUM', source: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user || d.user.role !== 'ADMIN') { router.push('/'); return }
      loadData()
    })
  }, [router])

  const loadData = () => {
    Promise.all([
      fetch('/api/admin/tests').then(r => r.json()),
      fetch('/api/subjects').then(r => r.json()),
    ]).then(([td, sd]) => {
      setTests(td.tests || [])
      setSubjects(sd.subjects || [])
      setLoading(false)
    })
  }

  const loadQs = (page = 1) => {
    fetch(`/api/admin/questions?page=${page}`).then(r => r.json()).then(d => {
      setQuestions(d.questions || [])
      setQTotal(d.total || 0)
      setQPage(page)
    })
  }

  useEffect(() => { if (tab === 'questions') loadQs() }, [tab])

  const togglePublish = async (id: string, cur: boolean) => {
    await fetch(`/api/admin/tests/${id}/publish`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publish: !cur }) })
    loadData()
  }

  const deleteTest = async (id: string) => {
    if (!confirm('इस टेस्ट को हटाएं?')) return
    await fetch(`/api/admin/tests/${id}`, { method: 'DELETE' })
    loadData()
  }

  const deleteQ = async (id: string) => {
    if (!confirm('इस प्रश्न को हटाएं?')) return
    await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' })
    loadQs(qPage)
  }

  const generateTestQs = async (testId: string) => {
    const test = tests.find(t => t.id === testId)
    if (!test) return
    const perSubject = Math.floor(test.totalQuestions / subjects.length)
    const dist = subjects.map(s => ({ subjectId: s.id, count: perSubject }))
    const r = await fetch(`/api/admin/tests/${testId}/questions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectDistribution: dist })
    })
    const d = await r.json()
    setMsg(`✓ ${d.total} प्रश्न जोड़े गए`)
    setTimeout(() => setMsg(''), 3000)
    loadData()
  }

  const saveTest = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const r = await fetch('/api/admin/tests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTest) })
    setSaving(false)
    if (r.ok) { setMsg('✓ टेस्ट बनाया गया'); setTab('tests'); loadData() }
  }

  const saveQ = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const r = await fetch('/api/admin/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newQ) })
    setSaving(false)
    if (r.ok) { setMsg('✓ प्रश्न जोड़ा गया'); setNewQ({ textHi: '', textEn: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: 'A', explanation: '', explanHi: '', subjectId: newQ.subjectId, topicId: '', difficulty: 'MEDIUM', source: '' }) }
  }

  const selSubject = subjects.find(s => s.id === newQ.subjectId)

  if (loading) return <div className="min-h-screen"><Navbar /><div className="flex items-center justify-center h-80"><div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div></div></div>

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
            <p className="text-slate-500 text-sm">MP Patwari Mock Test — प्रबंधन</p>
          </div>
          {msg && <div className="bg-green-100 text-green-800 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium">{msg}</div>}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {(['tests', 'questions', 'addtest', 'addq'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${tab === t ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300'}`}>
              {t === 'tests' ? '📋 टेस्ट' : t === 'questions' ? `❓ प्रश्न (${qTotal})` : t === 'addtest' ? '+ नया टेस्ट' : '+ नया प्रश्न'}
            </button>
          ))}
        </div>

        {tab === 'tests' && (
          <div className="space-y-3">
            {tests.map(test => (
              <div key={test.id} className="card flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm">{test.titleHi}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{typeLabels[test.type]} | {test.totalQuestions} प्रश्न | {test.duration} मिनट | {test._count.questions} linked | {test._count.attempts} attempts</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`badge text-xs ${test.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{test.isPublished ? 'प्रकाशित' : 'ड्राफ्ट'}</span>
                  <button onClick={() => generateTestQs(test.id)} className="text-xs px-3 py-1.5 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50">⚙️ प्रश्न जनरेट</button>
                  <button onClick={() => togglePublish(test.id, test.isPublished)} className={`text-xs px-3 py-1.5 rounded-lg border ${test.isPublished ? 'border-amber-300 text-amber-700 hover:bg-amber-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}>
                    {test.isPublished ? 'अनप्रकाशित' : 'प्रकाशित करें'}
                  </button>
                  <button onClick={() => deleteTest(test.id)} className="text-xs px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">हटाएं</button>
                </div>
              </div>
            ))}
            {!tests.length && <div className="card text-center text-slate-500 py-10">कोई टेस्ट नहीं</div>}
          </div>
        )}

        {tab === 'questions' && (
          <div>
            <div className="space-y-3 mb-4">
              {questions.map(q => (
                <div key={q.id} className="card flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-800 line-clamp-2">{q.textHi}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="badge text-xs text-white" style={{ background: q.subject.color }}>{q.subject.nameHi}</span>
                      <span className="text-xs text-slate-400">{q.topic.nameHi}</span>
                      <span className="text-xs text-slate-400">{q.difficulty}</span>
                      {q.needsReview && <span className="badge bg-amber-100 text-amber-700 text-xs">समीक्षा</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteQ(q.id)} className="text-xs px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex-shrink-0">हटाएं</button>
                </div>
              ))}
              {!questions.length && <div className="card text-center text-slate-500 py-10">कोई प्रश्न नहीं</div>}
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => loadQs(qPage - 1)} disabled={qPage === 1} className="btn-secondary py-1.5 px-4 text-sm disabled:opacity-40">← पिछला</button>
              <span className="py-1.5 px-3 text-sm text-slate-600">पृष्ठ {qPage}</span>
              <button onClick={() => loadQs(qPage + 1)} disabled={questions.length < 20} className="btn-secondary py-1.5 px-4 text-sm disabled:opacity-40">अगला →</button>
            </div>
          </div>
        )}

        {tab === 'addtest' && (
          <form onSubmit={saveTest} className="card max-w-2xl space-y-4">
            <h2 className="font-bold text-slate-800">नया टेस्ट बनाएं</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-semibold text-slate-700 block mb-1">टाइटल (हिंदी) *</label><input required value={newTest.titleHi} onChange={e => setNewTest({...newTest, titleHi: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="text-sm font-semibold text-slate-700 block mb-1">Title (English)</label><input value={newTest.title} onChange={e => setNewTest({...newTest, title: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="text-sm font-semibold text-slate-700 block mb-1">प्रकार</label>
                <select value={newTest.type} onChange={e => setNewTest({...newTest, type: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select></div>
              <div><label className="text-sm font-semibold text-slate-700 block mb-1">कुल प्रश्न</label><input type="number" value={newTest.totalQuestions} onChange={e => setNewTest({...newTest, totalQuestions: +e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="text-sm font-semibold text-slate-700 block mb-1">कुल अंक</label><input type="number" value={newTest.totalMarks} onChange={e => setNewTest({...newTest, totalMarks: +e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="text-sm font-semibold text-slate-700 block mb-1">समय (मिनट)</label><input type="number" value={newTest.duration} onChange={e => setNewTest({...newTest, duration: +e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="text-sm font-semibold text-slate-700 block mb-1">नकारात्मक अंक</label><input type="number" step="0.25" value={newTest.negativeMarks} onChange={e => setNewTest({...newTest, negativeMarks: +e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            </div>
            <div><label className="text-sm font-semibold text-slate-700 block mb-1">विवरण</label><textarea value={newTest.description} onChange={e => setNewTest({...newTest, description: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows={2} /></div>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'सहेज रहा है...' : 'टेस्ट बनाएं'}</button>
          </form>
        )}

        {tab === 'addq' && (
          <form onSubmit={saveQ} className="card max-w-3xl space-y-4">
            <h2 className="font-bold text-slate-800">नया प्रश्न जोड़ें</h2>
            <div><label className="text-sm font-semibold text-slate-700 block mb-1">प्रश्न (हिंदी) *</label><textarea required value={newQ.textHi} onChange={e => setNewQ({...newQ, textHi: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows={3} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['A','B','C','D'].map(k => (
                <div key={k}><label className="text-sm font-semibold text-slate-700 block mb-1">विकल्प {k} *</label>
                  <input required value={(newQ as Record<string, string>)[`option${k}`]} onChange={e => setNewQ({...newQ, [`option${k}`]: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><label className="text-sm font-semibold text-slate-700 block mb-1">सही उत्तर *</label>
                <select value={newQ.correct} onChange={e => setNewQ({...newQ, correct: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  {['A','B','C','D'].map(k => <option key={k} value={k}>{k}</option>)}
                </select></div>
              <div><label className="text-sm font-semibold text-slate-700 block mb-1">विषय *</label>
                <select required value={newQ.subjectId} onChange={e => setNewQ({...newQ, subjectId: e.target.value, topicId: ''})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">चुनें</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.nameHi}</option>)}
                </select></div>
              <div><label className="text-sm font-semibold text-slate-700 block mb-1">टॉपिक *</label>
                <select required value={newQ.topicId} onChange={e => setNewQ({...newQ, topicId: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">चुनें</option>
                  {selSubject?.topics.map(t => <option key={t.id} value={t.id}>{t.nameHi}</option>)}
                </select></div>
              <div><label className="text-sm font-semibold text-slate-700 block mb-1">कठिनाई</label>
                <select value={newQ.difficulty} onChange={e => setNewQ({...newQ, difficulty: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="EASY">आसान</option><option value="MEDIUM">मध्यम</option><option value="HARD">कठिन</option>
                </select></div>
            </div>
            <div><label className="text-sm font-semibold text-slate-700 block mb-1">व्याख्या *</label><textarea required value={newQ.explanation} onChange={e => setNewQ({...newQ, explanation: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows={2} /></div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'जोड़ रहा है...' : 'प्रश्न जोड़ें'}</button>
              {msg && <div className="text-green-700 font-medium text-sm self-center">{msg}</div>}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
