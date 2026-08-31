import Link from 'next/link'
import Navbar from '@/components/Navbar'
import FooterStats from '@/components/FooterStats'

const examPattern = [
  { subject: 'सामान्य ज्ञान एवं MP GK', hi: 'Samanya Gyan', questions: 25, marks: 25, color: '#3b82f6' },
  { subject: 'सामान्य हिन्दी', hi: 'Samanya Hindi', questions: 15, marks: 15, color: '#8b5cf6' },
  { subject: 'सामान्य गणित', hi: 'Samanya Ganit', questions: 20, marks: 20, color: '#f59e0b' },
  { subject: 'सामान्य अंग्रेजी', hi: 'General English', questions: 5, marks: 5, color: '#10b981' },
  { subject: 'सामान्य तर्कशक्ति', hi: 'Reasoning', questions: 15, marks: 15, color: '#ef4444' },
  { subject: 'कंप्यूटर ज्ञान', hi: 'Computer', questions: 10, marks: 10, color: '#06b6d4' },
  { subject: 'ग्रामीण अर्थव्यवस्था एवं पंचायती राज', hi: 'Rural Economy', questions: 10, marks: 10, color: '#84cc16' },
]

const features = [
  { icon: '📋', title: '500+ प्रश्न', desc: 'MPESB पैटर्न पर आधारित उच्च गुणवत्ता प्रश्न बैंक' },
  { icon: '🕐', title: 'रियल टाइमर', desc: 'वास्तविक परीक्षा जैसा CBT इंटरफेस और टाइमर' },
  { icon: '📊', title: 'विस्तृत विश्लेषण', desc: 'विषय-वार प्रदर्शन और कमजोर क्षेत्रों की पहचान' },
  { icon: '🔄', title: 'अभ्यास मोड', desc: 'प्रत्येक प्रश्न के बाद उत्तर और व्याख्या देखें' },
  { icon: '📱', title: 'मोबाइल फ्रेंडली', desc: 'मोबाइल और डेस्कटॉप दोनों पर बेहतरीन अनुभव' },
  { icon: '🎯', title: 'MP विशेष', desc: 'मध्यप्रदेश के GK, इतिहास, भूगोल और संस्कृति' },
]

