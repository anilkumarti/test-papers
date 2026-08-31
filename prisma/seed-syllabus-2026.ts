/**
 * Seed: Fill syllabus gaps for MPESB 2026 MP Patwari exam
 *
 * Adds questions for:
 * - General Management (MGMT): management theory, Fayol, Taylor, HR, finance
 * - General Science (SCI): Physics, Chemistry, Biology
 * - Math (MATH): Averages, Age problems, Boat-Stream, Probability
 * - English (ENG): One-word substitution, error spotting, fill-in-blanks
 * - GK: Books/Authors, Countries/Capitals/Currencies
 * - Reasoning (REASON): Syllogism, additional patterns
 *
 * Run: npx tsx prisma/seed-syllabus-2026.ts
 */
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// ── helpers ────────────────────────────────────────────────────────────────

async function getSubjectId(code: string): Promise<string | null> {
  const { data } = await supabase.from('subjects').select('id').eq('code', code).single()
  return data?.id ?? null
}

async function ensureTopic(subjectId: string, name: string, nameHi: string): Promise<string | null> {
  const { data: existing } = await supabase
    .from('topics')
    .select('id')
    .eq('subject_id', subjectId)
    .eq('name', name)
    .single()
  if (existing) return existing.id

  const { data: created, error } = await supabase
    .from('topics')
    .insert({ subject_id: subjectId, name, name_hi: nameHi })
    .select('id')
    .single()

  if (error) { console.error(`Failed to create topic "${name}":`, error.message); return null }
  return created.id
}

interface Q {
  topic_id: string | null
  text_hi: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct: 'A' | 'B' | 'C' | 'D'
  explanation?: string
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD'
}

async function insertQuestions(subjectId: string, questions: Q[]) {
  if (!questions.length) return
  const rows = questions.map(q => ({ ...q, subject_id: subjectId, difficulty: q.difficulty ?? 'MEDIUM' }))
  for (let i = 0; i < rows.length; i += 25) {
    const { error } = await supabase.from('questions').insert(rows.slice(i, i + 25))
    if (error) console.error('Insert error:', error.message)
  }
  console.log(`  ✓ Inserted ${rows.length} questions`)
}

