'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('पासवर्ड मेल नहीं खाते'); return }
    if (form.password.length < 6) { setError('पासवर्ड कम से कम 6 अक्षर का होना चाहिए'); return }
    setLoading(true); setError('')
    const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) })
    const d = await r.json()
    setLoading(false)
    if (!r.ok) { setError(d.error); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">P</div>
          <h1 className="text-2xl font-bold text-slate-800">निःशुल्क रजिस्टर करें</h1>
          <p className="text-slate-500 text-sm mt-1">MP Patwari 2026 Mock Test</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">पूरा नाम</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="आपका पूरा नाम" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">ईमेल</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="आपका ईमेल" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">पासवर्ड</label>
            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="कम से कम 6 अक्षर" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">पासवर्ड की पुष्टि करें</label>
            <input type="password" required value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="पासवर्ड दोबारा लिखें" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
            {loading ? 'रजिस्टर हो रहा है...' : 'रजिस्टर करें'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          पहले से खाता है?{' '}
          <Link href="/auth/login" className="text-blue-700 font-semibold hover:underline">लॉगिन करें</Link>
        </p>
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">← होम पर वापस जाएं</Link>
        </div>
      </div>
    </div>
  )
}
