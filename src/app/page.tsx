import Link from 'next/link'
import Navbar from '@/components/Navbar'
import FooterStats from '@/components/FooterStats'
import ExamCountdown from '@/components/ExamCountdown'

const examPattern = [
  { subject: 'सामान्य ज्ञान एवं MP GK', questions: 25, marks: 25, color: '#3b82f6' },
  { subject: 'सामान्य हिन्दी',           questions: 15, marks: 15, color: '#8b5cf6' },
  { subject: 'सामान्य गणित',             questions: 20, marks: 20, color: '#f59e0b' },
  { subject: 'सामान्य अंग्रेजी',          questions: 5,  marks: 5,  color: '#10b981' },
  { subject: 'सामान्य तर्कशक्ति',         questions: 15, marks: 15, color: '#ef4444' },
  { subject: 'कंप्यूटर ज्ञान',            questions: 10, marks: 10, color: '#06b6d4' },
  { subject: 'ग्रामीण अर्थव्यवस्था एवं पंचायती राज', questions: 10, marks: 10, color: '#84cc16' },
]

const features = [
  { icon: '📋', bg: '#dbeafe', title: '500+ प्रश्न', desc: 'MPESB पैटर्न पर आधारित उच्च गुणवत्ता प्रश्न बैंक', color: '#1e40af' },
  { icon: '⏱️', bg: '#fef3c7', title: 'रियल टाइमर',  desc: 'वास्तविक परीक्षा जैसा CBT इंटरफेस और टाइमर', color: '#92400e' },
  { icon: '📊', bg: '#dcfce7', title: 'विस्तृत विश्लेषण', desc: 'विषय-वार प्रदर्शन और कमजोर क्षेत्रों की पहचान', color: '#166534' },
  { icon: '🔄', bg: '#f3e8ff', title: 'अभ्यास मोड',  desc: 'प्रत्येक प्रश्न के बाद उत्तर और व्याख्या देखें', color: '#6b21a8' },
  { icon: '📱', bg: '#fee2e2', title: 'मोबाइल फ्रेंडली', desc: 'मोबाइल और डेस्कटॉप दोनों पर बेहतरीन अनुभव', color: '#991b1b' },
  { icon: '🎯', bg: '#e0f2fe', title: 'MP विशेष',    desc: 'मध्यप्रदेश के GK, इतिहास, भूगोल और संस्कृति', color: '#0c4a6e' },
]

