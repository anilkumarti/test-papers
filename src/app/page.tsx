'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import FooterStats from '@/components/FooterStats'
import ExamCountdown from '@/components/ExamCountdown'

const examPattern = [
  { subject: 'सामान्य विज्ञान',             questions: 25, marks: 25, color: '#f43f5e', section: 1 },
  { subject: 'सामान्य हिन्दी',              questions: 25, marks: 25, color: '#8b5cf6', section: 1 },
  { subject: 'सामान्य अंग्रेजी',            questions: 25, marks: 25, color: '#10b981', section: 1 },
  { subject: 'सामान्य गणित',               questions: 25, marks: 25, color: '#f59e0b', section: 1 },
  { subject: 'सामान्य ज्ञान एवं अभिरुचि', questions: 25, marks: 25, color: '#3b82f6', section: 2 },
  { subject: 'कंप्यूटर ज्ञान',             questions: 25, marks: 25, color: '#06b6d4', section: 2 },
  { subject: 'सामान्य तर्कशक्ति',           questions: 25, marks: 25, color: '#ef4444', section: 2 },
  { subject: 'सामान्य प्रबंधन',             questions: 25, marks: 25, color: '#84cc16', section: 2 },
]

const features = [
  { icon: '📚', grad: 'linear-gradient(135deg,#3b82f6,#6366f1)', title: '1500+ PYQ प्रश्न',   desc: 'MPESB आधिकारिक पिछले वर्ष प्रश्न बैंक — विषयवार अभ्यास करें' },
  { icon: '⏱️', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)', title: 'रियल टाइमर',         desc: 'वास्तविक परीक्षा जैसा CBT इंटरफेस और काउंटडाउन टाइमर' },
  { icon: '📊', grad: 'linear-gradient(135deg,#10b981,#06b6d4)', title: 'विस्तृत विश्लेषण',   desc: 'विषय-वार प्रदर्शन रिपोर्ट और कमजोर क्षेत्रों की पहचान' },
  { icon: '🎯', grad: 'linear-gradient(135deg,#8b5cf6,#ec4899)', title: 'डेली चैलेंज',        desc: 'रोज़ 10 नए प्रश्न — हर दिन अभ्यास, हर दिन आगे' },
  { icon: '📰', grad: 'linear-gradient(135deg,#ef4444,#f97316)', title: 'करेंट अफेयर्स',      desc: 'MP और राष्ट्रीय करेंट अफेयर्स — परीक्षा से पहले अपडेट रहें' },
  { icon: '📱', grad: 'linear-gradient(135deg,#06b6d4,#10b981)', title: 'मोबाइल फ्रेंडली',    desc: 'मोबाइल और डेस्कटॉप — कहीं भी, कभी भी अभ्यास करें' },
]

