import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

type Q = [string,string,string,string,string,'A'|'B'|'C'|'D',string,'EASY'|'MEDIUM'|'HARD']

// ─── PAPER 6: भारत करंट अफेयर्स जून–अगस्त 2026 ─────────────────────────────

const caP6: Q[] = [
  ["FIFA विश्व कप 2026 का विजेता देश कौन रहा?","ब्राजील","अर्जेंटीना","स्पेन","फ्रांस","C","current_affairs","EASY"],
  ["FIFA विश्व कप 2026 में कुल कितनी टीमों ने भाग लिया?","32","40","48","64","C","current_affairs","EASY"],
  ["FIFA विश्व कप 2026 का फाइनल मैच कब खेला गया?","12 जुलाई 2026","15 जुलाई 2026","20 जुलाई 2026","25 जुलाई 2026","C","current_affairs","MEDIUM"],
  ["BWF विश्व बैडमिंटन चैंपियनशिप 2026 का आयोजन किस भारतीय शहर में हुआ?","मुंबई","नई दिल्ली","बेंगलुरु","हैदराबाद","B","current_affairs","MEDIUM"],
  ["BWF विश्व चैंपियनशिप 2026 किस स्थल पर आयोजित हुई?","जवाहरलाल नेहरू स्टेडियम","इंदिरा गांधी एरेना","DP World Sports Centre","CWG विलेज","B","current_affairs","MEDIUM"],
  ["भारत में BWF विश्व चैंपियनशिप 2009 के बाद पहली बार किस वर्ष हुई?","2024","2025","2026","2027","C","current_affairs","EASY"],
  ["PM मोदी को जून 2026 में किस देश का सर्वोच्च सम्मान प्राप्त हुआ?","पोलैंड","स्लोवाकिया","हंगरी","ऑस्ट्रिया","B","current_affairs","MEDIUM"],
  ["PM मोदी को जुलाई 2026 में किस देश का सर्वोच्च नागरिक सम्मान मिला?","सिंगापुर","मलेशिया","इंडोनेशिया","थाईलैंड","C","current_affairs","MEDIUM"],
  ["'Guardian of the Blue Horizon' सम्मान PM मोदी को किस देश ने दिया?","मॉरीशस","सेशेल्स","मालदीव","श्रीलंका","B","current_affairs","MEDIUM"],
  ["जुलाई 2026 में मालदीव की किस इंस्टेंट पेमेंट प्रणाली को भारत के UPI से जोड़ा गया?","MobiCash","Favara","m-Faisaisa","PayMV","B","current_affairs","HARD"],
  ["ADB ने जुलाई 2026 में भारत के शहरी सुधार हेतु कितने अमेरिकी डॉलर का ऋण मंजूर किया?","50 करोड़","75 करोड़","1 अरब (1 बिलियन)","1.5 अरब","C","current_affairs","MEDIUM"],
  ["16वीं BRICS कृषि मंत्रियों की बैठक जून 2026 में किस शहर में हुई?","भोपाल","नई दिल्ली","इंदौर","मुंबई","C","current_affairs","MEDIUM"],
  ["कॉमनवेल्थ गेम्स 2026 कब से कब तक आयोजित हुए?","10-25 जुलाई","23 जुलाई - 2 अगस्त","1-15 अगस्त","5-20 अगस्त","B","current_affairs","MEDIUM"],
  ["FIH हॉकी महिला विश्व कप 2026 का आयोजन किन देशों में हुआ?","भारत और पाकिस्तान","बेल्जियम और नीदरलैंड","जर्मनी और ऑस्ट्रिया","ऑस्ट्रेलिया और न्यूजीलैंड","B","current_affairs","MEDIUM"],
  ["IIP (औद्योगिक उत्पादन सूचकांक) जून 2026 में 7.3% की वृद्धि, यह कितने महीनों में सर्वाधिक था?","12 महीने","18 महीने","23 महीने","30 महीने","C","current_affairs","HARD"],
  ["ICRA के अनुसार भारत का FY27 GDP वृद्धि अनुमान क्या है?","6.2%","6.5%","6.7%","7.2%","C","current_affairs","MEDIUM"],
  ["अगस्त 2026 में Cabinet द्वारा स्वीकृत 'खेलो इंडिया' योजना का कुल आवंटन कितना है?","₹15,000 करोड़","₹25,000 करोड़","₹36,441 करोड़","₹50,000 करोड़","C","current_affairs","MEDIUM"],
  ["'समुद्र मंथन' राष्ट्रीय अपतटीय अन्वेषण योजना का बजट आवंटन क्या है?","₹50,000 करोड़","₹84,084 करोड़","₹1,00,000 करोड़","₹60,000 करोड़","B","current_affairs","HARD"],
  ["PM-KISAN योजना को कब तक जारी रखने की कैबिनेट ने मंजूरी दी?","2027-28","2028-29","2029-30","2030-31","D","current_affairs","MEDIUM"],
  ["अगस्त 2026 में RBI के केंद्रीय बोर्ड में पार्ट-टाइम डायरेक्टर किन्हें नियुक्त किया गया?","एस. सोमनाथ और आनंद महिंद्रा","मुकेश अंबानी और रतन टाटा","कुमार मंगलम बिड़ला और एन. चंद्रशेखरन","नारायण मूर्ति और सुनील मित्तल","A","current_affairs","HARD"],
]

