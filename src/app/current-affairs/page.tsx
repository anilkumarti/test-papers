import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase, mapTest } from '@/lib/supabase'

const CA_FACTS = [
  {
    category: '🏛️ MP सरकार 2024-25', color: '#1d4ed8', bg: '#eff6ff',
    facts: [
      'मुख्यमंत्री: डॉ. मोहन यादव (दिसंबर 2023 से)',
      'राज्यपाल: मनसुखभाई मंडाविया',
      'विधानसभा: 230 सीटें | BJP बहुमत में',
      'लोकसभा 2024: BJP ने 29/29 सीटें जीतीं (MP में)',
      'MP में 55 जिले, 10 संभाग | तहसीलें: 342+',
      'MP Patwari 2026: 2306 रिक्तियाँ, MPPEB द्वारा भर्ती',
      'परीक्षा: 200 प्रश्न, 3 घंटे, 0.25 नेगेटिव मार्किंग',
    ],
  },
  {
    category: '💰 MP बजट 2025-26', color: '#0369a1', bg: '#f0f9ff',
    facts: [
      'कुल बजट: ₹4.21 लाख करोड़ (15% वृद्धि) — कोई नया कर नहीं',
      'लाडली बहना योजना: ₹18,669 करोड़ आवंटित',
      'अवसंरचना (Infrastructure): ₹70,515 करोड़ (बजट का 17%)',
      'नगरीय व ग्रामीण विकास: ₹51,074 करोड़',
      'जल जीवन मिशन: ₹17,135 करोड़ | ऊर्जा क्षेत्र: ₹19,000 करोड़',
      'सिंहस्थ 2028 की तैयारी: ₹2,005 करोड़ (उज्जैन)',
      'CM किसान सहायता: ₹5,220 करोड़ | 3 लाख रोजगार लक्ष्य',
    ],
  },
  {
    category: '📋 सरकारी योजनाएँ (MP+केंद्र)', color: '#15803d', bg: '#f0fdf4',
    facts: [
      'लाडली बहना योजना: पात्र महिलाओं को ₹1250/माह',
      'गरीब कल्याण मिशन: 2028 तक बहुआयामी गरीबी उन्मूलन लक्ष्य',
      'बीमा सखी योजना (दिसं 2024): LIC एजेंट महिलाओं को ₹7000/6000/5000 (3 वर्ष)',
      'Semiconductor Policy 2025 (MP): 50% पूंजी सब्सिडी',
      'सूर्य घर योजना: रूफटॉप सोलर — 1 करोड़ घर',
      'PM धन-धान्य कृषि योजना (केंद्र): 100 जिलों में उत्पादकता वृद्धि',
      'PM-KISAN: ₹6000/वर्ष | PMFBY: फसल बीमा | KCC: कृषि ऋण',
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
    category: '🇮🇳 राष्ट्रीय घटनाएँ 2024-25', color: '#b91c1c', bg: '#fff1f2',
    facts: [
      'PM: नरेंद्र मोदी (जून 2024 से तीसरा कार्यकाल)',
      'राष्ट्रपति: द्रौपदी मुर्मू (2022 से) | उपराष्ट्रपति: जगदीप धनखड़',
      'लोकसभा 2024: NDA 293 सीटें | BJP 240 सीटें | कुल 543',
      'G20 Presidency 2023: भारत की अध्यक्षता — New Delhi Summit',
      'G20 2024: Brazil | G20 2025: South Africa की अध्यक्षता',
      'SCO Summit 2023: नई दिल्ली | COP28 2023: दुबई',
      'भारत का संविधान: 75वाँ वर्ष 2024 में (26 Nov 1949 से)',
    ],
  },
  {
    category: '📊 केंद्रीय बजट 2025-26', color: '#6d28d9', bg: '#faf5ff',
    facts: [
      'वित्त मंत्री: निर्मला सीतारमण | प्रस्तुत: 1 फरवरी 2025',
      'कुल व्यय: ₹50.65 लाख करोड़ | राजकोषीय घाटा: GDP का 4.4%',
      'पूंजीगत व्यय: ₹11.21 लाख करोड़ (GDP का 3.1%)',
      '4 स्तंभ: कृषि, MSME, निवेश, निर्यात',
      'PM धन-धान्य कृषि योजना: 100 जिलों में उत्पादकता वृद्धि',
      'Income Tax: ₹12 लाख तक शून्य कर (नई व्यवस्था में)',
      '36 दुर्लभ जीवन-रक्षक दवाएं शुल्क-मुक्त | EV हेतु कर छूट',
    ],
  },
  {
    category: '🚀 ISRO व विज्ञान-तकनीक', color: '#0e7490', bg: '#ecfeff',
    facts: [
      'Chandrayaan-3: 23 अगस्त 2023 — चंद्रमा के दक्षिणी ध्रुव पर लैंडिंग',
      'विक्रम लैंडर व प्रज्ञान रोवर — भारत चाँद पर उतरने वाला 4th देश',
      'Aditya-L1: सूर्य मिशन — L1 बिंदु पर 6 जनवरी 2024',
      'XPoSat (1 जन 2024): X-ray खगोल विज्ञान — ऐसा करने वाला दूसरा देश',
      'Chandrayaan-3 टीम को IAF World Space Award 2024 (मिलान)',
      'Chandrayaan-4 व Venus Orbit Mission (VOM): कैबिनेट मंजूरी 2024',
      'Gaganyaan: मानव अंतरिक्ष उड़ान मिशन — uncrewed test phase',
      'NISAR: NASA+ISRO संयुक्त पृथ्वी निगरानी उपग्रह',
    ],
  },
  {
    category: '🏆 पुरस्कार व सम्मान 2024-25', color: '#92400e', bg: '#fef3c7',
    facts: [
      '★ भारत रत्न 2024 (5 व्यक्ति):',
      'LK आडवाणी | डॉ. M S स्वामीनाथन (मरणोपरांत)',
      'कर्पूरी ठाकुर, चौ. चरण सिंह, PV नरसिम्हा राव (मरणोपरांत)',
      '★ पद्म विभूषण 2025: L सुब्रमण्यम, JS खेहर, MT वासुदेवन नायर, शारदा सिन्हा',
      'पद्म श्री 2025: अरिजीत सिंह, रिकी केज (तीन बार Grammy), हर्विंदर सिंह',
      '★ खेल पुरस्कार 2024: मेजर ध्यानचंद खेल रत्न, अर्जुन, द्रोणाचार्य',
      'Paris Olympics 2024: भारत 6 पदक — Neeraj Chopra रजत (Javelin)',
    ],
  },
  {
    category: '🌍 भारत की उपलब्धियाँ 2024-25', color: '#166534', bg: '#f0fdf4',
    facts: [
      'GDP: भारत 5th सबसे बड़ी अर्थव्यवस्था (2024) | लक्ष्य: 3rd by 2030',
      'रक्षा उत्पादन: ₹1.80 लाख करोड़ (2025-26) — 2014 में ₹46,000 करोड़ था',
      'रक्षा निर्यात: ₹39,000 करोड़ (2025-26) — 2014 में ₹1,000 करोड़ से कम',
      'UPI लेनदेन 2024: 13,000 करोड़ से अधिक — दुनिया में सबसे अधिक',
      'भारत 100+ देशों में UPI निर्यात | G20, BRICS, SCO में सक्रिय',
      'Startup India: 1.18 लाख+ recognized startups | 3rd सबसे बड़ा ecosystem',
      'India@100 विजन: 2047 तक विकसित भारत (Viksit Bharat) लक्ष्य',
    ],
  },
  {
    category: '📰 MP — परीक्षा उपयोगी तथ्य', color: '#be185d', bg: '#fdf2f8',
    facts: [
      'MPESB (MP Employee Selection Board): पटवारी परीक्षा आयोजक',
      'परीक्षा संरचना: Part A + Part B | 200 MCQ | 3 घंटे',
      'विषय: GK, हिंदी, गणित, English, कंप्यूटर, Reasoning, ग्रामीण अर्थव्यवस्था',
      'MP का राजकीय पशु: बारहसिंगा | पक्षी: दूधराज (Paradise Flycatcher)',
      'MP का राजकीय फूल: सफेद लिली | वृक्ष: बरगद',
      'MP का राजकीय नृत्य: राई (बुंदेलखंड) | संगीत: लोकगीत',
      'खजुराहो नृत्य महोत्सव: फरवरी में | उज्जैन कुंभ: 2028 (सिंहस्थ)',
      'MP का स्थापना दिवस: 1 नवंबर (राज्य दिवस के रूप में मनाया)',
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