const steps = [
  { icon: '📝', title: 'रजिस्टर करें',   desc: 'मुफ्त अकाउंट बनाएं — 30 सेकंड में',        grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  { icon: '🎓', title: 'विषय चुनें',     desc: 'फुल टेस्ट या विषयवार अभ्यास करें',          grad: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { icon: '📊', title: 'परिणाम देखें',   desc: 'तुरंत स्कोर, गलतियाँ और सही उत्तर देखें',  grad: 'linear-gradient(135deg,#10b981,#06b6d4)' },
]

const faqs = [
  { q: 'MP Patwari 2026 परीक्षा में कितने प्रश्न होंगे?', a: 'MPESB 2026 अधिसूचना के अनुसार कुल 200 प्रश्न होंगे, प्रत्येक 1 अंक का। परीक्षा 2 खंडों में होगी — खंड 1: सामान्य विज्ञान, हिन्दी, अंग्रेजी, गणित (100 अंक); खंड 2: सामान्य ज्ञान, कंप्यूटर, तर्कशक्ति, सामान्य प्रबंधन (100 अंक)। कुल समय 3 घंटे (180 मिनट)।' },
  { q: 'क्या नकारात्मक अंकन (Negative Marking) है?', a: 'हाँ, MPESB 2026 पैटर्न में प्रत्येक गलत उत्तर पर 0.25 अंक काटे जाएंगे। इसलिए अनिश्चित प्रश्न छोड़ना बेहतर हो सकता है।' },
  { q: 'क्या PYQ (पिछले वर्ष प्रश्न) उपलब्ध हैं?', a: 'हाँ, हमारे प्रश्न बैंक में 1000+ MPESB आधिकारिक PYQ प्रश्न उपलब्ध हैं। विषय चुनें और तुरंत उत्तर देखें।' },
  { q: 'मॉक टेस्ट वास्तविक परीक्षा से कितना मिलता-जुलता है?', a: 'हमारे मॉक टेस्ट पिछले MPESB/MPPEB परीक्षाओं के पैटर्न पर आधारित हैं। कठिनाई स्तर, विषय वितरण और प्रश्न शैली समान रखी गई है।' },
  { q: 'क्या यह प्लेटफॉर्म बिल्कुल मुफ्त है?', a: 'हाँ, सभी मॉक टेस्ट, प्रश्न बैंक और करेंट अफेयर्स बिल्कुल निःशुल्क हैं। रजिस्टर करें और तुरंत शुरू करें।' },
]

const mockLeaderboard = [
  { rank: 1, name: 'Priya S.',  score: 187, accuracy: '93%', badge: '🥇' },
  { rank: 2, name: 'Rahul K.',  score: 182, accuracy: '91%', badge: '🥈' },
  { rank: 3, name: 'Anita M.',  score: 179, accuracy: '89%', badge: '🥉' },
  { rank: 4, name: 'Suresh P.', score: 174, accuracy: '87%', badge: '🏅' },
  { rank: 5, name: 'Kavita R.', score: 171, accuracy: '85%', badge: '🏅' },
]

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [announceDismissed, setAnnounceDismissed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined')
      setAnnounceDismissed(sessionStorage.getItem('ann_dismissed') === '1')
  }, [])

  const dismissAnnounce = () => {
    setAnnounceDismissed(true)
    sessionStorage.setItem('ann_dismissed', '1')
  }

  return (
    <div className="min-h-screen" style={{ background: '#f0f4ff' }}>
      <Navbar />

      {/* ── Daily Challenge Strip ──────────────────────────────── */}
      {!announceDismissed && (
        <div className="relative flex items-center justify-center gap-2 text-white text-xs font-bold py-2.5 px-4 text-center"
          style={{ background: 'linear-gradient(90deg,#7c3aed,#ec4899,#f59e0b)' }}>
          <span>🎯</span>
          <span>आज का डेली चैलेंज लाइव है — 10 प्रश्न, 2 मिनट!</span>
          <Link href="/daily-challenge" className="underline underline-offset-2 whitespace-nowrap">अभी खेलें →</Link>
          <button onClick={dismissAnnounce}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 text-lg leading-none">
            ×
          </button>
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white py-16 sm:py-24 px-4"
        style={{ background: 'linear-gradient(135deg,#1a0533 0%,#2d1b69 30%,#1e3a8a 65%,#0e7490 100%)' }}>

        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#f59e0b,transparent 70%)' }} />
          <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#ec4899,transparent 70%)' }} />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(ellipse,#06b6d4,transparent 70%)' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full mb-6 font-bold text-sm px-4 py-1.5"
            style={{ background: 'rgba(245,158,11,0.25)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.4)' }}>
            🆕 MPESB अधिसूचना 2026 — तैयारी शुरू करें
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            MP Patwari 2026<br />
            <span style={{
              background: 'linear-gradient(90deg,#fbbf24,#f97316,#ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              मॉक टेस्ट सीरीज
            </span>
          </h1>

          <p className="text-base sm:text-lg mb-8 max-w-xl mx-auto" style={{ color: '#bfdbfe' }}>
            नवीनतम MPESB पाठ्यक्रम पर आधारित उच्च गुणवत्ता के मॉक टेस्ट —{' '}
            <strong style={{ color: '#fcd34d' }}>बिल्कुल निःशुल्क।</strong>
          </p>

          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#93c5fd' }}>
              परीक्षा में बचा समय — 22 सितम्बर 2026
            </p>
            <ExamCountdown />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tests"
              className="btn-primary text-base py-3 px-7 justify-center"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', boxShadow: '0 4px 24px rgba(239,68,68,0.45)' }}>
              🚀 अभी टेस्ट दें
            </Link>
            <Link href="/question-bank"
              className="btn-ghost text-base"
              style={{ border: '1.5px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(4px)' }}>
              📚 PYQ बैंक देखें
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            {[
              { val: '1500+', label: 'PYQ प्रश्न',  grad: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
              { val: '20+',   label: 'मॉक टेस्ट',   grad: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
              { val: '8',     label: 'विषय',         grad: 'linear-gradient(135deg,#10b981,#06b6d4)' },
              { val: '100%',  label: 'निःशुल्क',    grad: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
            ].map((s, i) => (
              <div key={i} className="text-center rounded-2xl py-4 px-2 overflow-hidden relative"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: s.grad }} />
                <div className="text-xl sm:text-2xl font-bold mb-0.5"
                  style={{ background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontVariantNumeric: 'tabular-nums' }}>
                  {s.val}
                </div>
                <div className="text-xs" style={{ color: '#93c5fd' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Question Bank Highlight ────────────────────────────── */}
      <section className="py-14 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#064e3b 0%,#065f46 40%,#0f766e 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#34d399,transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle,#fbbf24,transparent 70%)' }} />
        </div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(52,211,153,0.2)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.3)' }}>
              📚 नया — PYQ प्रश्न बैंक
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              1000+ आधिकारिक<br />
              <span style={{
                background: 'linear-gradient(90deg,#fbbf24,#34d399)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                पिछले वर्ष प्रश्न
              </span>
            </h2>
            <p className="text-sm mb-5" style={{ color: '#a7f3d0' }}>
              MPESB की आधिकारिक PYQ फ़ाइल से चुने गए प्रश्न — विषय चुनें, उत्तर क्लिक करें, तुरंत सही जवाब देखें।
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                ['🌍', 'GK', 200], ['🔬', 'विज्ञान', 200], ['📐', 'गणित', 175],
                ['📝', 'हिन्दी', 175], ['🔤', 'अंग्रेजी', 170], ['🏛️', 'प्रबंधन', 65],
              ].map(([icon, label, count]) => (
                <span key={label as string}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
                  {icon} {label} <span style={{ color: '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>({count})</span>
                </span>
              ))}
            </div>
            <Link href="/question-bank"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white"
              style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)', boxShadow: '0 4px 20px rgba(251,191,36,0.4)' }}>
              प्रश्न बैंक खोलें →
            </Link>
          </div>

          {/* Decorative card */}
          <div className="flex-shrink-0 w-full md:w-80">
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
              <div className="h-1" style={{ background: 'linear-gradient(90deg,#fbbf24,#34d399,#06b6d4)' }} />
              <div className="p-4">
                <div className="text-xs font-bold mb-3" style={{ color: '#6ee7b7' }}>🌍 सामान्य ज्ञान — Q47</div>
                <p className="text-sm font-semibold text-white mb-3 leading-snug">
                  मध्यप्रदेश का राज्य पशु कौन सा है?
                </p>
                {[['A','बाघ',true],['B','शेर',false],['C','हिरण',false],['D','तेंदुआ',false]].map(([k,t,correct]) => (
                  <div key={k as string}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg mb-1.5 text-sm"
                    style={{
                      background: correct ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${correct ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: correct ? '#6ee7b7' : 'rgba(255,255,255,0.65)',
                    }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: correct ? '#10b981' : 'rgba(255,255,255,0.1)', color: correct ? 'white' : 'rgba(255,255,255,0.5)' }}>
                      {correct ? '✓' : k}
                    </span>
                    {t}
                  </div>
                ))}
                <div className="mt-3 text-xs px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                  🎉 बिल्कुल सही! MP का राज्य पशु बाघ है।
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="py-16 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#fdf4ff 0%,#eff6ff 50%,#f0fdf4 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', color: 'white' }}>
              कैसे शुरू करें
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#0f172a' }}>
              3 आसान कदम
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-0.5"
              style={{ background: 'linear-gradient(90deg,#6366f1,#f59e0b,#10b981)' }} />
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center p-5 rounded-2xl"
                style={{ background: 'white', border: '1px solid #e4e9f2', boxShadow: '0 4px 16px rgba(15,23,42,0.06)' }}>
                <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-4 z-10"
                  style={{ background: s.grad, boxShadow: `0 8px 24px rgba(0,0,0,0.2)` }}>
                  {s.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-1" style={{ color: '#0f172a' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: '#64748b' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white text-base"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
              अभी रजिस्टर करें — मुफ्त
            </Link>
          </div>
        </div>
      </section>

      {/* ── Exam Pattern ──────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: 'white' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: 'white' }}>
              परीक्षा पैटर्न
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#0f172a' }}>विषयवार प्रश्न वितरण</h2>
            <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>MPESB 2026 आधिकारिक अधिसूचना — परीक्षा तिथि: 22 सितम्बर 2026</p>
          </div>
          <div className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid #e4e9f2', boxShadow: '0 4px 24px rgba(15,23,42,0.08)' }}>
            <div className="grid grid-cols-4 text-sm font-bold px-5 py-4 text-white"
              style={{ background: 'linear-gradient(90deg,#1e3a8a,#0891b2)' }}>
              <div>विषय</div>
              <div className="text-center">प्रश्न</div>
              <div className="text-center">अंक</div>
              <div className="text-center">%</div>
            </div>
            <div className="px-5 py-2 text-xs font-bold tracking-wide"
              style={{ background: 'linear-gradient(90deg,#eef2ff,#f0f9ff)', color: '#3730a3', borderBottom: '1px solid #e4e9f2' }}>
              खंड 1 — भाषा, विज्ञान एवं गणित (100 अंक)
            </div>
            {examPattern.filter(s => s.section === 1).map((s, i) => (
              <div key={i} className="grid grid-cols-4 px-5 py-3 text-sm border-b"
                style={{ background: i % 2 === 0 ? 'white' : '#fafbff', borderColor: '#f0f4f8' }}>
                <div className="flex items-center gap-2 font-medium" style={{ color: '#334155' }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="truncate">{s.subject}</span>
                </div>
                <div className="text-center font-bold" style={{ color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>{s.questions}</div>
                <div className="text-center font-bold" style={{ color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>{s.marks}</div>
                <div className="text-center" style={{ color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>{Math.round(s.marks / 2)}%</div>
              </div>
            ))}
            <div className="px-5 py-2 text-xs font-bold tracking-wide"
              style={{ background: 'linear-gradient(90deg,#f0f9ff,#ecfdf5)', color: '#0c4a6e', borderBottom: '1px solid #e4e9f2' }}>
              खंड 2 — ज्ञान, तर्क एवं प्रबंधन (100 अंक)
            </div>
            {examPattern.filter(s => s.section === 2).map((s, i) => (
              <div key={i} className="grid grid-cols-4 px-5 py-3 text-sm border-b"
                style={{ background: i % 2 === 0 ? 'white' : '#fafbff', borderColor: '#f0f4f8' }}>
                <div className="flex items-center gap-2 font-medium" style={{ color: '#334155' }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="truncate">{s.subject}</span>
                </div>
                <div className="text-center font-bold" style={{ color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>{s.questions}</div>
                <div className="text-center font-bold" style={{ color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>{s.marks}</div>
                <div className="text-center" style={{ color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>{Math.round(s.marks / 2)}%</div>
              </div>
            ))}
            <div className="grid grid-cols-4 px-5 py-3.5 font-bold text-sm"
              style={{ background: 'linear-gradient(90deg,#eff6ff,#f0f9ff)', color: '#1e40af' }}>
              <div>कुल</div>
              <div className="text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>200</div>
              <div className="text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>200</div>
              <div className="text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>100%</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: '#475569' }}>
            <span>⏱ <strong style={{ color: '#1e40af' }}>180 मिनट (3 घंटे)</strong></span>
            <span>⚠️ <strong style={{ color: '#dc2626' }}>-0.25 नकारात्मक अंकन</strong></span>
            <span>🖥 <strong style={{ color: '#1e40af' }}>CBT मोड</strong></span>
            <span>📝 <strong style={{ color: '#1e40af' }}>हिंदी / अंग्रेजी</strong></span>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="py-16 px-4"
        style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: 'rgba(139,92,246,0.3)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.4)' }}>
              विशेषताएँ
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-white">हमारी प्लेटफॉर्म क्यों?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="rounded-2xl p-5 flex gap-4 items-start"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: f.grad, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold mb-0.5 text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Daily Challenge + Current Affairs ─────────────────── */}
      <section className="py-14 px-4"
        style={{ background: 'linear-gradient(135deg,#fdf4ff 0%,#eff6ff 100%)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Daily Challenge */}
          <div className="rounded-2xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#c026d3 100%)' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle,#f9a8d4,transparent 70%)' }} />
            </div>
            <div className="p-6 relative z-10 text-white">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">डेली चैलेंज</h3>
              <p className="text-sm mb-5" style={{ color: '#e9d5ff' }}>
                हर दिन 10 नए प्रश्न — 2 मिनट में पूरा करें। रोज़ का अभ्यास, रोज़ की तरक्की।
              </p>
              <div className="flex items-center gap-2 mb-5">
                {['सो','मं','बु','गु','शु','श','र'].map((d, i) => (
                  <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: i < 5 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', color: i < 5 ? 'white' : 'rgba(255,255,255,0.4)' }}>
                    {i < 5 ? '✓' : d}
                  </div>
                ))}
              </div>
              <Link href="/daily-challenge"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                आज का चैलेंज लें →
              </Link>
            </div>
          </div>

          {/* Current Affairs */}
          <div className="rounded-2xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg,#0f766e 0%,#0891b2 50%,#1d4ed8 100%)' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle,#7dd3fc,transparent 70%)' }} />
            </div>
            <div className="p-6 relative z-10 text-white">
              <div className="text-3xl mb-3">📰</div>
              <h3 className="text-xl font-bold mb-2">करेंट अफेयर्स</h3>
              <p className="text-sm mb-5" style={{ color: '#bae6fd' }}>
                MP और राष्ट्रीय स्तर की ताज़ा खबरें — परीक्षा के GK सेक्शन के लिए तैयार रहें।
              </p>
              <div className="space-y-2 mb-5">
                {[
                  'MP में नई औद्योगिक नीति 2025 लागू',
                  'राष्ट्रीय डिजिटल स्वास्थ्य मिशन अपडेट',
                  'MPESB 2026 परीक्षा तिथि घोषित',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#e0f2fe' }}>
                    <span className="mt-0.5 flex-shrink-0" style={{ color: '#38bdf8' }}>•</span>
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/current-affairs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                सभी अपडेट देखें →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Leaderboard ───────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', color: 'white' }}>
              लीडरबोर्ड
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#0f172a' }}>टॉप स्कोरर</h2>
            <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>आप भी इस लिस्ट में आ सकते हैं — अभी टेस्ट दें</p>
          </div>
          <div className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid #e4e9f2', boxShadow: '0 4px 24px rgba(15,23,42,0.08)' }}>
            <div className="grid grid-cols-4 text-xs font-bold px-5 py-3.5 text-white"
              style={{ background: 'linear-gradient(90deg,#f59e0b,#ef4444,#ec4899)' }}>
              <div>रैंक</div><div>नाम</div>
              <div className="text-center">स्कोर</div>
              <div className="text-center">सटीकता</div>
            </div>
            {mockLeaderboard.map((row, i) => (
              <div key={i} className="grid grid-cols-4 px-5 py-3.5 text-sm border-b items-center"
                style={{ background: i === 0 ? '#fffbeb' : i % 2 === 0 ? 'white' : '#fafbff', borderColor: '#f0f4f8' }}>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-lg">{row.badge}</span>
                  <span style={{ color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>#{row.rank}</span>
                </div>
                <div className="font-semibold" style={{ color: '#1e293b' }}>{row.name}</div>
                <div className="text-center font-bold" style={{ color: '#1e40af', fontVariantNumeric: 'tabular-nums' }}>{row.score}/200</div>
                <div className="text-center font-bold" style={{ color: '#16a34a' }}>{row.accuracy}</div>
              </div>
            ))}
            <div className="px-5 py-3.5 text-center"
              style={{ background: 'linear-gradient(90deg,#fdf4ff,#eff6ff)' }}>
              <Link href="/auth/register" className="text-sm font-bold"
                style={{ background: 'linear-gradient(90deg,#7c3aed,#2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                रजिस्टर करें और लीडरबोर्ड में जगह बनाएं →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-14 px-4 text-center text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1a0533 0%,#4f46e5 40%,#0891b2 80%,#065f46 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle,#fbbf24,transparent 70%)' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle,#ec4899,transparent 70%)' }} />
        </div>
        <div className="max-w-xl mx-auto relative z-10">
          <div className="text-4xl mb-4">🏆</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">आज ही शुरू करें — बिल्कुल निःशुल्क</h2>
          <p className="mb-7" style={{ color: '#bfdbfe' }}>
            रजिस्टर करें और 1500+ PYQ प्रश्नों के साथ MP Patwari 2026 की तैयारी को गंभीरता से शुरू करें।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register"
              className="btn-primary text-base py-3 px-8 justify-center"
              style={{ background: 'linear-gradient(135deg,#fbbf24,#f97316)', boxShadow: '0 4px 20px rgba(251,191,36,0.45)' }}>
              निःशुल्क रजिस्टर करें
            </Link>
            <Link href="/question-bank" className="btn-ghost text-base"
              style={{ border: '1.5px solid rgba(255,255,255,0.35)' }}>
              📚 PYQ बैंक देखें →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-16 px-4"
        style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#fdf4ff 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0f172a' }}>
              अक्सर पूछे जाने वाले प्रश्न
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl overflow-hidden transition-all"
                style={{
                  background: 'white',
                  border: `1.5px solid ${openFaq === i ? '#8b5cf6' : '#e4e9f2'}`,
                  boxShadow: openFaq === i ? '0 4px 16px rgba(139,92,246,0.12)' : 'none',
                }}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 font-semibold text-left"
                  style={{ color: '#1e293b' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="pr-4 text-sm sm:text-base">{f.q}</span>
                  <span className="text-xl flex-shrink-0 font-bold transition-transform"
                    style={{
                      background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      transform: openFaq === i ? 'rotate(45deg)' : 'none',
                      display: 'inline-block',
                    }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: '#475569' }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="py-10 px-4 text-center text-sm relative overflow-hidden"
        style={{ background: '#0a0a1a', color: '#94a3b8' }}>
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg,#6366f1,#ec4899,#f59e0b,#10b981,#06b6d4)' }} />
        <div className="max-w-3xl mx-auto">
          <div className="font-bold text-lg mb-2 text-white">MP Patwari Mock Test 2026</div>
          <p className="mb-3 text-sm" style={{ color: '#475569' }}>
            यह प्लेटफॉर्म MPESB/MPPEB परीक्षा पैटर्न पर आधारित अभ्यास टेस्ट प्रदान करता है।<br />
            यह MPESB का आधिकारिक पोर्टल नहीं है।
          </p>
          <p className="text-xs" style={{ color: '#334155' }}>
            प्रश्न पिछले पैटर्न पर आधारित हैं। आधिकारिक जानकारी के लिए esb.mp.gov.in देखें।
          </p>
          <FooterStats />
        </div>
      </footer>

      {/* ── Sticky Mobile CTA ─────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden p-3"
        style={{ background: 'rgba(255,255,255,0.97)', borderTop: '1px solid #e4e9f2', backdropFilter: 'blur(8px)' }}>
        <div className="flex gap-2">
          <Link href="/tests"
            className="flex-1 py-3 rounded-xl font-bold text-sm text-center text-white"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
            🚀 टेस्ट दें
          </Link>
          <Link href="/question-bank"
            className="flex-1 py-3 rounded-xl font-bold text-sm text-center text-white"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            📚 PYQ बैंक
          </Link>
        </div>
      </div>

      <div className="h-16 sm:hidden" />
    </div>
  )
}
