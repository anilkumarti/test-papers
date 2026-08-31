import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase, mapTest } from '@/lib/supabase'

const CA_FACTS = [
  {
    category: '🏛️ MP सरकार', color: '#1d4ed8', bg: '#eff6ff',
    facts: [
      'मुख्यमंत्री: डॉ. मोहन यादव (दिसंबर 2023 से)',
      'राज्यपाल: मनसुखभाई मंडाविया',
      'विधानसभा: 230 सीटें | BJP बहुमत में',
      'लोकसभा 2024: BJP ने 29/29 सीटें जीतीं (MP में)',
      'MP में 55 जिले, 10 संभाग',
    ],
  },
  {
    category: '📋 सरकारी योजनाएँ', color: '#15803d', bg: '#f0fdf4',
    facts: [
      'लाडली बहना योजना: पात्र महिलाओं को ₹1250/माह',
      'मुख्यमंत्री किसान कल्याण: ₹4000/वर्ष अतिरिक्त',
      'PM-KISAN: ₹6000/वर्ष (₹2000 × 3 किस्त)',
      'CM Rise Schools: उत्कृष्ट विद्यालय परियोजना',
      'जन-सेवा केंद्र: एक खिड़की सरकारी सेवा',
      'मुख्यमंत्री मेधावी विद्यार्थी योजना: उच्च शिक्षा सहायता',
    ],
  },
  {
    category: '🌾 कृषि व ग्रामीण', color: '#b45309', bg: '#fffbeb',
    facts: [
      'MP सोयाबीन उत्पादन में देश में प्रथम',
      'गेहूँ: रबी की प्रमुख फसल — MP दूसरा बड़ा उत्पादक',
      'PMFBY: न्यूनतम प्रीमियम पर फसल बीमा',
      'MGNREGA: 100 दिन रोजगार गारंटी',
      'Nal Jal Yojana: हर घर नल से जल',
      'KCC (किसान क्रेडिट कार्ड): अल्पकालीन कृषि ऋण',
    ],
  },
  {
    category: '🗺️ MP भूगोल व अर्थव्यवस्था', color: '#7c3aed', bg: '#faf5ff',
    facts: [
      'क्षेत्रफल: 3,08,252 km² (देश में द्वितीय)',
      'नर्मदा नदी: MP की सबसे लंबी नदी (1312 km)',
      'धूपगढ़: MP की सबसे ऊँची चोटी (1350m, पचमढ़ी)',
      'MP GSDP: लगभग ₹13 लाख करोड़ (2024-25)',
      'टाइगर रिजर्व: 6 (कान्हा, बांधवगढ़, पेंच, सतपुड़ा, पन्ना, संजय-डुबरी)',
      'MP को "हार्ट ऑफ इंडिया" और "टाइगर स्टेट" कहते हैं',
    ],
  },
  {
    category: '⚖️ संविधान व राजव्यवस्था', color: '#0e7490', bg: '#ecfeff',
    facts: [
      '73वाँ संशोधन 1992: पंचायती राज को संवैधानिक दर्जा',
      'अनुच्छेद 243: ग्राम पंचायत का प्रावधान',
      '11वीं अनुसूची: 29 विषय पंचायत को सौंपे गए',
      'पटवारी: राजस्व विभाग का ग्राम स्तरीय कर्मचारी',
      'MPESB (मध्यप्रदेश कर्मचारी चयन मंडल): परीक्षा आयोजक',
      'पटवारी परीक्षा: 100 प्रश्न, 2 घंटे, 0.25 नेगेटिव मार्किंग',
    ],
  },
  {
    category: '🇮🇳 राष्ट्रीय घटनाएँ', color: '#b91c1c', bg: '#fff1f2',
    facts: [
      'PM: नरेंद्र मोदी (जून 2024 से तीसरा कार्यकाल)',
      'राष्ट्रपति: द्रौपदी मुर्मू (2022 से)',
      'उपराष्ट्रपति: जगदीप धनखड़',
      'लोकसभा 2024: NDA 293 सीटें | कुल 543 सीटें',
      'भारत का संविधान: 26 जनवरी 1950 को लागू',
      'G20 शिखर सम्मेलन 2023: नई दिल्ली में आयोजित',
    ],
  },
]

async function getCATests() {
  try {
    const { data } = await supabase
      .from('mock_tests')
      .select('*, test_attempts(id)')
      .eq('is_published', true)
      .eq('is_active', true)
      .eq('type', 'CURRENT_AFFAIRS')
      .order('created_at', { ascending: false })

    return (data ?? []).map((t: any) => {
      const { test_attempts, ...rest } = t
      return { ...mapTest(rest), _count: { attempts: test_attempts?.length ?? 0 } }
    })
  } catch { return [] }
}

export default async function CurrentAffairsPage() {
  const caTests = await getCATests()

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      {/* Hero */}
      <div className="py-10 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)' }}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-3"
          style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
          📰 CURRENT AFFAIRS
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">करेंट अफेयर्स</h1>
        <p className="text-sm max-w-xl mx-auto" style={{ color: '#93c5fd' }}>
          MP Patwari 2026 परीक्षा के लिए महत्वपूर्ण समसामयिक घटनाएँ, योजनाएँ, और तथ्य
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* CA Tests from DB */}
        {caTests.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1e293b' }}>📝 करेंट अफेयर्स टेस्ट</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {caTests.map((test: any) => (
                <div key={test.id} className="rounded-2xl p-5"
                  style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#1e293b' }}>{test.titleHi || test.title}</p>
                      {test.descriptionHi && <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{test.descriptionHi}</p>}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2"
                      style={{ background: '#fef3c7', color: '#b45309' }}>
                      {test._count.attempts} attempts
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs mb-4" style={{ color: '#64748b' }}>
                    <span>📋 {test.totalQuestions} प्रश्न</span>
                    <span>⏱ {test.duration} मिनट</span>
                    <span>🏆 {test.totalMarks} अंक</span>
                  </div>
                  <Link href={`/tests/${test.id}`}
                    className="block text-center py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={{ background: '#1d4ed8', color: '#fff' }}>
                    टेस्ट दें →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Static Important Facts */}
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1e293b' }}>
          ⭐ परीक्षा के लिए महत्वपूर्ण तथ्य
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {CA_FACTS.map((section, si) => (
            <div key={si} className="rounded-2xl overflow-hidden"
              style={{ background: '#fff', border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div className="px-5 py-3 flex items-center gap-2"
                style={{ background: section.bg, borderBottom: `1px solid ${section.color}22` }}>
                <span className="font-bold text-sm" style={{ color: section.color }}>{section.category}</span>
              </div>
              <ul className="divide-y" style={{ borderColor: '#f8fafc' }}>
                {section.facts.map((fact, fi) => (
                  <li key={fi} className="px-5 py-2.5 text-sm flex items-start gap-2"
                    style={{ color: '#334155', background: fi % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <span className="flex-shrink-0 mt-0.5" style={{ color: section.color }}>›</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 rounded-xl p-4 text-center text-sm"
          style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e' }}>
          💡 यह सामग्री MP Patwari 2026 परीक्षा के संभावित पाठ्यक्रम पर आधारित है। आधिकारिक जानकारी के लिए esb.mp.gov.in देखें।
        </div>
      </div>
    </div>
  )
}
