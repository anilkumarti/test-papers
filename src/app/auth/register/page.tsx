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
    const r = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    })
    const d = await r.json()
    setLoading(false)
    if (!r.ok) { setError(d.error); return }
    router.push('/dashboard')
    router.refresh()
  }

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3

  return (
    <div className="min-h-screen flex" style={{ background: '#f4f6fb' }}>

      {/* Left panel — desktop only */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 px-10 py-12 text-white"
        style={{ background: 'linear-gradient(160deg, #0c1a4e 0%, #1e3a8a 55%, #1d4ed8 100%)' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>P</div>
          <span className="font-bold">MP Patwari 2026</span>
        </Link>

        <div>
          <div className="text-4xl font-bold leading-tight mb-4">
            आज से शुरू करें<br />
            <span style={{ color: '#fbbf24' }}>बिल्कुल निःशुल्क</span>
          </div>
          <p style={{ color: '#bfdbfe' }} className="text-sm leading-relaxed">
            MP Patwari 2026 परीक्षा में सफलता के लिए अभी रजिस्टर करें।
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: '✅', text: '500+ उच्च गुणवत्ता प्रश्न' },
              { icon: '✅', text: '20+ फुल लेंथ मॉक टेस्ट' },
              { icon: '✅', text: 'विस्तृत डैशबोर्ड और विश्लेषण' },
              { icon: '✅', text: 'करंट अफेयर्स — जून 2026 तक' },
              { icon: '✅', text: 'कोई शुल्क नहीं — सदा निःशुल्क' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm" style={{ color: '#e2e8f0' }}>
                <span style={{ color: '#86efac' }}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: '#475569' }}>
          © 2026 MP Patwari Mock Test Series
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1e3a8a)' }}>P</div>
              <span className="font-bold text-lg" style={{ color: '#1e3a8a' }}>MP Patwari 2026</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8" style={{ boxShadow: '0 8px 40px rgba(15,23,42,0.12)', border: '1px solid #e4e9f2' }}>
            <div className="mb-7">
              <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>निःशुल्क रजिस्टर करें</h1>
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>30 सेकंड में तैयारी शुरू करें</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm"
                style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#374151' }}>पूरा नाम</label>
                <input type="text" required autoComplete="name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  placeholder="आपका पूरा नाम" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#374151' }}>ईमेल पता</label>
                <input type="email" required autoComplete="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="form-input"
                  placeholder="example@email.com" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#374151' }}>पासवर्ड</label>
                <input type="password" required autoComplete="new-password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="form-input"
                  placeholder="कम से कम 6 अक्षर" />
                {form.password.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all"
                        style={{ background: i <= strength ? (strength >= 3 ? '#16a34a' : strength >= 2 ? '#f59e0b' : '#ef4444') : '#e2e8f0' }} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#374151' }}>पासवर्ड दोबारा लिखें</label>
                <input type="password" required autoComplete="new-password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  className="form-input"
                  placeholder="पासवर्ड की पुष्टि करें" />
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3 mt-2 text-base"
                style={{ opacity: loading ? 0.7 : 1 }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> रजिस्टर हो रहा है...</>
                  : 'रजिस्टर करें — निःशुल्क →'}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: '#64748b' }}>
              पहले से खाता है?{' '}
              <Link href="/auth/login" className="font-bold hover:underline" style={{ color: '#1e40af' }}>लॉगिन करें</Link>
            </p>
          </div>

          <p className="text-center mt-4">
            <Link href="/" className="text-sm" style={{ color: '#94a3b8' }}>← होम पर वापस जाएं</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