const faqs = [
  { q: 'MP Patwari 2026 परीक्षा में कितने प्रश्न होंगे?', a: 'पिछले MPESB पैटर्न के अनुसार कुल 100 प्रश्न होते हैं, प्रत्येक 1 अंक का। कुल अंक 100 और समय 120 मिनट होता है।' },
  { q: 'क्या नकारात्मक अंकन (Negative Marking) है?', a: 'पिछली MP Patwari परीक्षाओं में नकारात्मक अंकन नहीं था। आधिकारिक 2026 अधिसूचना से इसकी पुष्टि करें।' },
  { q: 'मॉक टेस्ट वास्तविक परीक्षा से कितना मिलता-जुलता है?', a: 'हमारे मॉक टेस्ट पिछले MPESB/MPPEB परीक्षाओं के पैटर्न पर आधारित हैं। कठिनाई स्तर, विषय वितरण और प्रश्न शैली समान रखी गई है।' },
  { q: 'क्या मॉक टेस्ट हिंदी में है?', a: 'हाँ, सभी प्रश्न मुख्यतः हिंदी में हैं। कुछ अंग्रेजी और कंप्यूटर प्रश्न अंग्रेजी में भी हो सकते हैं।' },
  { q: 'कितने मॉक टेस्ट उपलब्ध हैं?', a: 'फुल लेंथ मॉक टेस्ट, विषयवार टेस्ट, पिछले वर्ष के पैटर्न पर आधारित टेस्ट और करंट अफेयर्स टेस्ट उपलब्ध हैं।' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white py-16 sm:py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #0c1a4e 0%, #1e3a8a 50%, #1d4ed8 100%)' }}>

        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full" style={{ background: 'rgba(245,158,11,0.08)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: 'rgba(255,255,255,0.02)' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full mb-6 font-bold text-sm px-4 py-1.5"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.3)' }}>
            🆕 MPESB अधिसूचना 2026 — तैयारी शुरू करें
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            MP Patwari 2026<br />
            <span style={{ color: '#fbbf24' }}>मॉक टेस्ट सीरीज</span>
          </h1>

          <p className="text-base sm:text-lg mb-8 max-w-xl mx-auto" style={{ color: '#bfdbfe' }}>
            नवीनतम MPESB पाठ्यक्रम पर आधारित उच्च गुणवत्ता के मॉक टेस्ट — <strong style={{ color: '#fcd34d' }}>बिल्कुल निःशुल्क।</strong>
          </p>

          {/* Countdown */}
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#93c5fd' }}>
              परीक्षा में बचा समय — 22 सितम्बर 2026
            </p>
            <ExamCountdown />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tests" className="btn-primary text-base py-3 px-7 justify-center"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 20px rgba(245,158,11,0.5)' }}>
              🚀 अभी टेस्ट दें
            </Link>
            <Link href="/auth/register" className="btn-ghost text-base">
              निःशुल्क रजिस्टर करें
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { val: '500+', label: 'प्रश्न' },
              { val: '20+',  label: 'मॉक टेस्ट' },
              { val: '7',    label: 'विषय' },
            ].map((s, i) => (
              <div key={i} className="text-center rounded-2xl py-3"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="text-xl sm:text-2xl font-bold" style={{ color: '#fbbf24' }}>{s.val}</div>
                <div className="text-xs" style={{ color: '#93c5fd' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exam Pattern ────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: '#eff6ff', color: '#1e40af' }}>परीक्षा पैटर्न</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: '#0f172a' }}>विषयवार प्रश्न वितरण</h2>
            <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>* पिछले MPESB पैटर्न पर आधारित। 2026 अधिसूचना से आधिकारिक पुष्टि करें।</p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e4e9f2', boxShadow: '0 4px 20px rgba(15,23,42,0.07)' }}>
            <div className="grid grid-cols-4 text-sm font-bold px-5 py-3.5 text-white"
              style={{ background: 'linear-gradient(90deg, #1e3a8a, #1e40af)' }}>
              <div>विषय</div>
              <div className="text-center">प्रश्न</div>
              <div className="text-center">अंक</div>
              <div className="text-center">%</div>
            </div>
            {examPattern.map((s, i) => (
              <div key={i} className="grid grid-cols-4 px-5 py-3 text-sm border-b"
                style={{ background: i % 2 === 0 ? 'white' : '#fafbff', borderColor: '#f0f4f8' }}>
                <div className="flex items-center gap-2 font-medium" style={{ color: '#334155' }}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="truncate">{s.subject}</span>
                </div>
                <div className="text-center font-bold" style={{ color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>{s.questions}</div>
                <div className="text-center font-bold" style={{ color: '#1e293b', fontVariantNumeric: 'tabular-nums' }}>{s.marks}</div>
                <div className="text-center" style={{ color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>{s.marks}%</div>
              </div>
            ))}
            <div className="grid grid-cols-4 px-5 py-3.5 font-bold text-sm"
              style={{ background: '#eff6ff', color: '#1e40af' }}>
              <div>कुल</div>
              <div className="text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>100</div>
              <div className="text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>100</div>
              <div className="text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>100%</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: '#475569' }}>
            <span>⏱ <strong style={{ color: '#1e40af' }}>120 मिनट</strong></span>
            <span>❌ <strong style={{ color: '#16a34a' }}>नकारात्मक अंक नहीं</strong> (पिछले पैटर्न अनुसार)</span>
            <span>🖥 <strong style={{ color: '#1e40af' }}>CBT मोड</strong></span>
            <span>📝 <strong style={{ color: '#1e40af' }}>हिंदी / अंग्रेजी</strong></span>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="py-16 px-4" style={{ background: '#f4f6fb' }}>
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

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section className="py-14 px-4 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
        <div className="max-w-xl mx-auto">
          <div className="text-3xl mb-3">🏆</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">आज ही शुरू करें — बिल्कुल निःशुल्क</h2>
          <p className="mb-7" style={{ color: '#bfdbfe' }}>रजिस्टर करें और 500+ प्रश्नों के साथ MP Patwari 2026 की तैयारी को गंभीरता से शुरू करें।</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register" className="btn-primary text-base py-3 px-8 justify-center"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 18px rgba(245,158,11,0.45)' }}>
              निःशुल्क रजिस्टर करें
            </Link>
            <Link href="/tests" className="btn-ghost text-base">
              टेस्ट देखें →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0f172a' }}>अक्सर पूछे जाने वाले प्रश्न</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="rounded-2xl overflow-hidden group"
                style={{ background: '#fafbff', border: '1.5px solid #e4e9f2' }}>
                <summary className="flex items-center justify-between px-5 py-4 font-semibold cursor-pointer select-none list-none"
                  style={{ color: '#1e293b' }}>
                  <span className="pr-4">{f.q}</span>
                  <span className="text-lg flex-shrink-0 transition-transform group-open:rotate-45"
                    style={{ color: '#2563eb' }}>+</span>
                </summary>
                <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: '#475569' }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="py-10 px-4 text-center text-sm" style={{ background: '#0f172a', color: '#94a3b8' }}>
        <div className="max-w-3xl mx-auto">
          <div className="font-bold text-lg mb-2" style={{ color: 'white' }}>MP Patwari Mock Test 2026</div>
          <p className="mb-3 text-sm" style={{ color: '#64748b' }}>
            यह प्लेटफॉर्म MPESB/MPPEB परीक्षा पैटर्न पर आधारित अभ्यास टेस्ट प्रदान करता है।<br />यह MPESB का आधिकारिक पोर्टल नहीं है।
          </p>
          <p className="text-xs" style={{ color: '#475569' }}>
            प्रश्न पिछले पैटर्न पर आधारित हैं। आधिकारिक जानकारी के लिए esb.mp.gov.in देखें।
          </p>
          <FooterStats />
        </div>
      </footer>
    </div>
  )
}