// ─── PAPER 7: MP और राष्ट्रीय करंट अफेयर्स 2026 ────────────────────────────

const caP7: Q[] = [
  ["मध्यप्रदेश सरकार ने MeitY के किस विभाग के साथ बहुभाषी AI सेवाओं के लिए MoU हस्ताक्षरित किया?","ISRO","BHASHINI विभाग","C-DAC","NIC","B","current_affairs","MEDIUM"],
  ["MPESB पटवारी भर्ती 2026 में 200 पद किस विशेष श्रेणी के लिए हैं?","महिलाएं","भूतपूर्व सैनिक","दिव्यांगजन (PwD)","OBC","C","current_affairs","MEDIUM"],
  ["MP की 'क्षेत्रीय AI इम्पैक्ट कॉन्फ्रेंस 2026' किस शहर में आयोजित हुई?","इंदौर","जबलपुर","भोपाल","ग्वालियर","C","current_affairs","MEDIUM"],
  ["भारत ने 2026 में श्रीहरिकोटा से कितने सफल लॉन्च का ऐतिहासिक मील पत्थर पार किया?","75","90","100","125","C","current_affairs","MEDIUM"],
  ["IMF में भारत का 'Senior Adviser to Executive Director' किसे नियुक्त किया गया?","राहुल जैन","अजय सेठ","शक्तिकांत दास","संजय मल्होत्रा","A","current_affairs","HARD"],
  ["सुप्रीम कोर्ट ने 2026 में किस आयोग की अनुशंसात्मक शक्तियों को स्पष्ट किया?","राष्ट्रीय अनुसूचित जनजाति आयोग","राष्ट्रीय अनुसूचित जाति आयोग (NCSC)","राष्ट्रीय महिला आयोग","राष्ट्रीय पिछड़ा वर्ग आयोग","B","current_affairs","HARD"],
  ["जून 2026 में किस राज्य ने IBM के साथ 'Amaravati Quantum and AI Innovation Centre' लॉन्च किया?","तेलंगाना","कर्नाटक","आंध्रप्रदेश","तमिलनाडु","C","current_affairs","MEDIUM"],
  ["नेपाल के किस विदेश मंत्री ने जून 2026 में भारत की 3 दिवसीय यात्रा की?","नारायण काजी श्रेष्ठ","शिशिर खनाल","प्रदीप कुमार ग्यावली","नारायण प्रकाश सौद","B","current_affairs","HARD"],
  ["भारतीय तटरक्षक बल को जून 2026 में पहला स्वदेशी किस प्रकार का वाहन सौंपा गया?","हेलीकॉप्टर","Air Cushion Vehicle (ACV)","पनडुब्बी","गश्ती जहाज","B","current_affairs","MEDIUM"],
  ["'PM Surya Sarovar Yojana' किससे संबंधित है?","सिंचाई जलाशय","फ्लोटिंग सोलर ऊर्जा","पेयजल आपूर्ति","जलविद्युत परियोजना","B","current_affairs","MEDIUM"],
  ["PM-KISAN योजना के तहत किसानों को प्रति वर्ष कितनी राशि मिलती है?","₹4,000","₹6,000","₹8,000","₹10,000","B","current_affairs","EASY"],
  ["भारत का FY26 GDP वृद्धि दर ICRA के अनुसार कितनी रही?","6.5%","7.2%","7.7%","8.2%","C","current_affairs","MEDIUM"],
  ["जुलाई 2026 में भारत की किस राज्य सरकार ने मधुमक्खी पालन मिशन की घोषणा की? (MP)","मध्यप्रदेश","राजस्थान","उत्तरप्रदेश","महाराष्ट्र","A","current_affairs","HARD"],
  ["BRICS 2026 में भारत की अध्यक्षता के दौरान BRICS का कितना विस्तार हुआ?","2 नए सदस्य","5 नए सदस्य","कोई नहीं","3 नए सदस्य","B","current_affairs","HARD"],
  ["FPI (विदेशी पोर्टफोलियो निवेशक) को किस क्षेत्र में अधिक भागीदारी के लिए वित्त मंत्रालय ने 2026 में सुधार किए?","शेयर बाजार","म्युचुअल फंड","सरकारी प्रतिभूति (G-Secs) बाजार","बीमा","C","current_affairs","MEDIUM"],
  ["भारत का 80वाँ स्वतंत्रता दिवस किस वर्ष मनाया गया?","2024","2025","2026","2027","C","current_affairs","EASY"],
  ["MP पटवारी परीक्षा 2026 के लिए आवेदन की अंतिम तिथि कब थी?","10 अगस्त 2026","15 अगस्त 2026","21 अगस्त 2026","31 अगस्त 2026","C","current_affairs","MEDIUM"],
  ["MP में 'विक्रमोत्सव' सांस्कृतिक महोत्सव किस शहर में आयोजित होता है?","भोपाल","इंदौर","उज्जैन","ग्वालियर","C","current_affairs","MEDIUM"],
  ["राष्ट्रीय खेल पुरस्कार 2025 की घोषणा किस दिन की गई?","15 अगस्त 2026","18 अगस्त 2026","29 अगस्त 2026","5 सितंबर 2026","C","current_affairs","MEDIUM"],
  ["स्वतंत्रता दिवस 2026 पर राष्ट्रपति द्वारा अनुमोदित वीरता पुरस्कारों की संख्या कितनी थी?","50","65","78","90","C","current_affairs","MEDIUM"],
]

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🗞️  Seeding 2 Current Affairs 2026 papers (June–Aug 2026)...\n')

  const { data: subs } = await supabase.from('subjects').select('*')
  const S: Record<string, any> = {}
  subs!.forEach((s: any) => { S[s.code] = s })

  const { data: tops } = await supabase.from('topics').select('*')
  const T: Record<string, any> = {}
  tops!.forEach((t: any) => { T[t.name_hi] = t })

  const gkSubjectId = S['GK']?.id
  const caTopicId = T['करंट अफेयर्स']?.id ?? null

  const buildQs = (qs: Q[]) =>
    qs.map(([textHi, a, b, c, d, ans]) => ({
      text_hi: textHi,
      option_a: a, option_b: b, option_c: c, option_d: d,
      correct: ans,
      explanation: ({ A: a, B: b, C: c, D: d } as Record<string,string>)[ans],
      subject_id: gkSubjectId,
      topic_id: caTopicId,
      difficulty: 'MEDIUM' as const,
      source: 'MP Patwari 2026 Current Affairs Jun-Aug 2026',
      is_active: true,
    }))

  const insertBatch = async (rows: any[]) => {
    const results: any[] = []
    for (let i = 0; i < rows.length; i += 25) {
      const { data, error } = await supabase.from('questions').insert(rows.slice(i, i + 25)).select()
      if (error) { console.error('Insert error:', error.message); continue }
      results.push(...(data ?? []))
    }
    return results
  }

  const createCATest = async (titleEn: string, titleHi: string, paperNum: number, qs: any[]) => {
    const { data: test, error } = await supabase.from('mock_tests').insert({
      title: titleEn,
      title_hi: titleHi,
      description: `MP Patwari 2026 के लिए ${titleHi}। जून–अगस्त 2026 के ताज़ा करंट अफेयर्स पर आधारित।`,
      type: 'CURRENT_AFFAIRS',
      total_questions: qs.length,
      total_marks: qs.length,
      duration: 25,
      negative_marks: 0.25,
      is_published: true,
      subject_id: null,
      sort_order: 200 + paperNum,
    }).select().single()
    if (error || !test) { console.error('Test create error:', error?.message); return }
    const tqs = qs.map((q: any, i: number) => ({ test_id: test.id, question_id: q.id, sort_order: i + 1 }))
    await supabase.from('test_questions').insert(tqs)
    console.log(`  ✓ Created: ${titleHi}`)
  }

  const papers = [
    { n: 6, qs: caP6, en: 'Current Affairs Paper 6 - India June-August 2026', hi: 'करंट अफेयर्स पेपर 6 - भारत जून-अगस्त 2026' },
    { n: 7, qs: caP7, en: 'Current Affairs Paper 7 - MP & India 2026 Latest', hi: 'करंट अफेयर्स पेपर 7 - MP एवं भारत 2026 (नवीनतम)' },
  ]

  for (const p of papers) {
    console.log(`\n📰 Processing: ${p.hi}`)
    const insertedQs = await insertBatch(buildQs(p.qs))
    await createCATest(p.en, p.hi, p.n, insertedQs)
  }

  console.log('\n✅ Done! 2 latest 2026 CA papers seeded (40 questions).')
}

main().catch(console.error)