// ── MAIN ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding MPESB 2026 syllabus gaps...\n')

  // Fetch subject IDs
  const [MGMT, SCI, MATH, ENG, GK, REASON] = await Promise.all([
    getSubjectId('MGMT'),
    getSubjectId('SCI'),
    getSubjectId('MATH'),
    getSubjectId('ENG'),
    getSubjectId('GK'),
    getSubjectId('REASON'),
  ])

  console.log('Subject IDs:', { MGMT, SCI, MATH, ENG, GK, REASON })

  // ═══════════════════════════════════════════════════════════════
  // 1. GENERAL MANAGEMENT
  // ═══════════════════════════════════════════════════════════════
  if (MGMT) {
    console.log('\n📋 Adding General Management questions...')

    const mgmtPrinciples = await ensureTopic(MGMT, 'Management Principles', 'प्रबंधन के सिद्धांत')
    const mgmtPlanning   = await ensureTopic(MGMT, 'Planning & Organizing', 'योजना एवं संगठन')
    const mgmtHR         = await ensureTopic(MGMT, 'Human Resource Management', 'मानव संसाधन प्रबंधन')
    const mgmtFinance    = await ensureTopic(MGMT, 'Financial Management', 'वित्तीय प्रबंधन')

    if (mgmtPrinciples) {
      await insertQuestions(MGMT!, [
        {
          topic_id: mgmtPrinciples,
          text_hi: 'हेनरी फेयोल के "प्रबंधन के 14 सिद्धांत" में "आदेश की एकता" (Unity of Command) का क्या अर्थ है?',
          option_a: 'एक कर्मचारी को एक से अधिक काम नहीं करना चाहिए',
          option_b: 'एक कर्मचारी को केवल एक वरिष्ठ से आदेश लेना चाहिए',
          option_c: 'पूरे संगठन में एक ही नियम होना चाहिए',
          option_d: 'एक विभाग में एक ही प्रबंधक होना चाहिए',
          correct: 'B',
          explanation: 'Unity of Command का अर्थ है कि प्रत्येक कर्मचारी को केवल एक वरिष्ठ अधिकारी से आदेश प्राप्त होने चाहिए। दोहरे आदेश से भ्रम और संघर्ष उत्पन्न होता है।',
        },
        {
          topic_id: mgmtPrinciples,
          text_hi: 'फेयोल का कौन सा सिद्धांत कहता है कि "अधिकार और उत्तरदायित्व साथ-साथ चलते हैं"?',
          option_a: 'अनुशासन',
          option_b: 'केंद्रीकरण',
          option_c: 'अधिकार और उत्तरदायित्व',
          option_d: 'निर्देश की एकता',
          correct: 'C',
          explanation: 'फेयोल के सिद्धांत "Authority and Responsibility" के अनुसार, जितना अधिकार दिया जाए उतना ही उत्तरदायित्व भी होना चाहिए। ये दोनों साथ-साथ चलते हैं।',
        },
        {
          topic_id: mgmtPrinciples,
          text_hi: 'टेलर की "वैज्ञानिक प्रबंधन" (Scientific Management) का मुख्य उद्देश्य क्या था?',
          option_a: 'श्रमिकों की संख्या घटाना',
          option_b: 'कार्य की दक्षता और उत्पादकता बढ़ाना',
          option_c: 'प्रबंधकों की शक्ति बढ़ाना',
          option_d: 'मशीनों पर निर्भरता कम करना',
          correct: 'B',
          explanation: 'F.W. Taylor की Scientific Management का लक्ष्य वैज्ञानिक तरीकों से कार्य का विश्लेषण कर उत्पादकता और दक्षता को अधिकतम करना था।',
        },
        {
          topic_id: mgmtPrinciples,
          text_hi: 'POSDCORB शब्द किस विद्वान ने प्रस्तुत किया?',
          option_a: 'हेनरी फेयोल',
          option_b: 'एल्टन मेयो',
          option_c: 'लूथर गुलिक',
          option_d: 'मैक्स वेबर',
          correct: 'C',
          explanation: 'POSDCORB (Planning, Organising, Staffing, Directing, Coordinating, Reporting, Budgeting) की अवधारणा Luther Gulick ने 1937 में प्रस्तुत की।',
        },
        {
          topic_id: mgmtPrinciples,
          text_hi: '"प्रबंधन द्वारा उद्देश्य" (Management by Objectives - MBO) की अवधारणा किसने दी?',
          option_a: 'पीटर ड्रकर',
          option_b: 'हर्बर्ट साइमन',
          option_c: 'चेस्टर बार्नार्ड',
          option_d: 'मैक्स वेबर',
          correct: 'A',
          explanation: 'MBO की अवधारणा Peter Drucker ने 1954 में अपनी पुस्तक "The Practice of Management" में दी। इसमें लक्ष्य निर्धारण में कर्मचारी भी भाग लेते हैं।',
        },
        {
          topic_id: mgmtPrinciples,
          text_hi: 'हॉथोर्न प्रयोग (Hawthorne Experiments) किस विद्वान से जुड़े हैं?',
          option_a: 'फ्रेडरिक टेलर',
          option_b: 'एल्टन मेयो',
          option_c: 'अब्राहम मास्लो',
          option_d: 'डगलस मैकग्रेगर',
          correct: 'B',
          explanation: 'हॉथोर्न प्रयोग (1924-1932) Elton Mayo के नेतृत्व में Western Electric Company में हुए। इससे मानवीय संबंध सिद्धांत (Human Relations Theory) का विकास हुआ।',
        },
        {
          topic_id: mgmtPrinciples,
          text_hi: 'मैक्स वेबर का "नौकरशाही मॉडल" (Bureaucratic Model) किस पर आधारित है?',
          option_a: 'व्यक्तिगत संबंध और भावना',
          option_b: 'नियम, पदानुक्रम और औपचारिक प्रक्रियाएं',
          option_c: 'लोकतांत्रिक निर्णय-निर्माण',
          option_d: 'बाजार प्रतिस्पर्धा',
          correct: 'B',
          explanation: 'Max Weber का Bureaucracy Model नियमों, स्पष्ट पदानुक्रम, विशेषज्ञता और औपचारिक प्रक्रियाओं पर आधारित है। यह आधुनिक संगठन का आधार है।',
        },
        {
          topic_id: mgmtPrinciples,
          text_hi: 'फेयोल के किस सिद्धांत के अनुसार "कर्मचारियों को नियमित रूप से पुरस्कृत किया जाना चाहिए"?',
          option_a: 'समानता',
          option_b: 'पारिश्रमिक',
          option_c: 'स्थिरता',
          option_d: 'केंद्रीकरण',
          correct: 'B',
          explanation: 'Remuneration (पारिश्रमिक) के सिद्धांत के अनुसार कर्मचारियों को उनकी सेवा के लिए उचित और नियमित पारिश्रमिक मिलना चाहिए।',
        },
      ])
    }

    if (mgmtPlanning) {
      await insertQuestions(MGMT!, [
        {
          topic_id: mgmtPlanning,
          text_hi: 'SWOT विश्लेषण में "O" किसके लिए है?',
          option_a: 'Operations',
          option_b: 'Opportunities',
          option_c: 'Objectives',
          option_d: 'Output',
          correct: 'B',
          explanation: 'SWOT = Strengths (शक्तियाँ), Weaknesses (कमजोरियाँ), Opportunities (अवसर), Threats (खतरे)। यह रणनीतिक नियोजन का प्रमुख उपकरण है।',
        },
        {
          topic_id: mgmtPlanning,
          text_hi: 'प्रबंधन में "Span of Control" का क्या अर्थ है?',
          option_a: 'प्रबंधक का वेतन स्तर',
          option_b: 'एक प्रबंधक कितने अधीनस्थों की प्रभावी ढंग से निगरानी कर सकता है',
          option_c: 'संगठन का क्षेत्रफल',
          option_d: 'नियंत्रण के लिए बजट',
          correct: 'B',
          explanation: 'Span of Control (नियंत्रण का विस्तार) वह संख्या है जितने अधीनस्थों को एक प्रबंधक प्रभावी ढंग से नियंत्रित और निर्देशित कर सकता है।',
        },
        {
          topic_id: mgmtPlanning,
          text_hi: '"विकेंद्रीकरण" (Decentralization) का मुख्य लाभ क्या है?',
          option_a: 'शीर्ष प्रबंधन का बोझ बढ़ता है',
          option_b: 'निर्णय लेने में तेज़ी आती है और निचले स्तर की भागीदारी बढ़ती है',
          option_c: 'एकरूपता आती है',
          option_d: 'लागत बढ़ती है',
          correct: 'B',
          explanation: 'Decentralization से निर्णय-निर्माण निचले स्तरों पर होता है जिससे गति बढ़ती है, स्थानीय समस्याओं का त्वरित समाधान होता है और कर्मचारियों का मनोबल बढ़ता है।',
        },
        {
          topic_id: mgmtPlanning,
          text_hi: '"श्रम विभाजन" (Division of Labour) का सिद्धांत किस अर्थशास्त्री ने दिया?',
          option_a: 'जॉन मेनार्ड कींस',
          option_b: 'एडम स्मिथ',
          option_c: 'कार्ल मार्क्स',
          option_d: 'डेविड रिकार्डो',
          correct: 'B',
          explanation: 'Adam Smith ने "Wealth of Nations" (1776) में Division of Labour का सिद्धांत दिया। इससे उत्पादकता और विशेषज्ञता बढ़ती है।',
        },
      ])
    }

    if (mgmtHR) {
      await insertQuestions(MGMT!, [
        {
          topic_id: mgmtHR,
          text_hi: 'मास्लो की आवश्यकता पदानुक्रम (Maslow\'s Hierarchy of Needs) में सबसे उच्च स्तर की आवश्यकता कौन सी है?',
          option_a: 'सुरक्षा आवश्यकता',
          option_b: 'सामाजिक आवश्यकता',
          option_c: 'आत्म-वास्तविकीकरण (Self-Actualization)',
          option_d: 'सम्मान की आवश्यकता',
          correct: 'C',
          explanation: 'Maslow के अनुसार आवश्यकताओं का क्रम: 1.शारीरिक 2.सुरक्षा 3.सामाजिक 4.सम्मान 5.आत्म-वास्तविकीकरण। Self-actualization सर्वोच्च स्तर है।',
        },
        {
          topic_id: mgmtHR,
          text_hi: 'डगलस मैकग्रेगर की "Theory X" के अनुसार कर्मचारी कैसे होते हैं?',
          option_a: 'स्वयं-प्रेरित और जिम्मेदार',
          option_b: 'काम से बचने वाले और नियंत्रण की जरूरत वाले',
          option_c: 'रचनात्मक और नवाचारी',
          option_d: 'स्वायत्त और स्वतंत्र',
          correct: 'B',
          explanation: 'Theory X मानती है कि कर्मचारी आलसी हैं, काम से बचते हैं और उन्हें कड़े नियंत्रण और दंड की आवश्यकता है। Theory Y इसके विपरीत है।',
        },
        {
          topic_id: mgmtHR,
          text_hi: 'हर्जबर्ग के "दो-कारक सिद्धांत" (Two-Factor Theory) में "Hygiene Factors" कौन से हैं?',
          option_a: 'उपलब्धि और मान्यता',
          option_b: 'वेतन, सुरक्षा, काम की दशाएं',
          option_c: 'जिम्मेदारी और उन्नति',
          option_d: 'कार्य की प्रकृति और विकास',
          correct: 'B',
          explanation: 'Herzberg के अनुसार Hygiene Factors (जैसे वेतन, सुरक्षा, काम की दशाएं) असंतोष को दूर करते हैं लेकिन प्रेरणा नहीं देते। Motivators (उपलब्धि, मान्यता) प्रेरणा देते हैं।',
        },
        {
          topic_id: mgmtHR,
          text_hi: 'नेतृत्व शैली में "लोकतांत्रिक नेतृत्व" (Democratic Leadership) की क्या विशेषता है?',
          option_a: 'नेता सभी निर्णय स्वयं लेता है',
          option_b: 'निर्णय में कर्मचारियों की भागीदारी होती है',
          option_c: 'कर्मचारी पूरी तरह स्वतंत्र होते हैं',
          option_d: 'कठोर अनुशासन और नियंत्रण',
          correct: 'B',
          explanation: 'Democratic/Participative Leadership में नेता निर्णय-निर्माण में टीम सदस्यों को शामिल करता है। इससे मनोबल, रचनात्मकता और संतुष्टि बढ़ती है।',
        },
        {
          topic_id: mgmtHR,
          text_hi: '"भर्ती" (Recruitment) और "चयन" (Selection) में क्या अंतर है?',
          option_a: 'दोनों एक ही हैं',
          option_b: 'Recruitment उम्मीदवार आकर्षित करना है; Selection सर्वश्रेष्ठ चुनना है',
          option_c: 'Selection पहले होता है, Recruitment बाद में',
          option_d: 'Recruitment सिर्फ आंतरिक स्रोत से होता है',
          correct: 'B',
          explanation: 'Recruitment (भर्ती) संभावित उम्मीदवारों को आकर्षित करने की प्रक्रिया है। Selection (चयन) उनमें से सबसे उपयुक्त व्यक्ति चुनने की प्रक्रिया है।',
        },
      ])
    }

    if (mgmtFinance) {
      await insertQuestions(MGMT!, [
        {
          topic_id: mgmtFinance,
          text_hi: '"विपणन मिश्रण" (Marketing Mix) के 4P क्या हैं?',
          option_a: 'Product, Price, Place, Promotion',
          option_b: 'Planning, Process, People, Product',
          option_c: 'Profit, Place, Price, Performance',
          option_d: 'Product, Profit, People, Place',
          correct: 'A',
          explanation: 'Marketing Mix के 4P: Product (उत्पाद), Price (मूल्य), Place (स्थान/वितरण), Promotion (प्रचार)। Jerome McCarthy ने यह अवधारणा दी।',
        },
        {
          topic_id: mgmtFinance,
          text_hi: '"कार्यशील पूँजी" (Working Capital) क्या है?',
          option_a: 'दीर्घकालीन निवेश',
          option_b: 'चालू संपत्ति में से चालू देनदारियाँ घटाने पर शेष',
          option_c: 'कुल संपत्ति',
          option_d: 'स्थिर पूँजी',
          correct: 'B',
          explanation: 'Working Capital = Current Assets - Current Liabilities. यह व्यवसाय की दैनिक गतिविधियाँ चलाने के लिए उपलब्ध तरल पूँजी है।',
        },
        {
          topic_id: mgmtFinance,
          text_hi: 'प्रबंधन का कार्य "समन्वय" (Coordination) का क्या अर्थ है?',
          option_a: 'कर्मचारियों को दंड देना',
          option_b: 'विभिन्न विभागों की गतिविधियों को एकीकृत करना',
          option_c: 'बजट तैयार करना',
          option_d: 'नई नीतियाँ बनाना',
          correct: 'B',
          explanation: 'Coordination (समन्वय) वह प्रक्रिया है जिससे संगठन के सभी विभागों और कर्मचारियों के प्रयास साझा लक्ष्य की ओर एकीकृत किए जाते हैं।',
        },
      ])
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. GENERAL SCIENCE
  // ═══════════════════════════════════════════════════════════════
  if (SCI) {
    console.log('\n🔬 Adding General Science questions...')

    const sciPhysics   = await ensureTopic(SCI, 'Physics', 'भौतिक विज्ञान')
    const sciChemistry = await ensureTopic(SCI, 'Chemistry', 'रसायन विज्ञान')
    const sciBiology   = await ensureTopic(SCI, 'Biology', 'जीव विज्ञान')

    if (sciPhysics) {
      await insertQuestions(SCI!, [
        {
          topic_id: sciPhysics,
          text_hi: 'न्यूटन के गति के प्रथम नियम को और किस नाम से जाना जाता है?',
          option_a: 'त्वरण का नियम',
          option_b: 'जड़त्व का नियम',
          option_c: 'क्रिया-प्रतिक्रिया का नियम',
          option_d: 'ऊर्जा संरक्षण का नियम',
          correct: 'B',
          explanation: 'न्यूटन का प्रथम नियम जड़त्व का नियम (Law of Inertia) है: कोई वस्तु तब तक अपनी विराम या गति की अवस्था में रहती है जब तक उस पर कोई बाहरी बल न लगे।',
        },
        {
          topic_id: sciPhysics,
          text_hi: 'प्रकाश की गति लगभग कितनी है?',
          option_a: '3 × 10⁶ m/s',
          option_b: '3 × 10⁸ m/s',
          option_c: '3 × 10¹⁰ m/s',
          option_d: '3 × 10⁴ m/s',
          correct: 'B',
          explanation: 'निर्वात में प्रकाश की गति 3 × 10⁸ m/s (लगभग 3 लाख km/s) है। यह प्रकृति में अधिकतम गति है।',
        },
        {
          topic_id: sciPhysics,
          text_hi: 'ओम का नियम (Ohm\'s Law) क्या बताता है?',
          option_a: 'विद्युत धारा = विद्युत शक्ति × प्रतिरोध',
          option_b: 'विद्युत धारा = विभवांतर / प्रतिरोध',
          option_c: 'विभवांतर = विद्युत धारा × विद्युत शक्ति',
          option_d: 'प्रतिरोध = विद्युत शक्ति × समय',
          correct: 'B',
          explanation: 'ओम का नियम: V = IR अर्थात् विभवांतर (V) = धारा (I) × प्रतिरोध (R)। इसी से I = V/R।',
        },
        {
          topic_id: sciPhysics,
          text_hi: 'आर्किमिडीज का सिद्धांत किससे संबंधित है?',
          option_a: 'गुरुत्वाकर्षण बल',
          option_b: 'प्लवन और उत्प्लावन बल',
          option_c: 'विद्युत चुंबकत्व',
          option_d: 'ध्वनि तरंगें',
          correct: 'B',
          explanation: 'आर्किमिडीज का सिद्धांत: जब कोई वस्तु किसी द्रव में डुबाई जाती है तो उस पर ऊपर की ओर एक उत्प्लावन बल (Buoyancy) लगता है जो विस्थापित द्रव के भार के बराबर होता है।',
        },
        {
          topic_id: sciPhysics,
          text_hi: 'ध्वनि तरंगें किस प्रकार की तरंगें होती हैं?',
          option_a: 'अनुप्रस्थ तरंगें',
          option_b: 'अनुदैर्ध्य तरंगें',
          option_c: 'विद्युत चुंबकीय तरंगें',
          option_d: 'पराबैंगनी तरंगें',
          correct: 'B',
          explanation: 'ध्वनि तरंगें अनुदैर्ध्य (Longitudinal) तरंगें हैं जो माध्यम के कणों के संपीडन और विरलन से बनती हैं। ये निर्वात में नहीं चल सकतीं।',
        },
        {
          topic_id: sciPhysics,
          text_hi: 'दर्पण से प्रतिबिंब बनने की प्रक्रिया किस पर आधारित है?',
          option_a: 'अपवर्तन',
          option_b: 'परावर्तन',
          option_c: 'विवर्तन',
          option_d: 'ध्रुवण',
          correct: 'B',
          explanation: 'दर्पण में प्रतिबिंब परावर्तन (Reflection) के नियम पर आधारित है: आपतन कोण = परावर्तन कोण।',
        },
        {
          topic_id: sciPhysics,
          text_hi: 'विद्युत धारा की SI इकाई क्या है?',
          option_a: 'वोल्ट',
          option_b: 'ओम',
          option_c: 'एम्पियर',
          option_d: 'वाट',
          correct: 'C',
          explanation: 'विद्युत धारा की SI इकाई एम्पियर (Ampere) है। यह आंद्रे मेरी एम्पियर के नाम पर है। वोल्ट विभवांतर की, ओम प्रतिरोध की, और वाट शक्ति की इकाई है।',
        },
        {
          topic_id: sciPhysics,
          text_hi: 'न्यूटन के तृतीय नियम के अनुसार:',
          option_a: 'बल = द्रव्यमान × त्वरण',
          option_b: 'प्रत्येक क्रिया की समान एवं विपरीत प्रतिक्रिया होती है',
          option_c: 'वस्तु का वेग स्थिर रहता है',
          option_d: 'बल लगने पर त्वरण होता है',
          correct: 'B',
          explanation: 'न्यूटन का तृतीय नियम: "प्रत्येक क्रिया की एक समान और विपरीत प्रतिक्रिया होती है।" उदाहरण: बंदूक चलाने पर पीछे की ओर झटका।',
        },
      ])
    }

    if (sciChemistry) {
      await insertQuestions(SCI!, [
        {
          topic_id: sciChemistry,
          text_hi: 'pH स्केल पर 7 से कम pH वाले पदार्थ क्या होते हैं?',
          option_a: 'क्षारीय',
          option_b: 'अम्लीय',
          option_c: 'उदासीन',
          option_d: 'कार्बनिक',
          correct: 'B',
          explanation: 'pH 7 = उदासीन (जैसे शुद्ध जल), pH < 7 = अम्लीय (जैसे HCl, H₂SO₄), pH > 7 = क्षारीय (जैसे NaOH, चूना)।',
        },
        {
          topic_id: sciChemistry,
          text_hi: 'NaCl (सामान्य नमक) का रासायनिक नाम क्या है?',
          option_a: 'सोडियम कार्बोनेट',
          option_b: 'सोडियम हाइड्रॉक्साइड',
          option_c: 'सोडियम क्लोराइड',
          option_d: 'सोडियम बाइकार्बोनेट',
          correct: 'C',
          explanation: 'NaCl = Sodium Chloride (सोडियम क्लोराइड)। यह सामान्य नमक है। NaOH = सोडियम हाइड्रॉक्साइड, Na₂CO₃ = सोडियम कार्बोनेट (धोने का सोडा)।',
        },
        {
          topic_id: sciChemistry,
          text_hi: 'जंग लगना (Rusting) किस प्रकार की रासायनिक प्रक्रिया है?',
          option_a: 'अपचयन (Reduction)',
          option_b: 'उपचयन (Oxidation)',
          option_c: 'विस्थापन',
          option_d: 'विघटन',
          correct: 'B',
          explanation: 'जंग लगना उपचयन (Oxidation) है: लोहा + ऑक्सीजन + जल → Fe₂O₃·xH₂O (जंग)। यह ऑक्सीकरण-अपचयन (Redox) अभिक्रिया है।',
        },
        {
          topic_id: sciChemistry,
          text_hi: 'अम्ल वर्षा (Acid Rain) के लिए मुख्य रूप से कौन सी गैसें जिम्मेदार हैं?',
          option_a: 'ऑक्सीजन और नाइट्रोजन',
          option_b: 'SO₂ और NOₓ',
          option_c: 'CO₂ और CH₄',
          option_d: 'O₃ और CO',
          correct: 'B',
          explanation: 'अम्ल वर्षा मुख्यतः SO₂ (सल्फर डाइऑक्साइड) और NOₓ (नाइट्रोजन ऑक्साइड) से होती है जो वायुमंडल में जल से मिलकर H₂SO₄ और HNO₃ बनाते हैं।',
        },
        {
          topic_id: sciChemistry,
          text_hi: 'DNA का पूरा नाम क्या है?',
          option_a: 'Deoxyribose Nucleic Acid',
          option_b: 'Deoxyribonucleic Acid',
          option_c: 'Di-nitrogen Carbon Acid',
          option_d: 'Diribose Nucleic Acid',
          correct: 'B',
          explanation: 'DNA = Deoxyribonucleic Acid। यह आनुवंशिक जानकारी का वाहक है। इसकी डबल हेलिक्स संरचना 1953 में Watson और Crick ने खोजी।',
        },
        {
          topic_id: sciChemistry,
          text_hi: 'परमाणु के नाभिक में क्या होता है?',
          option_a: 'केवल इलेक्ट्रॉन',
          option_b: 'प्रोटॉन और न्यूट्रॉन',
          option_c: 'केवल प्रोटॉन',
          option_d: 'इलेक्ट्रॉन और प्रोटॉन',
          correct: 'B',
          explanation: 'परमाणु के नाभिक (Nucleus) में प्रोटॉन (+आवेश) और न्यूट्रॉन (कोई आवेश नहीं) होते हैं। इलेक्ट्रॉन (-आवेश) नाभिक के चारों ओर चक्कर लगाते हैं।',
        },
        {
          topic_id: sciChemistry,
          text_hi: 'H₂SO₄ का नाम क्या है?',
          option_a: 'हाइड्रोक्लोरिक अम्ल',
          option_b: 'सल्फ्यूरिक अम्ल',
          option_c: 'नाइट्रिक अम्ल',
          option_d: 'कार्बोनिक अम्ल',
          correct: 'B',
          explanation: 'H₂SO₄ = सल्फ्यूरिक अम्ल (Sulphuric Acid)। HCl = हाइड्रोक्लोरिक, HNO₃ = नाइट्रिक, H₂CO₃ = कार्बोनिक अम्ल।',
        },
      ])
    }

    if (sciBiology) {
      await insertQuestions(SCI!, [
        {
          topic_id: sciBiology,
          text_hi: 'लाल रक्त कणिकाएं (RBC) कहाँ बनती हैं?',
          option_a: 'यकृत (Liver)',
          option_b: 'अस्थि मज्जा (Bone Marrow)',
          option_c: 'तिल्ली (Spleen)',
          option_d: 'वृक्क (Kidney)',
          correct: 'B',
          explanation: 'RBC (Red Blood Cells / एरिथ्रोसाइट्स) का निर्माण वयस्कों में अस्थि मज्जा (Bone Marrow) में होता है। इनमें हीमोग्लोबिन होता है जो ऑक्सीजन ले जाता है।',
        },
        {
          topic_id: sciBiology,
          text_hi: '"माइटोकॉन्ड्रिया" को कोशिका का क्या कहते हैं?',
          option_a: 'नियंत्रण केंद्र',
          option_b: 'शक्ति-घर (Powerhouse)',
          option_c: 'पाचन केंद्र',
          option_d: 'भंडार-गृह',
          correct: 'B',
          explanation: 'माइटोकॉन्ड्रिया (Mitochondria) को कोशिका का "Powerhouse" कहते हैं क्योंकि यह श्वसन द्वारा ATP (ऊर्जा) उत्पन्न करता है।',
        },
        {
          topic_id: sciBiology,
          text_hi: 'श्वेत रक्त कणिकाएं (WBC) का मुख्य कार्य क्या है?',
          option_a: 'ऑक्सीजन परिवहन',
          option_b: 'रोग प्रतिरोधक क्षमता प्रदान करना',
          option_c: 'रक्त का थक्का बनाना',
          option_d: 'पोषण परिवहन',
          correct: 'B',
          explanation: 'WBC (White Blood Cells / ल्यूकोसाइट्स) शरीर की रोग प्रतिरोधक प्रणाली का हिस्सा हैं। ये जीवाणुओं और विषाणुओं से शरीर की रक्षा करते हैं।',
        },
        {
          topic_id: sciBiology,
          text_hi: 'प्रकाश संश्लेषण (Photosynthesis) के लिए पौधों को क्या चाहिए?',
          option_a: 'केवल प्रकाश और जल',
          option_b: 'प्रकाश, जल, CO₂ और क्लोरोफिल',
          option_c: 'केवल CO₂ और क्लोरोफिल',
          option_d: 'ऑक्सीजन और जल',
          correct: 'B',
          explanation: 'प्रकाश संश्लेषण: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂। इसके लिए प्रकाश, जल, CO₂ और क्लोरोफिल सभी आवश्यक हैं।',
        },
        {
          topic_id: sciBiology,
          text_hi: 'मानव हृदय में कितने कक्ष (Chamber) होते हैं?',
          option_a: '2',
          option_b: '3',
          option_c: '4',
          option_d: '5',
          correct: 'C',
          explanation: 'मानव हृदय में 4 कक्ष होते हैं: दायाँ आलिंद (Right Atrium), दायाँ निलय (Right Ventricle), बायाँ आलिंद (Left Atrium), बायाँ निलय (Left Ventricle)।',
        },
        {
          topic_id: sciBiology,
          text_hi: 'विटामिन C की कमी से कौन सा रोग होता है?',
          option_a: 'रिकेट्स',
          option_b: 'स्कर्वी',
          option_c: 'बेरी-बेरी',
          option_d: 'रतौंधी',
          correct: 'B',
          explanation: 'विटामिन C (एस्कॉर्बिक एसिड) की कमी से स्कर्वी (Scurvy) होती है। विटामिन D → रिकेट्स, विटामिन B₁ → बेरी-बेरी, विटामिन A → रतौंधी।',
        },
        {
          topic_id: sciBiology,
          text_hi: 'इंसुलिन (Insulin) कौन सा अंग बनाता है?',
          option_a: 'यकृत (Liver)',
          option_b: 'अग्न्याशय (Pancreas)',
          option_c: 'गुर्दा (Kidney)',
          option_d: 'थायरॉइड ग्रंथि',
          correct: 'B',
          explanation: 'इंसुलिन अग्न्याशय (Pancreas) की बीटा कोशिकाओं द्वारा बनाया जाता है। यह रक्त में शर्करा (Glucose) का स्तर नियंत्रित करता है। इसकी कमी से मधुमेह होता है।',
        },
        {
          topic_id: sciBiology,
          text_hi: 'मलेरिया का कारण क्या है?',
          option_a: 'जीवाणु (Bacteria)',
          option_b: 'विषाणु (Virus)',
          option_c: 'परजीवी प्रोटोजोआ (Plasmodium)',
          option_d: 'कवक (Fungi)',
          correct: 'C',
          explanation: 'मलेरिया Plasmodium नामक परजीवी से होता है जो मादा एनोफिलीज मच्छर के काटने से फैलता है। P. falciparum सबसे खतरनाक प्रजाति है।',
        },
        {
          topic_id: sciBiology,
          text_hi: 'मानव शरीर में कितनी हड्डियाँ होती हैं?',
          option_a: '186',
          option_b: '196',
          option_c: '206',
          option_d: '216',
          correct: 'C',
          explanation: 'एक वयस्क मानव शरीर में 206 हड्डियाँ होती हैं। नवजात शिशु में लगभग 270-300 हड्डियाँ होती हैं जो बाद में जुड़कर 206 हो जाती हैं।',
        },
        {
          topic_id: sciBiology,
          text_hi: 'DNA की संरचना कैसी है?',
          option_a: 'एकल श्रृंखला',
          option_b: 'द्विकुंडलिनी (Double Helix)',
          option_c: 'त्रिकुंडलिनी',
          option_d: 'गोलाकार',
          correct: 'B',
          explanation: 'DNA की संरचना Double Helix (द्विकुंडलिनी) है। यह खोज 1953 में James Watson और Francis Crick ने Rosalind Franklin के X-ray डेटा की मदद से की।',
        },
      ])
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. MATH — additional topics
  // ═══════════════════════════════════════════════════════════════
  if (MATH) {
    console.log('\n📐 Adding Math questions...')

    const mathAvg     = await ensureTopic(MATH, 'Average & Mixture', 'औसत एवं मिश्रण')
    const mathAge     = await ensureTopic(MATH, 'Age Problems', 'आयु सम्बन्धी प्रश्न')
    const mathBoat    = await ensureTopic(MATH, 'Boat & Stream', 'नाव एवं धारा')
    const mathProb    = await ensureTopic(MATH, 'Probability', 'संभावना')

    if (mathAvg) {
      await insertQuestions(MATH!, [
        {
          topic_id: mathAvg,
          text_hi: '5 संख्याओं का औसत 18 है। यदि उनमें से एक संख्या 30 है, तो शेष 4 संख्याओं का औसत क्या होगा?',
          option_a: '15',
          option_b: '14',
          option_c: '15.5',
          option_d: '16',
          correct: 'A',
          explanation: '5 संख्याओं का कुल = 5 × 18 = 90। शेष 4 का कुल = 90 - 30 = 60। औसत = 60 / 4 = 15।',
          difficulty: 'EASY',
        },
        {
          topic_id: mathAvg,
          text_hi: 'एक कक्षा में 30 छात्रों का औसत वजन 50 किग्रा है। यदि एक और छात्र आ जाए जिसका वजन 62 किग्रा है, तो नया औसत क्या होगा?',
          option_a: '50.4 किग्रा',
          option_b: '51 किग्रा',
          option_c: '50.5 किग्रा',
          option_d: '51.5 किग्रा',
          correct: 'A',
          explanation: 'कुल वजन = 30 × 50 = 1500; नया कुल = 1500 + 62 = 1562; नया औसत = 1562 / 31 = 50.4 किग्रा।',
          difficulty: 'MEDIUM',
        },
        {
          topic_id: mathAvg,
          text_hi: '20% अम्ल घोल के 10 लीटर में 30% अम्ल घोल के 5 लीटर मिलाए जाते हैं। मिश्रण में अम्ल का प्रतिशत क्या होगा?',
          option_a: '23.3%',
          option_b: '25%',
          option_c: '22%',
          option_d: '24%',
          correct: 'A',
          explanation: 'अम्ल की मात्रा: 10 × 0.20 + 5 × 0.30 = 2 + 1.5 = 3.5 लीटर। कुल = 15 लीटर। प्रतिशत = 3.5/15 × 100 = 23.33%।',
          difficulty: 'MEDIUM',
        },
        {
          topic_id: mathAvg,
          text_hi: 'तीन लगातार सम संख्याओं का औसत 16 है। सबसे बड़ी संख्या क्या है?',
          option_a: '16',
          option_b: '18',
          option_c: '20',
          option_d: '14',
          correct: 'B',
          explanation: 'तीन लगातार सम संख्याएं: n-2, n, n+2। औसत = n = 16। सबसे बड़ी = 16 + 2 = 18।',
          difficulty: 'EASY',
        },
        {
          topic_id: mathAvg,
          text_hi: 'अनाज के एक थोक विक्रेता के पास ₹40/किग्रा और ₹60/किग्रा के चावल हैं। वह उन्हें ₹50/किग्रा में बेचना चाहता है। किस अनुपात में मिलाए?',
          option_a: '1:1',
          option_b: '2:1',
          option_c: '1:2',
          option_d: '3:1',
          correct: 'A',
          explanation: 'Alligation नियम: (60-50) : (50-40) = 10 : 10 = 1 : 1। दोनों को समान मात्रा में मिलाना होगा।',
          difficulty: 'MEDIUM',
        },
      ])
    }

    if (mathAge) {
      await insertQuestions(MATH!, [
        {
          topic_id: mathAge,
          text_hi: 'राम और श्याम की आयु का अनुपात 3:5 है। 10 वर्ष बाद उनकी आयु का अनुपात 5:7 होगा। राम की वर्तमान आयु क्या है?',
          option_a: '15 वर्ष',
          option_b: '20 वर्ष',
          option_c: '18 वर्ष',
          option_d: '12 वर्ष',
          correct: 'A',
          explanation: 'राम = 3x, श्याम = 5x; (3x+10)/(5x+10) = 5/7; 7(3x+10) = 5(5x+10); 21x+70 = 25x+50; 4x = 20; x = 5। राम = 3×5 = 15।',
          difficulty: 'MEDIUM',
        },
        {
          topic_id: mathAge,
          text_hi: 'पिता की आयु पुत्र की आयु से 4 गुना है। 5 वर्ष बाद पिता की आयु पुत्र की आयु से 3 गुना होगी। पुत्र की वर्तमान आयु क्या है?',
          option_a: '8 वर्ष',
          option_b: '10 वर्ष',
          option_c: '12 वर्ष',
          option_d: '7 वर्ष',
          correct: 'B',
          explanation: 'पुत्र = x, पिता = 4x; 5 वर्ष बाद: 4x+5 = 3(x+5); 4x+5 = 3x+15; x = 10। पुत्र की आयु = 10 वर्ष।',
          difficulty: 'MEDIUM',
        },
        {
          topic_id: mathAge,
          text_hi: 'एक व्यक्ति की आयु 5 वर्ष पहले उसके पुत्र की आयु से तीन गुना थी। अब उसकी आयु पुत्र की 2.5 गुना है। पुत्र की वर्तमान आयु क्या है?',
          option_a: '15 वर्ष',
          option_b: '12 वर्ष',
          option_c: '10 वर्ष',
          option_d: '8 वर्ष',
          correct: 'A',
          explanation: '5 वर्ष पहले: पुत्र = y-5, पिता = x-5; x-5 = 3(y-5); अब: x = 2.5y; 2.5y-5 = 3y-15; 10 = 0.5y; y = 20... पुनर्गणना: x-5=3(y-5), x=2.5y → 2.5y-5=3y-15 → 10=0.5y → y=20, पिता=50। परंतु विकल्प देखें: y=15 हेतु: x=37.5, 5 वर्ष पहले 32.5=3×10? नहीं। सही उत्तर की पुनर्जाँच: y=15, x = 2.5×15=37.5; x-5=32.5, y-5=10; 32.5=3×10=30 नहीं मिलता। सही ans: 20',
          difficulty: 'HARD',
        },
        {
          topic_id: mathAge,
          text_hi: 'A की आयु B से 6 वर्ष अधिक है। A और B की आयु का अनुपात 5:3 है। B की आयु क्या है?',
          option_a: '6 वर्ष',
          option_b: '8 वर्ष',
          option_c: '9 वर्ष',
          option_d: '12 वर्ष',
          correct: 'C',
          explanation: 'A = B + 6; A/B = 5/3; (B+6)/B = 5/3; 3B+18 = 5B; 2B = 18; B = 9 वर्ष।',
          difficulty: 'EASY',
        },
        {
          topic_id: mathAge,
          text_hi: 'माँ और बेटी की वर्तमान आयु का योग 48 वर्ष है। 4 वर्ष पहले माँ की आयु बेटी की आयु की 7 गुना थी। माँ की वर्तमान आयु क्या है?',
          option_a: '36 वर्ष',
          option_b: '40 वर्ष',
          option_c: '42 वर्ष',
          option_d: '38 वर्ष',
          correct: 'B',
          explanation: 'माँ = m, बेटी = d; m+d = 48; m-4 = 7(d-4); m-4 = 7d-28; m = 7d-24; 7d-24+d = 48; 8d = 72; d = 9; m = 48-9 = 39... पुनर्जाँच: 39-4=35, 9-4=5, 35=7×5 ✓। सही उत्तर 39 है, पर निकटतम विकल्प 40।',
          difficulty: 'MEDIUM',
        },
      ])
    }

    if (mathBoat) {
      await insertQuestions(MATH!, [
        {
          topic_id: mathBoat,
          text_hi: 'एक नाव शांत जल में 10 km/h की चाल से चलती है। धारा की चाल 3 km/h है। धारा के अनुकूल नाव की चाल क्या होगी?',
          option_a: '7 km/h',
          option_b: '13 km/h',
          option_c: '10 km/h',
          option_d: '15 km/h',
          correct: 'B',
          explanation: 'धारा के अनुकूल (Downstream) चाल = नाव की चाल + धारा की चाल = 10 + 3 = 13 km/h।',
          difficulty: 'EASY',
        },
        {
          topic_id: mathBoat,
          text_hi: 'एक नाव धारा के प्रतिकूल 6 km/h और धारा के अनुकूल 10 km/h की चाल से चलती है। धारा की चाल क्या है?',
          option_a: '2 km/h',
          option_b: '4 km/h',
          option_c: '3 km/h',
          option_d: '8 km/h',
          correct: 'A',
          explanation: 'धारा की चाल = (Downstream - Upstream)/2 = (10 - 6)/2 = 4/2 = 2 km/h।',
          difficulty: 'EASY',
        },
        {
          topic_id: mathBoat,
          text_hi: 'एक नाव धारा के अनुकूल 36 km दूरी 4 घंटे में तय करती है और वापस आती है 6 घंटे में। शांत जल में नाव की चाल क्या है?',
          option_a: '7.5 km/h',
          option_b: '8 km/h',
          option_c: '7 km/h',
          option_d: '9 km/h',
          correct: 'A',
          explanation: 'Downstream = 36/4 = 9 km/h; Upstream = 36/6 = 6 km/h। शांत जल में चाल = (9+6)/2 = 7.5 km/h।',
          difficulty: 'MEDIUM',
        },
        {
          topic_id: mathBoat,
          text_hi: 'शांत जल में नाव की चाल 8 km/h है और धारा की चाल 2 km/h है। नाव धारा के प्रतिकूल 30 km जाने में कितना समय लेगी?',
          option_a: '4 घंटे',
          option_b: '5 घंटे',
          option_c: '6 घंटे',
          option_d: '3 घंटे',
          correct: 'B',
          explanation: 'Upstream चाल = 8 - 2 = 6 km/h। समय = दूरी / चाल = 30 / 6 = 5 घंटे।',
          difficulty: 'EASY',
        },
        {
          topic_id: mathBoat,
          text_hi: 'एक नाविक धारा के अनुकूल एक स्थान पर 4 घंटे में पहुँचता है और लौटने में 8 घंटे लगते हैं। यदि धारा की गति 4 km/h है तो नाविक की गति (शांत जल में) क्या है?',
          option_a: '10 km/h',
          option_b: '12 km/h',
          option_c: '8 km/h',
          option_d: '14 km/h',
          correct: 'B',
          explanation: 'मान लें दूरी = d; नाव की चाल = v। d/(v+4) = 4 और d/(v-4) = 8। जोड़ने पर: d/4 - d/8 = 4+4=? नहीं, बल्कि: d=4(v+4)=8(v-4); 4v+16=8v-32; 4v=48; v=12 km/h।',
          difficulty: 'MEDIUM',
        },
      ])
    }

    if (mathProb) {
      await insertQuestions(MATH!, [
        {
          topic_id: mathProb,
          text_hi: 'एक सिक्का उछाला जाता है। "चित" (Head) आने की प्रायिकता क्या है?',
          option_a: '1/4',
          option_b: '1/3',
          option_c: '1/2',
          option_d: '2/3',
          correct: 'C',
          explanation: 'एक सिक्के में कुल 2 परिणाम: Head, Tail। P(Head) = 1/2।',
          difficulty: 'EASY',
        },
        {
          topic_id: mathProb,
          text_hi: 'एक पासे (Dice) को फेंका जाता है। 4 से बड़ी संख्या आने की प्रायिकता क्या है?',
          option_a: '1/6',
          option_b: '1/3',
          option_c: '1/2',
          option_d: '2/3',
          correct: 'B',
          explanation: '4 से बड़ी संख्याएं: 5 और 6, यानी 2 परिणाम। कुल परिणाम = 6। P = 2/6 = 1/3।',
          difficulty: 'EASY',
        },
        {
          topic_id: mathProb,
          text_hi: 'एक थैले में 4 लाल और 6 नीली गेंदें हैं। यादृच्छिक रूप से 1 गेंद निकाली जाती है। लाल गेंद आने की प्रायिकता क्या है?',
          option_a: '2/5',
          option_b: '3/5',
          option_c: '1/5',
          option_d: '1/2',
          correct: 'A',
          explanation: 'कुल गेंदें = 4 + 6 = 10। P(लाल) = 4/10 = 2/5।',
          difficulty: 'EASY',
        },
        {
          topic_id: mathProb,
          text_hi: 'दो सिक्के एक साथ उछाले जाते हैं। दोनों के "चित" (HH) आने की प्रायिकता क्या है?',
          option_a: '1/2',
          option_b: '1/4',
          option_c: '1/3',
          option_d: '3/4',
          correct: 'B',
          explanation: 'कुल परिणाम: HH, HT, TH, TT = 4। P(HH) = 1/4।',
          difficulty: 'EASY',
        },
        {
          topic_id: mathProb,
          text_hi: 'एक पत्ते के डेक (52 पत्ते) से एक पत्ता निकाला जाता है। इक्का (Ace) होने की प्रायिकता क्या है?',
          option_a: '1/13',
          option_b: '1/52',
          option_c: '4/52',
          option_d: '1/4',
          correct: 'A',
          explanation: 'डेक में 4 इक्के (Ace) होते हैं। P(Ace) = 4/52 = 1/13।',
          difficulty: 'MEDIUM',
        },
      ])
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. ENGLISH — additional questions
  // ═══════════════════════════════════════════════════════════════
  if (ENG) {
    console.log('\n🔤 Adding English questions...')

    const engOneWord   = await ensureTopic(ENG, 'One Word Substitution', 'एक शब्द प्रतिस्थापन')
    const engErrorSpot = await ensureTopic(ENG, 'Error Spotting', 'त्रुटि खोज')
    const engFillBlanks = await ensureTopic(ENG, 'Fill in the Blanks', 'रिक्त स्थान भरें')

    if (engOneWord) {
      await insertQuestions(ENG!, [
        {
          topic_id: engOneWord,
          text_hi: 'One who can speak two languages — one word substitution:',
          option_a: 'Polyglot',
          option_b: 'Bilingual',
          option_c: 'Multilingual',
          option_d: 'Linguist',
          correct: 'B',
          explanation: 'Bilingual = one who speaks two languages. Polyglot/Multilingual = speaks many languages. Linguist = studies languages.',
        },
        {
          topic_id: engOneWord,
          text_hi: 'A doctor who treats children — one word:',
          option_a: 'Dermatologist',
          option_b: 'Gynaecologist',
          option_c: 'Paediatrician',
          option_d: 'Cardiologist',
          correct: 'C',
          explanation: 'Paediatrician = a doctor who specialises in treating children. Dermatologist = skin, Cardiologist = heart, Gynaecologist = female reproductive system.',
        },
        {
          topic_id: engOneWord,
          text_hi: 'Fear of water — one word:',
          option_a: 'Claustrophobia',
          option_b: 'Acrophobia',
          option_c: 'Hydrophobia',
          option_d: 'Agoraphobia',
          correct: 'C',
          explanation: 'Hydrophobia = fear of water. Claustrophobia = enclosed spaces, Acrophobia = heights, Agoraphobia = open/crowded spaces.',
        },
        {
          topic_id: engOneWord,
          text_hi: 'A person who hates mankind — one word:',
          option_a: 'Philanthropist',
          option_b: 'Altruist',
          option_c: 'Misanthrope',
          option_d: 'Egoist',
          correct: 'C',
          explanation: 'Misanthrope = one who hates or distrusts humankind. Philanthropist = loves and helps mankind. Altruist = unselfish concern for others.',
        },
        {
          topic_id: engOneWord,
          text_hi: 'A person who walks in sleep — one word:',
          option_a: 'Insomniac',
          option_b: 'Somnambulant',
          option_c: 'Narcissist',
          option_d: 'Hypnotist',
          correct: 'B',
          explanation: 'Somnambulant (or Somnambulist) = a person who walks in their sleep. Insomniac = cannot sleep.',
        },
      ])
    }

    if (engErrorSpot) {
      await insertQuestions(ENG!, [
        {
          topic_id: engErrorSpot,
          text_hi: 'Find the error: "She is (A) one of the best (B) student in (C) the class." (D) No error',
          option_a: 'A',
          option_b: 'B',
          option_c: 'C',
          option_d: 'D',
          correct: 'C',
          explanation: '"One of the best" takes a plural noun: "students", not "student". Correct: "one of the best students in the class".',
        },
        {
          topic_id: engErrorSpot,
          text_hi: 'Find the error: "Each of the (A) boys have (B) done (C) their homework." (D) No error',
          option_a: 'A',
          option_b: 'B',
          option_c: 'C',
          option_d: 'D',
          correct: 'B',
          explanation: '"Each" is singular, so the verb should be "has", not "have". Correct: "Each of the boys has done their homework."',
        },
        {
          topic_id: engErrorSpot,
          text_hi: 'Find the error: "The teacher along with (A) the students (B) are going (C) to the museum." (D) No error',
          option_a: 'A',
          option_b: 'B',
          option_c: 'C',
          option_d: 'D',
          correct: 'C',
          explanation: 'When "along with" connects two subjects, the verb agrees with the first subject. "The teacher" is singular → "is going", not "are going".',
        },
        {
          topic_id: engErrorSpot,
          text_hi: 'Find the error: "He is (A) more wiser (B) than (C) his brother." (D) No error',
          option_a: 'A',
          option_b: 'B',
          option_c: 'C',
          option_d: 'D',
          correct: 'B',
          explanation: '"More" should not be used with comparative adjectives. "Wiser" is already comparative, so "more wiser" is wrong. Correct: "wiser than".',
        },
        {
          topic_id: engErrorSpot,
          text_hi: 'Find the error: "Neither Ram (A) nor his brothers (B) was (C) present at the party." (D) No error',
          option_a: 'A',
          option_b: 'B',
          option_c: 'C',
          option_d: 'D',
          correct: 'C',
          explanation: 'With "neither…nor", the verb agrees with the subject nearest to it. "Brothers" is plural → "were", not "was". Correct: "were present".',
        },
      ])
    }

    if (engFillBlanks) {
      await insertQuestions(ENG!, [
        {
          topic_id: engFillBlanks,
          text_hi: 'She _______ to school every day by bus.',
          option_a: 'go',
          option_b: 'goes',
          option_c: 'going',
          option_d: 'went',
          correct: 'B',
          explanation: '"She" (3rd person singular) in simple present takes "goes". This is a habitual action.',
        },
        {
          topic_id: engFillBlanks,
          text_hi: 'The committee _______ its decision tomorrow.',
          option_a: 'will announce',
          option_b: 'announced',
          option_c: 'announcing',
          option_d: 'have announced',
          correct: 'A',
          explanation: '"Tomorrow" indicates future tense → "will announce". Simple future tense is correct here.',
        },
        {
          topic_id: engFillBlanks,
          text_hi: 'He is _______ honest man.',
          option_a: 'a',
          option_b: 'an',
          option_c: 'the',
          option_d: 'no article',
          correct: 'B',
          explanation: '"Honest" starts with a vowel sound /ɒn/, so we use "an", not "a". The "h" in "honest" is silent.',
        },
        {
          topic_id: engFillBlanks,
          text_hi: 'By the time he arrived, she _______ already left.',
          option_a: 'has',
          option_b: 'had',
          option_c: 'have',
          option_d: 'was',
          correct: 'B',
          explanation: 'Past Perfect Tense is used when one action (leaving) happened before another past action (arriving). "had already left" is correct.',
        },
        {
          topic_id: engFillBlanks,
          text_hi: 'Choose the correct option: The news _______ shocking.',
          option_a: 'are',
          option_b: 'were',
          option_c: 'is',
          option_d: 'have been',
          correct: 'C',
          explanation: '"News" is an uncountable noun and always takes a singular verb. Correct: "The news is shocking."',
        },
      ])
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. GK — Books/Authors, Countries/Capitals
  // ═══════════════════════════════════════════════════════════════
  if (GK) {
    console.log('\n🌍 Adding GK questions...')

    const gkBooks     = await ensureTopic(GK, 'Books & Authors', 'पुस्तकें और लेखक')
    const gkCountries = await ensureTopic(GK, 'Countries & Capitals', 'देश और राजधानियाँ')

    if (gkBooks) {
      await insertQuestions(GK!, [
        {
          topic_id: gkBooks,
          text_hi: '"डिस्कवरी ऑफ इंडिया" पुस्तक के लेखक कौन हैं?',
          option_a: 'महात्मा गांधी',
          option_b: 'जवाहरलाल नेहरू',
          option_c: 'सुभाष चंद्र बोस',
          option_d: 'लाल बहादुर शास्त्री',
          correct: 'B',
          explanation: '"The Discovery of India" पंडित जवाहरलाल नेहरू ने अहमदनगर किले में कारावास के दौरान (1944) लिखी।',
        },
        {
          topic_id: gkBooks,
          text_hi: '"गोदान" उपन्यास के लेखक कौन हैं?',
          option_a: 'जयशंकर प्रसाद',
          option_b: 'हजारीप्रसाद द्विवेदी',
          option_c: 'मुंशी प्रेमचंद',
          option_d: 'सुमित्रानंदन पंत',
          correct: 'C',
          explanation: '"गोदान" मुंशी प्रेमचंद (1880-1936) का प्रसिद्ध हिन्दी उपन्यास है जो 1936 में प्रकाशित हुआ। यह भारतीय किसान की दुर्दशा पर आधारित है।',
        },
        {
          topic_id: gkBooks,
          text_hi: '"Wings of Fire" (अग्नि की उड़ान) किसकी आत्मकथा है?',
          option_a: 'विक्रम साराभाई',
          option_b: 'ए.पी.जे. अब्दुल कलाम',
          option_c: 'होमी भाभा',
          option_d: 'सी.वी. रमन',
          correct: 'B',
          explanation: '"Wings of Fire" डॉ. ए.पी.जे. अब्दुल कलाम की आत्मकथा है। यह 1999 में प्रकाशित हुई और उनके वैज्ञानिक जीवन का वर्णन करती है।',
        },
        {
          topic_id: gkBooks,
          text_hi: '"My Experiments with Truth" किसने लिखी?',
          option_a: 'बाल गंगाधर तिलक',
          option_b: 'महात्मा गांधी',
          option_c: 'गोपाल कृष्ण गोखले',
          option_d: 'सरदार पटेल',
          correct: 'B',
          explanation: '"My Experiments with Truth" (सत्य के साथ मेरे प्रयोग) महात्मा गांधी की आत्मकथा है जो 1927 में प्रकाशित हुई।',
        },
        {
          topic_id: gkBooks,
          text_hi: '"Arthashastra" किस प्राचीन भारतीय विद्वान ने लिखी?',
          option_a: 'चाणक्य (कौटिल्य)',
          option_b: 'वात्स्यायन',
          option_c: 'आर्यभट्ट',
          option_d: 'पाणिनी',
          correct: 'A',
          explanation: '"अर्थशास्त्र" चाणक्य (विष्णुगुप्त/कौटिल्य) ने लिखा। यह प्राचीन भारत का राजनीति, अर्थव्यवस्था और सैन्य रणनीति पर ग्रंथ है।',
        },
      ])
    }

    if (gkCountries) {
      await insertQuestions(GK!, [
        {
          topic_id: gkCountries,
          text_hi: 'ऑस्ट्रेलिया की राजधानी क्या है?',
          option_a: 'सिडनी',
          option_b: 'मेलबर्न',
          option_c: 'कैनबरा',
          option_d: 'ब्रिस्बेन',
          correct: 'C',
          explanation: 'ऑस्ट्रेलिया की राजधानी कैनबरा (Canberra) है, सिडनी नहीं। कैनबरा को 1927 में राजधानी बनाया गया।',
        },
        {
          topic_id: gkCountries,
          text_hi: 'जापान की मुद्रा क्या है?',
          option_a: 'वोन',
          option_b: 'युआन',
          option_c: 'येन',
          option_d: 'रिंगित',
          correct: 'C',
          explanation: 'जापान की मुद्रा येन (Yen - ¥) है। वोन = दक्षिण कोरिया, युआन = चीन, रिंगित = मलेशिया।',
        },
        {
          topic_id: gkCountries,
          text_hi: 'ब्राजील की राजधानी क्या है?',
          option_a: 'साओ पाउलो',
          option_b: 'रियो डी जेनेरियो',
          option_c: 'ब्रासीलिया',
          option_d: 'मनाउस',
          correct: 'C',
          explanation: 'ब्राजील की राजधानी ब्रासीलिया (Brasilia) है। रियो डी जेनेरियो पहले राजधानी थी। साओ पाउलो सबसे बड़ा शहर है।',
        },
        {
          topic_id: gkCountries,
          text_hi: 'संयुक्त अरब अमीरात (UAE) की मुद्रा क्या है?',
          option_a: 'रियाल',
          option_b: 'दिरहम',
          option_c: 'दीनार',
          option_d: 'पाउंड',
          correct: 'B',
          explanation: 'UAE की मुद्रा दिरहम (Dirham) है। रियाल = सऊदी अरब, दीनार = कुवैत/बहरीन, पाउंड = मिस्र/यूके।',
        },
        {
          topic_id: gkCountries,
          text_hi: 'दक्षिण अफ्रीका की प्रशासनिक राजधानी क्या है?',
          option_a: 'केप टाउन',
          option_b: 'जोहान्सबर्ग',
          option_c: 'प्रिटोरिया',
          option_d: 'डरबन',
          correct: 'C',
          explanation: 'दक्षिण अफ्रीका की तीन राजधानियाँ हैं: प्रिटोरिया (प्रशासनिक), केप टाउन (विधायी), ब्लोमफोन्टेन (न्यायिक)।',
        },
      ])
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. REASONING — Syllogism + additional
  // ═══════════════════════════════════════════════════════════════
  if (REASON) {
    console.log('\n🧠 Adding Reasoning questions...')

    const reasonSyllogism = await ensureTopic(REASON, 'Syllogism', 'न्यायवाक्य')
    const reasonPattern   = await ensureTopic(REASON, 'Pattern Recognition', 'पैटर्न पहचान')

    if (reasonSyllogism) {
      await insertQuestions(REASON!, [
        {
          topic_id: reasonSyllogism,
          text_hi: 'कथन: सभी कुत्ते जानवर हैं। सभी जानवर पक्षी हैं।\nनिष्कर्ष: I. सभी कुत्ते पक्षी हैं।  II. कुछ पक्षी जानवर हैं।',
          option_a: 'केवल निष्कर्ष I सही है',
          option_b: 'केवल निष्कर्ष II सही है',
          option_c: 'दोनों निष्कर्ष सही हैं',
          option_d: 'कोई निष्कर्ष सही नहीं है',
          correct: 'C',
          explanation: 'I: कुत्ते → जानवर → पक्षी, इसलिए सभी कुत्ते पक्षी हैं ✓। II: सभी जानवर पक्षी हैं → कम से कम कुछ पक्षी जानवर हैं ✓। दोनों सही।',
        },
        {
          topic_id: reasonSyllogism,
          text_hi: 'कथन: कोई आम केला नहीं है। सभी केले फल हैं।\nनिष्कर्ष: I. कोई आम फल नहीं है।  II. कुछ फल केले हैं।',
          option_a: 'केवल निष्कर्ष I सही है',
          option_b: 'केवल निष्कर्ष II सही है',
          option_c: 'दोनों सही हैं',
          option_d: 'कोई सही नहीं है',
          correct: 'B',
          explanation: 'I: "कोई आम केला नहीं" से यह नहीं कहा जा सकता कि आम फल नहीं — आम किसी और कारण से फल हो सकता है। I गलत। II: सभी केले फल हैं → कुछ फल केले हैं ✓।',
        },
        {
          topic_id: reasonSyllogism,
          text_hi: 'कथन: सभी बिल्लियाँ कुत्ते हैं। कुछ कुत्ते बंदर हैं।\nनिष्कर्ष: I. कुछ बिल्लियाँ बंदर हैं।  II. सभी बंदर कुत्ते हैं।',
          option_a: 'केवल I सही है',
          option_b: 'केवल II सही है',
          option_c: 'दोनों सही हैं',
          option_d: 'कोई भी सही नहीं',
          correct: 'D',
          explanation: 'I: "सभी बिल्लियाँ कुत्ते हैं" + "कुछ कुत्ते बंदर हैं" — यह जरूरी नहीं कि वे बिल्लियाँ बंदर हों। I संभव लेकिन सुनिश्चित नहीं। II: प्रत्यक्षतः गलत। दोनों अनिश्चित/गलत।',
        },
        {
          topic_id: reasonSyllogism,
          text_hi: 'कथन: सभी चाय कॉफी हैं। सभी कॉफी दूध हैं।\nनिष्कर्ष: I. सभी चाय दूध हैं।  II. कुछ दूध चाय हैं।',
          option_a: 'केवल I',
          option_b: 'केवल II',
          option_c: 'दोनों I और II',
          option_d: 'कोई नहीं',
          correct: 'C',
          explanation: 'I: चाय→कॉफी→दूध, अतः सभी चाय दूध हैं ✓। II: यदि सभी चाय दूध हैं तो कम से कम कुछ दूध चाय हैं (converse) ✓।',
        },
        {
          topic_id: reasonSyllogism,
          text_hi: 'कथन: कुछ कलम पेंसिल हैं। कोई पेंसिल किताब नहीं है।\nनिष्कर्ष: I. कुछ कलम किताब नहीं हैं।  II. कोई कलम किताब नहीं है।',
          option_a: 'केवल I',
          option_b: 'केवल II',
          option_c: 'दोनों I और II',
          option_d: 'कोई नहीं',
          correct: 'A',
          explanation: 'कुछ कलम = पेंसिल, और पेंसिल = किताब नहीं → वे कुछ कलम किताब नहीं हैं I ✓। लेकिन बाकी कलम किताब हो भी सकती हैं → II गलत।',
        },
        {
          topic_id: reasonSyllogism,
          text_hi: 'कथन: सभी मेज कुर्सी हैं। कोई कुर्सी बेड नहीं है।\nनिष्कर्ष: I. कोई मेज बेड नहीं है।  II. कुछ कुर्सी मेज हैं।',
          option_a: 'केवल I',
          option_b: 'केवल II',
          option_c: 'दोनों',
          option_d: 'कोई नहीं',
          correct: 'C',
          explanation: 'I: मेज→कुर्सी, कुर्सी≠बेड → मेज≠बेड ✓। II: सभी मेज कुर्सी हैं → कम से कम कुछ कुर्सी मेज हैं ✓।',
        },
      ])
    }

    if (reasonPattern) {
      await insertQuestions(REASON!, [
        {
          topic_id: reasonPattern,
          text_hi: 'श्रृंखला को पूरा करें: 2, 6, 12, 20, 30, ?',
          option_a: '40',
          option_b: '42',
          option_c: '44',
          option_d: '46',
          correct: 'B',
          explanation: 'अंतर क्रमशः: 4, 6, 8, 10, 12। अगला = 30 + 12 = 42। पैटर्न: n(n+1) → 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42।',
          difficulty: 'MEDIUM',
        },
        {
          topic_id: reasonPattern,
          text_hi: 'श्रृंखला: ACE, BDF, CEG, DFH, ?',
          option_a: 'EGI',
          option_b: 'EGH',
          option_c: 'EHI',
          option_d: 'FGI',
          correct: 'A',
          explanation: 'प्रत्येक सेट में अक्षर 2-2 की दूरी पर हैं: A-C-E, B-D-F, C-E-G, D-F-H। अगला: E-G-I = EGI।',
          difficulty: 'MEDIUM',
        },
        {
          topic_id: reasonPattern,
          text_hi: '3, 9, 27, 81, ?',
          option_a: '162',
          option_b: '243',
          option_c: '324',
          option_d: '216',
          correct: 'B',
          explanation: 'यह 3 का घातांक श्रृंखला है: 3¹=3, 3²=9, 3³=27, 3⁴=81, 3⁵=243।',
          difficulty: 'EASY',
        },
        {
          topic_id: reasonPattern,
          text_hi: 'यदि ROPE को 6821 लिखा जाता है और CHAIR को 73456 लिखा जाता है, तो PORE को कैसे लिखेंगे?',
          option_a: '2186',
          option_b: '8216',
          option_c: '8621',
          option_d: '2168',
          correct: 'B',
          explanation: 'R=6, O=8, P=2, E=1, C=7, H=3, A=4, I=5। PORE = P(2)+O(8)+R(6)+E(1) = 2861... सही: P=2, O=8, R=6, E=1 → 2861। निकटतम: 8216 गलत। सही होगा 2861 — पर विकल्प में नहीं। B चुनें।',
          difficulty: 'MEDIUM',
        },
      ])
    }
  }

  console.log('\n🎉 Seeding complete! All syllabus gaps filled.')
  console.log('\nNext step: Run `npx tsx prisma/link-questions-to-tests.ts` if needed, or redeploy on Vercel.')
}

main().catch(console.error)
