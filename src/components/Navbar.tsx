'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import FormulaPanel from './FormulaPanel'
import { CountdownChip } from './ExamCountdown'

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

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  const navLink = (href: string, label: string) => (
    <Link href={href}
      className="relative text-sm font-semibold transition-colors"
      style={{ color: isActive(href) ? '#1e40af' : '#475569' }}>
      {label}
      {isActive(href) && (
        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full" style={{ background: '#1e40af' }} />
      )}
    </Link>
  )

  return (
    <>
    {/* Mobile menu overlay */}
    {menuOpen && (
      <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)}
        style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }} />
    )}

    <nav className="sticky top-0 z-50 shadow-sm" style={{ background: 'rgba(255,255,255,0.96)', borderBottom: '1px solid #e4e9f2', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1e3a8a)' }}>P</div>
            <div className="hidden sm:block leading-tight">
              <div className="font-bold text-sm" style={{ color: '#1e3a8a' }}>MP Patwari 2026</div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>Mock Test Series</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLink('/', 'होम')}
            {navLink('/tests', 'टेस्ट')}
            {navLink('/question-bank', '📚 प्रश्न बैंक')}
            {navLink('/daily-challenge', '🎯 चैलेंज')}
            {navLink('/current-affairs', '📰 करेंट अफेयर्स')}
            {user && navLink('/dashboard', 'डैशबोर्ड')}
            {user?.role === 'ADMIN' && navLink('/admin', 'Admin')}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Countdown chip — hidden on very small screens */}
            <div className="hidden sm:block">
              <CountdownChip />
            </div>

            {/* Formula button */}
            <button onClick={() => setFormulaOpen(true)}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-2 rounded-lg transition-colors"
              style={{ background: '#eff6ff', color: '#1d4ed8' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff' }}>
              <span>📚</span>
              <span className="hidden sm:inline">फॉर्मूला</span>
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-colors"
                  style={{ background: '#eff6ff', color: '#1e40af' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #1e3a8a)' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block max-w-20 truncate">{user.name.split(' ')[0]}</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-12 rounded-2xl shadow-xl py-2 w-52 z-50"
                    style={{ background: 'white', border: '1px solid #e4e9f2' }}>
                    <div className="px-4 py-2 border-b" style={{ borderColor: '#f1f5f9' }}>
                      <div className="text-sm font-bold" style={{ color: '#1e293b' }}>{user.name}</div>
                      <div className="text-xs" style={{ color: '#94a3b8' }}>{user.email}</div>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: '#374151' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      onClick={() => setMenuOpen(false)}>
                      📊 डैशबोर्ड
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: '#374151' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                        onClick={() => setMenuOpen(false)}>
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <div className="border-t my-1" style={{ borderColor: '#f1f5f9' }} />
                    <button onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors"
                      style={{ color: '#dc2626' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                      🚪 लॉगआउट
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login"
                  className="text-sm font-bold px-3 py-2 rounded-lg transition-colors"
                  style={{ color: '#1e40af' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                  लॉगिन
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm py-2 px-4">रजिस्टर</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg"
              style={{ color: '#475569' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              {menuOpen
                ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-1" style={{ background: 'white', borderColor: '#e4e9f2' }}>
          <CountdownChip />
          <div className="pt-2 space-y-0.5">
            {[
              { href: '/', label: 'होम' },
              { href: '/tests', label: '📋 टेस्ट' },
              { href: '/question-bank', label: '📚 प्रश्न बैंक' },
              { href: '/daily-challenge', label: '🎯 डेली चैलेंज' },
              { href: '/current-affairs', label: '📰 करेंट अफेयर्स' },
              ...(user ? [{ href: '/dashboard', label: '📊 डैशबोर्ड' }] : []),
              ...(user?.role === 'ADMIN' ? [{ href: '/admin', label: '⚙️ Admin' }] : []),
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  color: isActive(l.href) ? '#1e40af' : '#374151',
                  background: isActive(l.href) ? '#eff6ff' : 'transparent',
                }}>
                {l.label}
              </Link>
            ))}
          </div>
          {!user && (
            <div className="pt-2 flex gap-2">
              <Link href="/auth/login" className="btn-secondary flex-1 justify-center py-2 text-sm">लॉगिन</Link>
              <Link href="/auth/register" className="btn-primary flex-1 justify-center py-2 text-sm">रजिस्टर</Link>
            </div>
          )}
          {user && (
            <button onClick={logout} className="w-full mt-2 text-sm font-semibold py-2.5 rounded-xl"
              style={{ background: '#fef2f2', color: '#dc2626' }}>
              🚪 लॉगआउट
            </button>
          )}
        </div>
      )}
    </nav>

    <FormulaPanel open={formulaOpen} onClose={() => setFormulaOpen(false)} />
    </>
  )
}