const faqs = [
  { q: 'MP Patwari 2026 परीक्षा में कितने प्रश्न होंगे?', a: 'पिछले MPESB पैटर्न के अनुसार कुल 100 प्रश्न होते हैं, प्रत्येक 1 अंक का। कुल अंक 100 और समय 120 मिनट होता है।' },
  { q: 'क्या नकारात्मक अंकन (Negative Marking) है?', a: 'पिछली MP Patwari परीक्षाओं में नकारात्मक अंकन नहीं था। आधिकारिक 2026 अधिसूचना से इसकी पुष्टि करें।' },
  { q: 'मॉक टेस्ट वास्तविक परीक्षा से कितना मिलता-जुलता है?', a: 'हमारे मॉक टेस्ट पिछले MPESB/MPPEB परीक्षाओं के पैटर्न पर आधारित हैं। प्रश्न वास्तविक परीक्षा के प्रश्न नहीं हैं, परंतु कठिनाई स्तर, विषय वितरण और प्रश्न शैली समान रखी गई है।' },
  { q: 'क्या मॉक टेस्ट हिंदी में है?', a: 'हाँ, सभी प्रश्न मुख्यतः हिंदी में हैं। कुछ अंग्रेजी और कंप्यूटर प्रश्न अंग्रेजी में भी हो सकते हैं।' },
  { q: 'कितने मॉक टेस्ट उपलब्ध हैं?', a: 'फुल लेंथ मॉक टेस्ट, विषयवार टेस्ट, पिछले वर्ष के पैटर्न पर आधारित टेस्ट और करंट अफेयर्स टेस्ट उपलब्ध हैं।' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🆕 MP Patwari 2026 | MPESB पैटर्न पर आधारित
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            MP Patwari 2026<br />
            <span className="text-amber-400">मॉक टेस्ट सीरीज</span>
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            नवीनतम पाठ्यक्रम और MPESB परीक्षा ट्रेंड्स के आधार पर तैयार किए गए उच्च गुणवत्ता के मॉक टेस्ट से तैयारी करें।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tests" className="btn-primary text-lg py-3 px-8 justify-center">
              🚀 अभी टेस्ट दें
            </Link>
            <Link href="/auth/register" className="btn-secondary text-lg py-3 px-8 justify-center bg-transparent border-white text-white hover:bg-white hover:text-blue-800">
              निःशुल्क रजिस्टर करें
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="text-center"><div className="text-2xl font-bold text-amber-400">500+</div><div className="text-blue-200 text-sm">प्रश्न</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-amber-400">10+</div><div className="text-blue-200 text-sm">मॉक टेस्ट</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-amber-400">7</div><div className="text-blue-200 text-sm">विषय</div></div>
          </div>
        </div>
      </section>

      {/* Exam Pattern */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">परीक्षा पैटर्न</h2>
            <p className="text-slate-500 text-sm">* पिछले MPESB पैटर्न पर आधारित। 2026 अधिसूचना से आधिकारिक पुष्टि करें।</p>
          </div>
          <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
            <div className="grid grid-cols-4 bg-blue-800 text-white text-sm font-semibold px-6 py-3">
              <div>विषय</div>
              <div className="text-center">प्रश्न</div>
              <div className="text-center">अंक</div>
              <div className="text-center">प्रतिशत</div>
            </div>
            {examPattern.map((s, i) => (
              <div key={i} className={`grid grid-cols-4 px-6 py-3.5 text-sm border-b border-slate-200 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-2 font-medium text-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }}></div>
                  {s.subject}
                </div>
                <div className="text-center font-semibold text-slate-800">{s.questions}</div>
                <div className="text-center font-semibold text-slate-800">{s.marks}</div>
                <div className="text-center text-slate-600">{s.marks}%</div>
              </div>
            ))}
            <div className="grid grid-cols-4 px-6 py-3.5 bg-blue-50 font-bold text-blue-800 text-sm border-t-2 border-blue-200">
              <div>कुल</div>
              <div className="text-center">100</div>
              <div className="text-center">100</div>
              <div className="text-center">100%</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-2"><span className="text-green-600 font-semibold">⏱ समय:</span> 120 मिनट</span>
            <span className="flex items-center gap-2"><span className="text-green-600 font-semibold">❌ नकारात्मक अंक:</span> नहीं (पिछले पैटर्न अनुसार)</span>
            <span className="flex items-center gap-2"><span className="text-green-600 font-semibold">📝 माध्यम:</span> हिंदी / अंग्रेजी</span>
            <span className="flex items-center gap-2"><span className="text-green-600 font-semibold">🖥 मोड:</span> CBT (ऑनलाइन)</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">हमारी प्लेटफॉर्म की विशेषताएँ</h2>
            <p className="text-slate-500">सीरियस MP Patwari प्रतियोगी के लिए</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-slate-800 mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">आज ही शुरू करें — बिल्कुल निःशुल्क</h2>
          <p className="text-blue-200 mb-8">रजिस्टर करें और MP Patwari 2026 की तैयारी को गंभीरता से शुरू करें।</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary bg-amber-500 hover:bg-amber-600 text-lg py-3 px-8 justify-center">
              निःशुल्क रजिस्टर करें
            </Link>
            <Link href="/tests" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-blue-800 text-lg py-3 px-8 justify-center">
              टेस्ट देखें
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">अक्सर पूछे जाने वाले प्रश्न</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="card cursor-pointer group">
                <summary className="font-semibold text-slate-800 list-none flex items-center justify-between">
                  {f.q}
                  <span className="text-blue-600 text-xl">+</span>
                </summary>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 text-center text-sm">
        <div className="max-w-4xl mx-auto">
          <div className="font-bold text-white text-lg mb-2">MP Patwari Mock Test 2026</div>
          <p className="mb-4 text-slate-500">यह प्लेटफॉर्म MPESB/MPPEB परीक्षा पैटर्न पर आधारित अभ्यास टेस्ट प्रदान करता है। यह MPESB का आधिकारिक पोर्टल नहीं है।</p>
          <p className="text-xs text-slate-600">प्रश्न पिछले पैटर्न पर आधारित हैं। 2026 के वास्तविक प्रश्न नहीं हैं। आधिकारिक जानकारी के लिए esb.mp.gov.in देखें।</p>
          <FooterStats />
        </div>
      </footer>
    </div>
  )
}
