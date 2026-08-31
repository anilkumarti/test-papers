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
  { icon: '📚', bg: '#dbeafe', title: '1500+ PYQ प्रश्न',   desc: 'MPESB आधिकारिक पिछले वर्ष प्रश्न बैंक — विषयवार अभ्यास करें', color: '#1e40af' },
  { icon: '⏱️', bg: '#fef3c7', title: 'रियल टाइमर',         desc: 'वास्तविक परीक्षा जैसा CBT इंटरफेस और काउंटडाउन टाइमर',         color: '#92400e' },
  { icon: '📊', bg: '#dcfce7', title: 'विस्तृत विश्लेषण',   desc: 'विषय-वार प्रदर्शन रिपोर्ट और कमजोर क्षेत्रों की पहचान',         color: '#166534' },
  { icon: '🎯', bg: '#f3e8ff', title: 'डेली चैलेंज',        desc: 'रोज़ 10 नए प्रश्न — हर दिन अभ्यास, हर दिन आगे',                  color: '#6b21a8' },
  { icon: '📰', bg: '#fee2e2', title: 'करेंट अफेयर्स',      desc: 'MP और राष्ट्रीय करेंट अफेयर्स — परीक्षा से पहले अपडेट रहें',    color: '#991b1b' },
  { icon: '📱', bg: '#e0f2fe', title: 'मोबाइल फ्रेंडली',    desc: 'मोबाइल और डेस्कटॉप — कहीं भी, कभी भी अभ्यास करें',              color: '#0c4a6e' },
]

const steps = [
  { num: '01', icon: '📝', title: 'रजिस्टर करें',      desc: 'मुफ्त अकाउंट बनाएं — 30 सेकंड में',          color: '#3b82f6' },
  { num: '02', icon: '🎓', title: 'विषय चुनें',        desc: 'फुल टेस्ट या विषयवार अभ्यास करें',            color: '#8b5cf6' },
  { num: '03', icon: '📊', title: 'परिणाम देखें',      desc: 'तुरंत स्कोर, गलतियाँ और सही उत्तर देखें',    color: '#10b981' },
]

const faqs = [
  { q: 'MP Patwari 2026 परीक्षा में कितने प्रश्न होंगे?', a: 'MPESB 2026 अधिसूचना के अनुसार कुल 200 प्रश्न होंगे, प्रत्येक 1 अंक का। परीक्षा 2 खंडों में होगी — खंड 1: सामान्य विज्ञान, हिन्दी, अंग्रेजी, गणित (100 अंक); खंड 2: सामान्य ज्ञान, कंप्यूटर, तर्कशक्ति, सामान्य प्रबंधन (100 अंक)। कुल समय 3 घंटे (180 मिनट)।' },
  { q: 'क्या नकारात्मक अंकन (Negative Marking) है?', a: 'हाँ, MPESB 2026 पैटर्न में प्रत्येक गलत उत्तर पर 0.25 अंक काटे जाएंगे। इसलिए अनिश्चित प्रश्न छोड़ना बेहतर हो सकता है।' },
  { q: 'क्या PYQ (पिछले वर्ष प्रश्न) उपलब्ध हैं?', a: 'हाँ, हमारे प्रश्न बैंक में 1000+ MPESB आधिकारिक PYQ प्रश्न उपलब्ध हैं। विषय चुनें और तुरंत उत्तर देखें।' },
  { q: 'मॉक टेस्ट वास्तविक परीक्षा से कितना मिलता-जुलता है?', a: 'हमारे मॉक टेस्ट पिछले MPESB/MPPEB परीक्षाओं के पैटर्न पर आधारित हैं। कठिनाई स्तर, विषय वितरण और प्रश्न शैली समान रखी गई है।' },
  { q: 'क्या यह प्लेटफॉर्म बिल्कुल मुफ्त है?', a: 'हाँ, सभी मॉक टेस्ट, प्रश्न बैंक और करेंट अफेयर्स बिल्कुल निःशुल्क हैं। रजिस्टर करें और तुरंत शुरू करें।' },
]

