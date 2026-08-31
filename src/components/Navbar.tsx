'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import FormulaPanel from './FormulaPanel'

interface User { name: string; email: string; role: string }

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formulaOpen, setFormulaOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user))
  }, [pathname])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <>
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">P</div>
            <div className="hidden sm:block">
              <div className="font-bold text-blue-800 text-sm leading-tight">MP Patwari</div>
              <div className="text-xs text-slate-500">Mock Test 2026</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-600 hover:text-blue-700 font-medium text-sm transition-colors">होम</Link>
            <Link href="/tests" className="text-slate-600 hover:text-blue-700 font-medium text-sm transition-colors">टेस्ट</Link>
            <Link href="/daily-challenge" className="text-slate-600 hover:text-blue-700 font-medium text-sm transition-colors">🎯 चैलेंज</Link>
            <Link href="/current-affairs" className="text-slate-600 hover:text-blue-700 font-medium text-sm transition-colors">📰 करेंट अफेयर्स</Link>
            {user && <Link href="/dashboard" className="text-slate-600 hover:text-blue-700 font-medium text-sm transition-colors">डैशबोर्ड</Link>}
            {user?.role === 'ADMIN' && <Link href="/admin" className="text-slate-600 hover:text-blue-700 font-medium text-sm transition-colors">Admin</Link>}
          </div>

          <div className="flex items-center gap-3">
            {/* Formula button */}
            <button
              onClick={() => setFormulaOpen(true)}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
              style={{ background: '#eff6ff', color: '#1d4ed8' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff' }}>
              <span>📚</span>
              <span className="hidden sm:inline">फॉर्मूला</span>
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-2 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors">
                  <div className="w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block max-w-24 truncate">{user.name}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-lg py-2 w-48 z-50">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>डैशबोर्ड</Link>
                    {user.role === 'ADMIN' && <Link href="/admin" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                    <hr className="my-1 border-slate-100" />
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">लॉगआउट</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login" className="text-blue-700 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">लॉगिन</Link>
                <Link href="/auth/register" className="btn-primary text-sm py-2 px-4">निःशुल्क रजिस्टर</Link>
              </div>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <FormulaPanel open={formulaOpen} onClose={() => setFormulaOpen(false)} />
    </>
  )
}