const mockLeaderboard = [
  { rank: 1, name: 'Priya S.',   score: 187, accuracy: '93%', badge: '🥇' },
  { rank: 2, name: 'Rahul K.',   score: 182, accuracy: '91%', badge: '🥈' },
  { rank: 3, name: 'Anita M.',   score: 179, accuracy: '89%', badge: '🥉' },
  { rank: 4, name: 'Suresh P.',  score: 174, accuracy: '87%', badge: '🏅' },
  { rank: 5, name: 'Kavita R.',  score: 171, accuracy: '85%', badge: '🏅' },
]

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [announceDismissed, setAnnounceDismissed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAnnounceDismissed(sessionStorage.getItem('ann_dismissed') === '1')
    }
  }, [])

  const dismissAnnounce = () => {
    setAnnounceDismissed(true)
    sessionStorage.setItem('ann_dismissed', '1')
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8faff' }}>
      <Navbar />

      {/* ── Daily Challenge Announcement Strip ───────────── */}
      {!announceDismissed && (
        <div className="relative flex items-center justify-center gap-2 text-white text-xs font-bold py-2 px-4 text-center"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }}>
          <span>🎯</span>
          <span>आज का डेली चैलेंज लाइव है — 10 प्रश्न, 2 मिनट!</span>
          <Link href="/daily-challenge" className="underline underline-offset-2 whitespace-nowrap">अभी खेलें →</Link>
          <button onClick={dismissAnnounce}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 text-base leading-none">
            ×
          </button>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white py-16 sm:py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #0c1a4e 0%, #1e3a8a 50%, #1d4ed8 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full" style={{ background: 'rgba(245,158,11,0.08)' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full mb-6 font-bold text-sm px-4 py-1.5"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' }}>
            🆕 MPESB अधिसूचना 2026 — तैयारी शुरू करें
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            MP Patwari 2026<br />
            <span style={{ color: '#fbbf24' }}>मॉक टेस्ट सीरीज</span>
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
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 20px rgba(245,158,11,0.5)' }}>
              🚀 अभी टेस्ट दें
            </Link>
            <Link href="/question-bank"
              className="btn-ghost text-base"
              style={{ border: '1.5px solid rgba(255,255,255,0.35)' }}>
              📚 PYQ बैंक देखें
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            {[
              { val: '1500+', label: 'PYQ प्रश्न' },
              { val: '20+',   label: 'मॉक टेस्ट' },
              { val: '8',     label: 'विषय' },
              { val: '100%',  label: 'निःशुल्क' },
            ].map((s, i) => (
              <div key={i} className="text-center rounded-2xl py-3"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="text-xl sm:text-2xl font-bold" style={{ color: '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                <div className="text-xs" style={{ color: '#93c5fd' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Question Bank Highlight ───────────────────────── */}
      <section className="py-14 px-4"
        style={{ background: 'linear-gradient(135deg, #0c1a4e 0%, #1e3a8a 100%)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Left */}
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#c4b5fd' }}>
              📚 नया — PYQ प्रश्न बैंक
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              1000+ आधिकारिक<br />
              <span style={{ color: '#fbbf24' }}>पिछले वर्ष प्रश्न</span>
            </h2>
            <p className="text-sm mb-5" style={{ color: '#bfdbfe' }}>
              MPESB की आधिकारिक PYQ फ़ाइल से चुने गए प्रश्न — विषय चुनें, उत्तर क्लिक करें, तुरंत सही जवाब देखें। कोई टाइमर नहीं, बस शांत अभ्यास।
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { code: 'GK',     label: '🌍 GK',        count: 200 },
                { code: 'SCI',    label: '🔬 विज्ञान',   count: 200 },
                { code: 'MATH',   label: '📐 गणित',      count: 175 },
                { code: 'HIN',    label: '📝 हिन्दी',    count: 175 },
                { code: 'ENG',    label: '🔤 अंग्रेजी',  count: 170 },
                { code: 'MGMT',   label: '🏛️ प्रबंधन',  count: 65  },
              ].map(s => (
                <span key={s.code} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
                  {s.label} <span style={{ color: '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>({s.count})</span>
                </span>
              ))}
            </div>
            <Link href="/question-bank"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>
              प्रश्न बैंक खोलें →
            </Link>
          </div>

          {/* Right — decorative card preview */}
          <div className="flex-shrink-0 w-full md:w-80">
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
              <div className="h-1" style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
              <div className="p-4">
                <div className="text-xs font-bold mb-3" style={{ color: '#93c5fd' }}>🌍 सामान्य ज्ञान — Q47</div>
                <p className="text-sm font-semibold text-white mb-3 leading-snug">
                  मध्यप्रदेश का राज्य पशु कौन सा है?
                </p>
                {[
                  { k: 'A', t: 'बाघ',    correct: true  },
                  { k: 'B', t: 'शेर',    correct: false },
                  { k: 'C', t: 'हिरण',   correct: false },
                  { k: 'D', t: 'तेंदुआ', correct: false },
                ].map(o => (
                  <div key={o.k} className="flex items-center gap-2 px-3 py-2 rounded-lg mb-1.5 text-sm"
                    style={{
                      background: o.correct ? 'rgba(22,163,74,0.25)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${o.correct ? 'rgba(22,163,74,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      color: o.correct ? '#86efac' : 'rgba(255,255,255,0.7)',
                    }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: o.correct ? '#16a34a' : 'rgba(255,255,255,0.1)' }}>
                      {o.correct ? '✓' : o.k}
                    </span>
                    {o.t}
                  </div>
                ))}
                <div className="mt-3 text-xs px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
                  🎉 बिल्कुल सही! MP का राज्य पशु बाघ है।
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: '#eff6ff', color: '#1e40af' }}>कैसे शुरू करें</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#0f172a' }}>3 आसान कदम</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
            {/* Connector line — desktop only */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5"
              style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981)' }} />
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-4 z-10"
                  style={{ background: s.color + '15', border: `2px solid ${s.color}30` }}>
                  {s.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: s.color, fontVariantNumeric: 'tabular-nums' }}>
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
              style={{ background: 'linear-gradient(135deg, #2563eb, #1e3a8a)', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}>
              अभी रजिस्टर करें — मुफ्त
            </Link>
          </div>
        </div>
      </section>

      {/* ── Exam Pattern ─────────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: '#f4f6fb' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: '#eff6ff', color: '#1e40af' }}>परीक्षा पैटर्न</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#0f172a' }}>विषयवार प्रश्न वितरण</h2>
            <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>MPESB 2026 आधिकारिक अधिसूचना पर आधारित। परीक्षा तिथि: 22 सितम्बर 2026।</p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e4e9f2', boxShadow: '0 4px 20px rgba(15,23,42,0.07)' }}>
            <div className="grid grid-cols-4 text-sm font-bold px-5 py-3.5 text-white"
              style={{ background: 'linear-gradient(90deg, #1e3a8a, #1e40af)' }}>
              <div>विषय</div>
              <div className="text-center">प्रश्न</div>
              <div className="text-center">अंक</div>
              <div className="text-center">%</div>
            </div>
            <div className="px-5 py-2 text-xs font-bold tracking-wide"
              style={{ background: '#eef2ff', color: '#3730a3', borderBottom: '1px solid #e4e9f2' }}>
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
              style={{ background: '#f0f9ff', color: '#0c4a6e', borderBottom: '1px solid #e4e9f2' }}>
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
              style={{ background: '#eff6ff', color: '#1e40af' }}>
              <div>कुल</div>
              <div className="text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>200</div>
              <div className="text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>200</div>
              <div className="text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>100%</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: '#475569' }}>
            <span>⏱ <strong style={{ color: '#1e40af' }}>180 मिनट (3 घंटे)</strong></span>
            <span>⚠️ <strong style={{ color: '#dc2626' }}>-0.25 नकारात्मक अंकन</strong> प्रति गलत उत्तर</span>
            <span>🖥 <strong style={{ color: '#1e40af' }}>CBT मोड</strong></span>
            <span>📝 <strong style={{ color: '#1e40af' }}>हिंदी / अंग्रेजी</strong></span>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: '#eff6ff', color: '#1e40af' }}>विशेषताएँ</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#0f172a' }}>हमारी प्लेटफॉर्म क्यों?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="card flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: f.bg }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold mb-0.5" style={{ color: '#0f172a' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Daily Challenge + Current Affairs side-by-side ── */}
      <section className="py-14 px-4" style={{ background: '#f4f6fb' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Daily Challenge */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white' }}>
            <div className="p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">डेली चैलेंज</h3>
              <p className="text-sm mb-5" style={{ color: '#c4b5fd' }}>
                हर दिन 10 नए प्रश्न — 2 मिनट में पूरा करें। रोज़ का अभ्यास, रोज़ की तरक्की।
              </p>
              <div className="flex items-center gap-3 mb-5">
                {['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'रवि'].map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: i < 5 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)', color: i < 5 ? 'white' : 'rgba(255,255,255,0.4)' }}>
                      {i < 5 ? '✓' : d[0]}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/daily-challenge"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                आज का चैलेंज लें →
              </Link>
            </div>
          </div>

          {/* Current Affairs */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)', color: 'white' }}>
            <div className="p-6">
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
                  <div key={i} className="flex items-start gap-2 text-xs"
                    style={{ color: '#e0f2fe' }}>
                    <span className="mt-0.5 flex-shrink-0" style={{ color: '#38bdf8' }}>•</span>
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/current-affairs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                सभी अपडेट देखें →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Leaderboard ───────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: '#fef9c3', color: '#854d0e' }}>लीडरबोर्ड</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#0f172a' }}>टॉप स्कोरर</h2>
            <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>आप भी इस लिस्ट में आ सकते हैं — अभी टेस्ट दें</p>
          </div>
          <div className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid #e4e9f2', boxShadow: '0 4px 20px rgba(15,23,42,0.07)' }}>
            <div className="grid grid-cols-4 text-xs font-bold px-5 py-3 text-white"
              style={{ background: 'linear-gradient(90deg, #d97706, #f59e0b)' }}>
              <div>रैंक</div>
              <div>नाम</div>
              <div className="text-center">स्कोर</div>
              <div className="text-center">सटीकता</div>
            </div>
            {mockLeaderboard.map((row, i) => (
              <div key={i} className="grid grid-cols-4 px-5 py-3.5 text-sm border-b items-center"
                style={{ background: i === 0 ? '#fffbeb' : i % 2 === 0 ? 'white' : '#fafbff', borderColor: '#f0f4f8' }}>
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-base">{row.badge}</span>
                  <span style={{ color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>#{row.rank}</span>
                </div>
                <div className="font-semibold" style={{ color: '#1e293b' }}>{row.name}</div>
                <div className="text-center font-bold" style={{ color: '#1e40af', fontVariantNumeric: 'tabular-nums' }}>{row.score}/200</div>
                <div className="text-center font-bold" style={{ color: '#16a34a' }}>{row.accuracy}</div>
              </div>
            ))}
            <div className="px-5 py-3 text-center">
              <Link href="/auth/register"
                className="text-sm font-bold"
                style={{ color: '#2563eb' }}>
                रजिस्टर करें और लीडरबोर्ड में जगह बनाएं →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="py-14 px-4 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
        <div className="max-w-xl mx-auto">
          <div className="text-3xl mb-3">🏆</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">आज ही शुरू करें — बिल्कुल निःशुल्क</h2>
          <p className="mb-7" style={{ color: '#bfdbfe' }}>
            रजिस्टर करें और 1500+ PYQ प्रश्नों के साथ MP Patwari 2026 की तैयारी को गंभीरता से शुरू करें।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register"
              className="btn-primary text-base py-3 px-8 justify-center"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 18px rgba(245,158,11,0.45)' }}>
              निःशुल्क रजिस्टर करें
            </Link>
            <Link href="/question-bank" className="btn-ghost text-base">
              📚 PYQ बैंक देखें →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: '#f4f6fb' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0f172a' }}>अक्सर पूछे जाने वाले प्रश्न</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-2xl overflow-hidden"
                style={{ background: 'white', border: `1.5px solid ${openFaq === i ? '#2563eb' : '#e4e9f2'}` }}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 font-semibold text-left"
                  style={{ color: '#1e293b' }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="pr-4 text-sm sm:text-base">{f.q}</span>
                  <span className="text-lg flex-shrink-0 transition-transform"
                    style={{ color: '#2563eb', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: '#475569' }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="py-10 px-4 text-center text-sm" style={{ background: '#0f172a', color: '#94a3b8' }}>
        <div className="max-w-3xl mx-auto">
          <div className="font-bold text-lg mb-2" style={{ color: 'white' }}>MP Patwari Mock Test 2026</div>
          <p className="mb-3 text-sm" style={{ color: '#64748b' }}>
            यह प्लेटफॉर्म MPESB/MPPEB परीक्षा पैटर्न पर आधारित अभ्यास टेस्ट प्रदान करता है।<br />
            यह MPESB का आधिकारिक पोर्टल नहीं है।
          </p>
          <p className="text-xs" style={{ color: '#475569' }}>
            प्रश्न पिछले पैटर्न पर आधारित हैं। आधिकारिक जानकारी के लिए esb.mp.gov.in देखें।
          </p>
          <FooterStats />
        </div>
      </footer>

      {/* ── Sticky Mobile CTA ────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden p-3"
        style={{ background: 'rgba(255,255,255,0.97)', borderTop: '1px solid #e4e9f2', backdropFilter: 'blur(8px)' }}>
        <div className="flex gap-2">
          <Link href="/tests"
            className="flex-1 py-3 rounded-xl font-bold text-sm text-center text-white"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            🚀 टेस्ट दें
          </Link>
          <Link href="/question-bank"
            className="flex-1 py-3 rounded-xl font-bold text-sm text-center"
            style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}>
            📚 PYQ बैंक
          </Link>
        </div>
      </div>

      {/* Padding so sticky CTA doesn't overlap footer on mobile */}
      <div className="h-16 sm:hidden" />
    </div>
  )
}
