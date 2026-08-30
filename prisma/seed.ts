import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

async function main() {
  console.log('🌱 Seeding MP Patwari 2026 database...')

  // Clear tables (reverse FK order)
  await supabase.from('question_attempts').delete().not('id', 'is', null)
  await supabase.from('test_attempts').delete().not('id', 'is', null)
  await supabase.from('test_questions').delete().not('id', 'is', null)
  await supabase.from('mock_tests').delete().not('id', 'is', null)
  await supabase.from('questions').delete().not('id', 'is', null)
  await supabase.from('topics').delete().not('id', 'is', null)
  await supabase.from('subjects').delete().not('id', 'is', null)
  await supabase.from('users').delete().not('id', 'is', null)

  // Users
  const adminPw = await bcrypt.hash('admin@2026', 12)
  const testPw = await bcrypt.hash('test1234', 12)
  await supabase.from('users').insert([
    { name: 'Admin', email: 'admin@mppatwari.in', password: adminPw, role: 'ADMIN' },
    { name: 'परीक्षार्थी', email: 'test@mppatwari.in', password: testPw, role: 'USER' },
  ])
  console.log('✓ Users created')

  // Subjects
  const { data: subRows } = await supabase.from('subjects').insert([
    { name: 'General Knowledge & MP GK', name_hi: 'सामान्य ज्ञान एवं MP GK', code: 'GK', sort_order: 1, color: '#3b82f6' },
    { name: 'General Hindi', name_hi: 'सामान्य हिन्दी', code: 'HIN', sort_order: 2, color: '#8b5cf6' },
    { name: 'General Mathematics', name_hi: 'सामान्य गणित', code: 'MATH', sort_order: 3, color: '#f59e0b' },
    { name: 'General English', name_hi: 'सामान्य अंग्रेजी', code: 'ENG', sort_order: 4, color: '#10b981' },
    { name: 'General Reasoning', name_hi: 'सामान्य तर्कशक्ति', code: 'REASON', sort_order: 5, color: '#ef4444' },
    { name: 'Computer Knowledge', name_hi: 'कंप्यूटर ज्ञान', code: 'COMP', sort_order: 6, color: '#06b6d4' },
    { name: 'Rural Economy & Panchayati Raj', name_hi: 'ग्रामीण अर्थव्यवस्था एवं पंचायती राज', code: 'RURAL', sort_order: 7, color: '#84cc16' },
  ]).select()
  const [gk, hin, math, eng, reason, comp, rural] = subRows!
  console.log('✓ Subjects created')

  // Topics
  const topicsData = [
    { name: 'MP History', name_hi: 'मध्यप्रदेश का इतिहास', subject_id: gk.id },
    { name: 'MP Geography', name_hi: 'मध्यप्रदेश भूगोल', subject_id: gk.id },
    { name: 'MP Culture & Art', name_hi: 'मध्यप्रदेश संस्कृति एवं कला', subject_id: gk.id },
    { name: 'MP Economy & Industry', name_hi: 'मध्यप्रदेश अर्थव्यवस्था', subject_id: gk.id },
    { name: 'MP Government Schemes', name_hi: 'मध्यप्रदेश शासन योजनाएं', subject_id: gk.id },
    { name: 'India GK', name_hi: 'भारतीय सामान्य ज्ञान', subject_id: gk.id },
    { name: 'Current Affairs', name_hi: 'करंट अफेयर्स', subject_id: gk.id },
    { name: 'Indian Polity', name_hi: 'भारतीय राजव्यवस्था', subject_id: gk.id },
    { name: 'Sandhi Samas', name_hi: 'संधि-समास', subject_id: hin.id },
    { name: 'Vyakaran', name_hi: 'हिन्दी व्याकरण', subject_id: hin.id },
    { name: 'Muhavare Lokokti', name_hi: 'मुहावरे एवं लोकोक्तियाँ', subject_id: hin.id },
    { name: 'Ras Chhand Alankar', name_hi: 'रस-छंद-अलंकार', subject_id: hin.id },
    { name: 'Hindi Literature', name_hi: 'हिंदी साहित्य', subject_id: hin.id },
    { name: 'Number System', name_hi: 'संख्या प्रणाली', subject_id: math.id },
    { name: 'Percentage Profit Loss', name_hi: 'प्रतिशत, लाभ-हानि', subject_id: math.id },
    { name: 'Simple Compound Interest', name_hi: 'साधारण एवं चक्रवृद्धि ब्याज', subject_id: math.id },
    { name: 'Time Speed Distance', name_hi: 'समय, गति, दूरी', subject_id: math.id },
    { name: 'Mensuration', name_hi: 'क्षेत्रमिति', subject_id: math.id },
    { name: 'Algebra', name_hi: 'बीजगणित', subject_id: math.id },
    { name: 'Ratio Proportion', name_hi: 'अनुपात-समानुपात', subject_id: math.id },
    { name: 'Grammar', name_hi: 'Grammar', subject_id: eng.id },
    { name: 'Vocabulary', name_hi: 'Vocabulary', subject_id: eng.id },
    { name: 'Comprehension', name_hi: 'Comprehension', subject_id: eng.id },
    { name: 'Series Analogy', name_hi: 'श्रृंखला एवं सादृश्यता', subject_id: reason.id },
    { name: 'Coding Decoding', name_hi: 'कोडिंग-डिकोडिंग', subject_id: reason.id },
    { name: 'Blood Relations', name_hi: 'रक्त संबंध', subject_id: reason.id },
    { name: 'Direction Sense', name_hi: 'दिशा ज्ञान', subject_id: reason.id },
    { name: 'Logical Reasoning', name_hi: 'तार्किक अनुमान', subject_id: reason.id },
    { name: 'Computer Basics', name_hi: 'कंप्यूटर की मूल बातें', subject_id: comp.id },
    { name: 'MS Office', name_hi: 'MS Office', subject_id: comp.id },
    { name: 'Internet & Networking', name_hi: 'इंटरनेट एवं नेटवर्किंग', subject_id: comp.id },
    { name: 'Operating System', name_hi: 'ऑपरेटिंग सिस्टम', subject_id: comp.id },
    { name: 'Panchayati Raj System', name_hi: 'पंचायती राज व्यवस्था', subject_id: rural.id },
    { name: 'Rural Development', name_hi: 'ग्रामीण विकास', subject_id: rural.id },
    { name: 'Land Revenue', name_hi: 'भू-राजस्व', subject_id: rural.id },
    { name: 'Agriculture', name_hi: 'कृषि', subject_id: rural.id },
  ]
  const { data: topicRows } = await supabase.from('topics').insert(topicsData).select()
  const T: Record<string, string> = {}
  topicRows!.forEach(t => { T[t.name_hi] = t.id })
  console.log('✓ Topics created')

  // Questions
  const questions = [
    { text_hi: 'मध्यप्रदेश राज्य का गठन कब हुआ था?', option_a: '1 नवंबर 1956', option_b: '1 नवंबर 1950', option_c: '26 जनवरी 1950', option_d: '15 अगस्त 1947', correct: 'A', explanation: 'मध्यप्रदेश राज्य का गठन राज्य पुनर्गठन आयोग की सिफारिशों के आधार पर 1 नवंबर 1956 को हुआ था।', subject_id: gk.id, topic_id: T['मध्यप्रदेश का इतिहास'], difficulty: 'EASY', source: 'MPESB Previous Pattern' },
    { text_hi: 'मध्यप्रदेश के प्रथम मुख्यमंत्री कौन थे?', option_a: 'श्यामा चरण शुक्ल', option_b: 'रवि शंकर शुक्ल', option_c: 'कैलाश नाथ काटजू', option_d: 'द्वारका प्रसाद मिश्र', correct: 'B', explanation: 'पं. रवि शंकर शुक्ल मध्यप्रदेश के प्रथम मुख्यमंत्री थे।', subject_id: gk.id, topic_id: T['मध्यप्रदेश का इतिहास'], difficulty: 'MEDIUM', source: 'MPESB Previous Pattern' },
    { text_hi: 'सन् 2000 में मध्यप्रदेश से अलग कौन-सा राज्य बना?', option_a: 'उत्तराखंड', option_b: 'झारखंड', option_c: 'छत्तीसगढ़', option_d: 'तेलंगाना', correct: 'C', explanation: '1 नवंबर 2000 को मध्यप्रदेश के दक्षिण-पूर्वी हिस्से को अलग कर छत्तीसगढ़ राज्य बनाया गया।', subject_id: gk.id, topic_id: T['मध्यप्रदेश का इतिहास'], difficulty: 'EASY', source: 'MPESB Previous Pattern' },
    { text_hi: 'मध्यप्रदेश की राजधानी क्या है?', option_a: 'इंदौर', option_b: 'ग्वालियर', option_c: 'जबलपुर', option_d: 'भोपाल', correct: 'D', explanation: 'भोपाल मध्यप्रदेश की राजधानी है।', subject_id: gk.id, topic_id: T['मध्यप्रदेश का इतिहास'], difficulty: 'EASY', source: 'MPESB Previous Pattern' },
    { text_hi: 'चंदेल वंश की राजधानी कौन-सी थी?', option_a: 'उज्जैन', option_b: 'महोबा', option_c: 'धार', option_d: 'खजुराहो', correct: 'B', explanation: 'चंदेल वंश की राजधानी महोबा थी।', subject_id: gk.id, topic_id: T['मध्यप्रदेश का इतिहास'], difficulty: 'HARD', source: 'MPESB Previous Pattern' },
    { text_hi: 'मध्यप्रदेश का सबसे बड़ा जिला (क्षेत्रफल में) कौन-सा है?', option_a: 'सागर', option_b: 'बालाघाट', option_c: 'छिंदवाड़ा', option_d: 'सिवनी', correct: 'C', explanation: 'छिंदवाड़ा जिला क्षेत्रफल की दृष्टि से मध्यप्रदेश का सबसे बड़ा जिला है।', subject_id: gk.id, topic_id: T['मध्यप्रदेश भूगोल'], difficulty: 'MEDIUM', source: 'MPESB Previous Pattern' },
    { text_hi: 'मध्यप्रदेश की सबसे लंबी नदी कौन-सी है?', option_a: 'बेतवा', option_b: 'नर्मदा', option_c: 'ताप्ती', option_d: 'चंबल', correct: 'B', explanation: 'नर्मदा नदी मध्यप्रदेश की सबसे लंबी नदी है।', subject_id: gk.id, topic_id: T['मध्यप्रदेश भूगोल'], difficulty: 'EASY', source: 'MPESB Previous Pattern' },
    { text_hi: 'मध्यप्रदेश की सर्वोच्च चोटी कौन-सी है?', option_a: 'सतपुड़ा', option_b: 'धूपगढ़', option_c: 'अमरकंटक', option_d: 'पचमढ़ी', correct: 'B', explanation: 'धूपगढ़ (1350 मीटर) मध्यप्रदेश की सर्वोच्च चोटी है।', subject_id: gk.id, topic_id: T['मध्यप्रदेश भूगोल'], difficulty: 'MEDIUM', source: 'MPESB Previous Pattern' },
    { text_hi: 'इंदिरा सागर बाँध किस नदी पर बना है?', option_a: 'चंबल', option_b: 'बेतवा', option_c: 'नर्मदा', option_d: 'ताप्ती', correct: 'C', explanation: 'इंदिरा सागर बाँध नर्मदा नदी पर खंडवा जिले में स्थित है।', subject_id: gk.id, topic_id: T['मध्यप्रदेश भूगोल'], difficulty: 'MEDIUM', source: 'MPESB Previous Pattern' },
    { text_hi: 'मध्यप्रदेश में कुल कितने जिले हैं?', option_a: '50', option_b: '51', option_c: '52', option_d: '55', correct: 'C', explanation: 'मध्यप्रदेश में वर्तमान में कुल 52 जिले हैं।', subject_id: gk.id, topic_id: T['मध्यप्रदेश भूगोल'], difficulty: 'MEDIUM', source: 'MPESB Previous Pattern' },
    { text_hi: 'खजुराहो के मंदिर किस वंश ने बनवाए?', option_a: 'गुप्त वंश', option_b: 'मराठा वंश', option_c: 'चंदेल वंश', option_d: 'परमार वंश', correct: 'C', explanation: 'खजुराहो के विश्वप्रसिद्ध मंदिर चंदेल राजपूत शासकों ने बनवाए।', subject_id: gk.id, topic_id: T['मध्यप्रदेश संस्कृति एवं कला'], difficulty: 'EASY', source: 'MPESB Previous Pattern' },
    { text_hi: 'मध्यप्रदेश में "सांची स्तूप" किस जिले में स्थित है?', option_a: 'भोपाल', option_b: 'रायसेन', option_c: 'विदिशा', option_d: 'सागर', correct: 'B', explanation: 'सांची स्तूप रायसेन जिले में स्थित है।', subject_id: gk.id, topic_id: T['मध्यप्रदेश संस्कृति एवं कला'], difficulty: 'MEDIUM', source: 'MPESB Previous Pattern' },
    { text_hi: '"माधव राष्ट्रीय उद्यान" मध्यप्रदेश के किस जिले में है?', option_a: 'शिवपुरी', option_b: 'पन्ना', option_c: 'कान्हा', option_d: 'भोपाल', correct: 'A', explanation: 'माधव राष्ट्रीय उद्यान शिवपुरी जिले में स्थित है।', subject_id: gk.id, topic_id: T['मध्यप्रदेश भूगोल'], difficulty: 'MEDIUM', source: 'MPESB Previous Pattern' },
    { text_hi: 'मध्यप्रदेश के किस शहर को "झीलों का शहर" कहा जाता है?', option_a: 'जबलपुर', option_b: 'भोपाल', option_c: 'इंदौर', option_d: 'उज्जैन', correct: 'B', explanation: 'भोपाल को "झीलों का शहर" कहा जाता है।', subject_id: gk.id, topic_id: T['मध्यप्रदेश संस्कृति एवं कला'], difficulty: 'EASY', source: 'MPESB Previous Pattern' },
    { text_hi: 'मध्यप्रदेश सरकार की "लाड़ली लक्ष्मी योजना" किस वर्ष शुरू हुई?', option_a: '2004', option_b: '2007', option_c: '2010', option_d: '2012', correct: 'B', explanation: 'लाड़ली लक्ष्मी योजना मध्यप्रदेश सरकार ने 2007 में शुरू की।', subject_id: gk.id, topic_id: T['मध्यप्रदेश शासन योजनाएं'], difficulty: 'MEDIUM', source: 'MPESB Previous Pattern' },
    { text_hi: 'भारत का सर्वोच्च नागरिक पुरस्कार कौन-सा है?', option_a: 'पद्म विभूषण', option_b: 'भारत रत्न', option_c: 'अर्जुन पुरस्कार', option_d: 'पद्म भूषण', correct: 'B', explanation: 'भारत रत्न भारत का सर्वोच्च नागरिक पुरस्कार है।', subject_id: gk.id, topic_id: T['भारतीय सामान्य ज्ञान'], difficulty: 'EASY', source: 'MPESB Previous Pattern' },
    { text_hi: 'भारतीय संविधान के किस अनुच्छेद के अंतर्गत आपातकाल की घोषणा की जाती है?', option_a: 'अनुच्छेद 352', option_b: 'अनुच्छेद 356', option_c: 'अनुच्छेद 370', option_d: 'अनुच्छेद 360', correct: 'A', explanation: 'भारतीय संविधान के अनुच्छेद 352 के तहत राष्ट्रीय आपातकाल की घोषणा की जाती है।', subject_id: gk.id, topic_id: T['भारतीय राजव्यवस्था'], difficulty: 'HARD', source: 'MPESB Previous Pattern' },
    { text_hi: 'पंचायती राज व्यवस्था को संवैधानिक दर्जा किस संशोधन से मिला?', option_a: '72वाँ संशोधन', option_b: '73वाँ संशोधन', option_c: '74वाँ संशोधन', option_d: '75वाँ संशोधन', correct: 'B', explanation: '73वें संविधान संशोधन अधिनियम 1992 द्वारा पंचायती राज को संवैधानिक दर्जा मिला।', subject_id: gk.id, topic_id: T['भारतीय राजव्यवस्था'], difficulty: 'MEDIUM', source: 'MPESB Previous Pattern' },
    { text_hi: 'भारत में लोकसभा की कुल सीटें कितनी हैं?', option_a: '542', option_b: '543', option_c: '544', option_d: '545', correct: 'B', explanation: 'लोकसभा में 543 निर्वाचित सीटें हैं।', subject_id: gk.id, topic_id: T['भारतीय राजव्यवस्था'], difficulty: 'EASY', source: 'MPESB Previous Pattern' },
    { text_hi: 'भारत के राष्ट्रपति का कार्यकाल कितने वर्षों का होता है?', option_a: '4 वर्ष', option_b: '6 वर्ष', option_c: '5 वर्ष', option_d: '3 वर्ष', correct: 'C', explanation: 'भारत के राष्ट्रपति का कार्यकाल 5 वर्ष का होता है।', subject_id: gk.id, topic_id: T['भारतीय राजव्यवस्था'], difficulty: 'EASY', source: 'MPESB Previous Pattern' },
    { text_hi: 'निम्नलिखित में से "स्वर संधि" का उदाहरण कौन-सा है?', option_a: 'दिगंबर', option_b: 'देवालय', option_c: 'सज्जन', option_d: 'उज्ज्वल', correct: 'B', explanation: '"देवालय" स्वर संधि का उदाहरण है: देव + आलय।', subject_id: hin.id, topic_id: T['संधि-समास'], difficulty: 'MEDIUM', source: 'MPESB Hindi Pattern' },
    { text_hi: '"राजा-प्रजा" में कौन-सा समास है?', option_a: 'तत्पुरुष समास', option_b: 'कर्मधारय समास', option_c: 'द्वंद्व समास', option_d: 'अव्ययीभाव समास', correct: 'C', explanation: '"राजा-प्रजा" में द्वंद्व समास है।', subject_id: hin.id, topic_id: T['संधि-समास'], difficulty: 'MEDIUM', source: 'MPESB Hindi Pattern' },
    { text_hi: '"अनुनासिक" का सही अर्थ क्या है?', option_a: 'मुख से बोला जाने वाला वर्ण', option_b: 'नाक और मुख दोनों से बोला जाने वाला वर्ण', option_c: 'केवल नाक से बोला जाने वाला वर्ण', option_d: 'कठोर वर्ण', correct: 'B', explanation: 'अनुनासिक वे वर्ण हैं जिनका उच्चारण नाक और मुख दोनों से होता है।', subject_id: hin.id, topic_id: T['हिन्दी व्याकरण'], difficulty: 'MEDIUM', source: 'MPESB Hindi Pattern' },
    { text_hi: '"अंधे के हाथ बटेर लगना" मुहावरे का सही अर्थ है —', option_a: 'बिना परिश्रम सफलता मिलना', option_b: 'अयोग्य व्यक्ति को बड़ी सफलता मिलना', option_c: 'शिकार में अंधे की जीत', option_d: 'अचानक लाभ होना', correct: 'B', explanation: 'अयोग्य या अपात्र व्यक्ति को अचानक बड़ी सफलता मिलना।', subject_id: hin.id, topic_id: T['मुहावरे एवं लोकोक्तियाँ'], difficulty: 'MEDIUM', source: 'MPESB Hindi Pattern' },
    { text_hi: '"जो बीत गई सो बात गई" — यह किसकी कविता की पंक्ति है?', option_a: 'सुमित्रानंदन पंत', option_b: 'हरिवंश राय बच्चन', option_c: 'महादेवी वर्मा', option_d: 'सूर्यकांत त्रिपाठी "निराला"', correct: 'B', explanation: 'हरिवंश राय बच्चन की प्रसिद्ध कविता की पंक्ति है।', subject_id: hin.id, topic_id: T['हिंदी साहित्य'], difficulty: 'MEDIUM', source: 'MPESB Hindi Pattern' },
    { text_hi: '"तद्भव" शब्द का अर्थ है —', option_a: 'संस्कृत से लिया गया शब्द', option_b: 'संस्कृत से बिगड़कर बना हिंदी शब्द', option_c: 'विदेशी भाषा से लिया गया शब्द', option_d: 'हिंदी में नया बना शब्द', correct: 'B', explanation: 'तद्भव शब्द संस्कृत के मूल शब्दों से परिवर्तित होकर बने हैं।', subject_id: hin.id, topic_id: T['हिन्दी व्याकरण'], difficulty: 'MEDIUM', source: 'MPESB Hindi Pattern' },
    { text_hi: 'वीर रस का स्थायी भाव क्या है?', option_a: 'क्रोध', option_b: 'उत्साह', option_c: 'भय', option_d: 'श्रृंगार', correct: 'B', explanation: 'वीर रस का स्थायी भाव "उत्साह" है।', subject_id: hin.id, topic_id: T['रस-छंद-अलंकार'], difficulty: 'MEDIUM', source: 'MPESB Hindi Pattern' },
    { text_hi: 'यदि किसी संख्या का 20% = 80 हो, तो वह संख्या क्या है?', option_a: '300', option_b: '400', option_c: '500', option_d: '160', correct: 'B', explanation: 'x × 20/100 = 80 → x = 400', subject_id: math.id, topic_id: T['प्रतिशत, लाभ-हानि'], difficulty: 'EASY', source: 'MPESB Math Pattern' },
    { text_hi: 'एक वस्तु ₹480 में खरीदकर ₹600 में बेची गई। लाभ का प्रतिशत क्या होगा?', option_a: '20%', option_b: '25%', option_c: '15%', option_d: '22%', correct: 'B', explanation: 'लाभ% = (120/480) × 100 = 25%', subject_id: math.id, topic_id: T['प्रतिशत, लाभ-हानि'], difficulty: 'EASY', source: 'MPESB Math Pattern' },
    { text_hi: '₹5000 का 2 वर्षों का 10% वार्षिक दर से साधारण ब्याज कितना होगा?', option_a: '₹500', option_b: '₹1000', option_c: '₹1100', option_d: '₹2000', correct: 'B', explanation: 'SI = (5000 × 10 × 2)/100 = ₹1000', subject_id: math.id, topic_id: T['साधारण एवं चक्रवृद्धि ब्याज'], difficulty: 'EASY', source: 'MPESB Math Pattern' },
    { text_hi: '₹8000 पर 2 वर्षों के लिए 10% वार्षिक दर से चक्रवृद्धि ब्याज कितना होगा?', option_a: '₹1600', option_b: '₹1680', option_c: '₹1700', option_d: '₹2000', correct: 'B', explanation: 'CI = 800 + 880 = ₹1680', subject_id: math.id, topic_id: T['साधारण एवं चक्रवृद्धि ब्याज'], difficulty: 'MEDIUM', source: 'MPESB Math Pattern' },
    { text_hi: 'एक ट्रेन 72 km/h की गति से चलती है। 10 सेकंड में वह कितने मीटर तय करेगी?', option_a: '150 मीटर', option_b: '200 मीटर', option_c: '250 मीटर', option_d: '180 मीटर', correct: 'B', explanation: '72 km/h = 20 m/s → 20×10 = 200m', subject_id: math.id, topic_id: T['समय, गति, दूरी'], difficulty: 'MEDIUM', source: 'MPESB Math Pattern' },
    { text_hi: 'एक आयत की लंबाई 12 cm और चौड़ाई 8 cm है। उसका क्षेत्रफल क्या होगा?', option_a: '40 cm²', option_b: '80 cm²', option_c: '96 cm²', option_d: '48 cm²', correct: 'C', explanation: '12 × 8 = 96 cm²', subject_id: math.id, topic_id: T['क्षेत्रमिति'], difficulty: 'EASY', source: 'MPESB Math Pattern' },
    { text_hi: '3 : 4 के अनुपात में दो संख्याएँ हैं। यदि उनका योग 105 हो, तो बड़ी संख्या क्या होगी?', option_a: '45', option_b: '60', option_c: '63', option_d: '70', correct: 'B', explanation: '7x=105 → x=15 → 4×15=60', subject_id: math.id, topic_id: T['अनुपात-समानुपात'], difficulty: 'MEDIUM', source: 'MPESB Math Pattern' },
    { text_hi: 'यदि 2x + 3 = 11 हो, तो x का मान क्या होगा?', option_a: '3', option_b: '4', option_c: '5', option_d: '2', correct: 'B', explanation: '2x=8 → x=4', subject_id: math.id, topic_id: T['बीजगणित'], difficulty: 'EASY', source: 'MPESB Math Pattern' },
    { text_hi: 'LCM(12, 18) का मान क्या है?', option_a: '36', option_b: '48', option_c: '72', option_d: '54', correct: 'A', explanation: 'LCM = 2² × 3² = 36', subject_id: math.id, topic_id: T['संख्या प्रणाली'], difficulty: 'EASY', source: 'MPESB Math Pattern' },
    { text_hi: 'Choose the correct passive voice of: "She writes a letter."', option_a: 'A letter is written by her.', option_b: 'A letter was written by her.', option_c: 'A letter has been written by her.', option_d: 'A letter will be written by her.', correct: 'A', explanation: 'Simple Present → Passive: A letter is written by her.', subject_id: eng.id, topic_id: T['Grammar'], difficulty: 'MEDIUM', source: 'MPESB English Pattern' },
    { text_hi: 'The synonym of "Diligent" is —', option_a: 'Lazy', option_b: 'Hardworking', option_c: 'Careless', option_d: 'Slow', correct: 'B', explanation: '"Diligent" synonym is "Hardworking."', subject_id: eng.id, topic_id: T['Vocabulary'], difficulty: 'MEDIUM', source: 'MPESB English Pattern' },
    { text_hi: 'Fill in the blank: He has been working here ____ 2010.', option_a: 'for', option_b: 'since', option_c: 'from', option_d: 'during', correct: 'B', explanation: '"Since" is used with a specific point in time.', subject_id: eng.id, topic_id: T['Grammar'], difficulty: 'EASY', source: 'MPESB English Pattern' },
    { text_hi: 'The antonym of "Transparent" is —', option_a: 'Clear', option_b: 'Visible', option_c: 'Opaque', option_d: 'Bright', correct: 'C', explanation: 'Antonym of Transparent is Opaque.', subject_id: eng.id, topic_id: T['Vocabulary'], difficulty: 'EASY', source: 'MPESB English Pattern' },
    { text_hi: 'Correct the sentence: "One of the student were absent."', option_a: 'One of the students was absent.', option_b: 'One of the student was absent.', option_c: 'One of the students were absent.', option_d: 'No correction needed.', correct: 'A', explanation: '"One of" takes singular verb.', subject_id: eng.id, topic_id: T['Grammar'], difficulty: 'MEDIUM', source: 'MPESB English Pattern' },
    { text_hi: 'श्रृंखला में अगला पद क्या होगा? 2, 6, 12, 20, 30, ?', option_a: '40', option_b: '42', option_c: '44', option_d: '45', correct: 'B', explanation: '6×7 = 42', subject_id: reason.id, topic_id: T['श्रृंखला एवं सादृश्यता'], difficulty: 'MEDIUM', source: 'MPESB Reasoning Pattern' },
    { text_hi: 'यदि BOOK को DQQM लिखें, तो WORD को कैसे लिखेंगे?', option_a: 'YQTF', option_b: 'YOSF', option_c: 'AQTF', option_d: 'YQRF', correct: 'A', explanation: 'प्रत्येक अक्षर को +2 से बदला जाता है।', subject_id: reason.id, topic_id: T['कोडिंग-डिकोडिंग'], difficulty: 'MEDIUM', source: 'MPESB Reasoning Pattern' },
    { text_hi: 'राम की माँ की बहन का पुत्र राम का क्या लगेगा?', option_a: 'मामा', option_b: 'चाचा', option_c: 'मौसेरा भाई', option_d: 'चचेरा भाई', correct: 'C', explanation: 'मौसी का पुत्र = मौसेरा भाई।', subject_id: reason.id, topic_id: T['रक्त संबंध'], difficulty: 'EASY', source: 'MPESB Reasoning Pattern' },
    { text_hi: 'सूर्योदय से मुँह पूर्व की ओर करके खड़ा व्यक्ति यदि बाईं ओर मुड़े, तो वह किस दिशा में जाएगा?', option_a: 'पश्चिम', option_b: 'उत्तर', option_c: 'दक्षिण', option_d: 'पूर्व', correct: 'B', explanation: 'पूर्व → बायाँ = उत्तर।', subject_id: reason.id, topic_id: T['दिशा ज्ञान'], difficulty: 'EASY', source: 'MPESB Reasoning Pattern' },
    { text_hi: 'निम्नलिखित में विषम (odd one out) कौन-सा है? गुलाब, कमल, चमेली, आम', option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D', correct: 'D', explanation: 'आम फल है, बाकी फूल हैं।', subject_id: reason.id, topic_id: T['श्रृंखला एवं सादृश्यता'], difficulty: 'EASY', source: 'MPESB Reasoning Pattern' },
    { text_hi: 'CPU का पूर्ण रूप क्या है?', option_a: 'Central Processing Unit', option_b: 'Computer Processing Unit', option_c: 'Central Program Utility', option_d: 'Common Processing Unit', correct: 'A', explanation: 'CPU = Central Processing Unit', subject_id: comp.id, topic_id: T['कंप्यूटर की मूल बातें'], difficulty: 'EASY', source: 'MPESB Computer Pattern' },
    { text_hi: 'माइक्रोसॉफ्ट वर्ड में नई फाइल बनाने का शॉर्टकट है —', option_a: 'Ctrl+N', option_b: 'Ctrl+O', option_c: 'Ctrl+S', option_d: 'Ctrl+W', correct: 'A', explanation: 'Ctrl+N = New file', subject_id: comp.id, topic_id: T['MS Office'], difficulty: 'EASY', source: 'MPESB Computer Pattern' },
    { text_hi: 'WWW का पूर्ण रूप क्या है?', option_a: 'World Wide Web', option_b: 'World Wide Window', option_c: 'Wide Web World', option_d: 'Web World Wide', correct: 'A', explanation: 'WWW = World Wide Web', subject_id: comp.id, topic_id: T['इंटरनेट एवं नेटवर्किंग'], difficulty: 'EASY', source: 'MPESB Computer Pattern' },
    { text_hi: 'RAM का पूर्ण रूप क्या है?', option_a: 'Read Access Memory', option_b: 'Random Access Memory', option_c: 'Read And Memory', option_d: 'Random Accessing Module', correct: 'B', explanation: 'RAM = Random Access Memory', subject_id: comp.id, topic_id: T['कंप्यूटर की मूल बातें'], difficulty: 'EASY', source: 'MPESB Computer Pattern' },
    { text_hi: 'विंडोज ऑपरेटिंग सिस्टम किस कंपनी ने बनाया?', option_a: 'Apple', option_b: 'Google', option_c: 'Microsoft', option_d: 'IBM', correct: 'C', explanation: 'Windows OS Microsoft ने बनाया है।', subject_id: comp.id, topic_id: T['ऑपरेटिंग सिस्टम'], difficulty: 'EASY', source: 'MPESB Computer Pattern' },
    { text_hi: 'ईमेल भेजने के लिए किस प्रोटोकॉल का उपयोग होता है?', option_a: 'HTTP', option_b: 'FTP', option_c: 'SMTP', option_d: 'POP3', correct: 'C', explanation: 'SMTP = Simple Mail Transfer Protocol', subject_id: comp.id, topic_id: T['इंटरनेट एवं नेटवर्किंग'], difficulty: 'MEDIUM', source: 'MPESB Computer Pattern' },
    { text_hi: 'मध्यप्रदेश में ग्राम पंचायत के चुनाव कितने वर्षों में होते हैं?', option_a: '3 वर्ष', option_b: '4 वर्ष', option_c: '5 वर्ष', option_d: '6 वर्ष', correct: 'C', explanation: '73वें संशोधन के अनुसार पंचायत का कार्यकाल 5 वर्ष।', subject_id: rural.id, topic_id: T['पंचायती राज व्यवस्था'], difficulty: 'EASY', source: 'MPESB Rural Economy Pattern' },
    { text_hi: 'पंचायती राज में ग्राम स्तर पर सबसे छोटी इकाई कौन-सी है?', option_a: 'ग्राम सभा', option_b: 'ग्राम पंचायत', option_c: 'जनपद पंचायत', option_d: 'जिला पंचायत', correct: 'A', explanation: 'ग्राम सभा सबसे छोटी और मूल इकाई है।', subject_id: rural.id, topic_id: T['पंचायती राज व्यवस्था'], difficulty: 'EASY', source: 'MPESB Rural Economy Pattern' },
    { text_hi: 'मध्यप्रदेश में पंचायती राज की कितनी स्तरीय व्यवस्था है?', option_a: 'एक स्तरीय', option_b: 'दो स्तरीय', option_c: 'तीन स्तरीय', option_d: 'चार स्तरीय', correct: 'C', explanation: 'त्रि-स्तरीय: ग्राम पंचायत, जनपद पंचायत, जिला पंचायत', subject_id: rural.id, topic_id: T['पंचायती राज व्यवस्था'], difficulty: 'EASY', source: 'MPESB Rural Economy Pattern' },
    { text_hi: 'भारत में "हरित क्रांति" का संबंध किससे है?', option_a: 'दूध उत्पादन', option_b: 'मछली उत्पादन', option_c: 'खाद्यान्न उत्पादन', option_d: 'फल उत्पादन', correct: 'C', explanation: 'हरित क्रांति खाद्यान्न उत्पादन से संबंधित है।', subject_id: rural.id, topic_id: T['कृषि'], difficulty: 'EASY', source: 'MPESB Rural Economy Pattern' },
    { text_hi: 'पटवारी का मुख्य कार्य क्या है?', option_a: 'ग्राम पंचायत का चुनाव कराना', option_b: 'भूमि अभिलेख (खसरा-खतौनी) को बनाए रखना', option_c: 'कृषि ऋण देना', option_d: 'राशन वितरण करना', correct: 'B', explanation: 'पटवारी भूमि अभिलेखों को बनाए रखता है।', subject_id: rural.id, topic_id: T['भू-राजस्व'], difficulty: 'EASY', source: 'MPESB Rural Economy Pattern' },
    { text_hi: '"खसरा" क्या होता है?', option_a: 'भूमि का नक्शा', option_b: 'व्यक्तिगत भूमि का रिकॉर्ड जिसमें सर्वेक्षण संख्या, भूमि क्षेत्र और फसल विवरण होता है', option_c: 'ग्राम का रजिस्टर', option_d: 'सिंचाई का रिकॉर्ड', correct: 'B', explanation: 'खसरा भूमि का महत्वपूर्ण दस्तावेज है।', subject_id: rural.id, topic_id: T['भू-राजस्व'], difficulty: 'MEDIUM', source: 'MPESB Rural Economy Pattern' },
    { text_hi: '"MGNREGA" योजना का संबंध किससे है?', option_a: 'शहरी रोजगार', option_b: 'ग्रामीण रोजगार गारंटी', option_c: 'किसानों को ऋण', option_d: 'महिला सशक्तिकरण', correct: 'B', explanation: 'MGNREGA = ग्रामीण रोजगार गारंटी अधिनियम', subject_id: rural.id, topic_id: T['ग्रामीण विकास'], difficulty: 'EASY', source: 'MPESB Rural Economy Pattern' },
    { text_hi: '"PM Kisan Samman Nidhi" योजना के अंतर्गत किसानों को प्रतिवर्ष कितनी राशि मिलती है?', option_a: '₹3000', option_b: '₹4000', option_c: '₹6000', option_d: '₹8000', correct: 'C', explanation: 'PM-KISAN: ₹6000 प्रति वर्ष तीन किश्तों में।', subject_id: rural.id, topic_id: T['कृषि'], difficulty: 'EASY', source: 'MPESB Rural Economy Pattern' },
    { text_hi: 'मध्यप्रदेश का राजकीय पशु कौन-सा है?', option_a: 'शेर', option_b: 'बाघ', option_c: 'चीतल', option_d: 'हाथी', correct: 'B', explanation: 'बाघ मध्यप्रदेश का राजकीय पशु है।', subject_id: gk.id, topic_id: T['मध्यप्रदेश संस्कृति एवं कला'], difficulty: 'EASY', source: 'MPESB Previous Pattern' },
    { text_hi: 'उज्जैन में "महाकालेश्वर मंदिर" किस नदी के किनारे स्थित है?', option_a: 'बेतवा', option_b: 'क्षिप्रा', option_c: 'नर्मदा', option_d: 'चंबल', correct: 'B', explanation: 'महाकालेश्वर मंदिर क्षिप्रा नदी के किनारे है।', subject_id: gk.id, topic_id: T['मध्यप्रदेश संस्कृति एवं कला'], difficulty: 'MEDIUM', source: 'MPESB Previous Pattern' },
    { text_hi: 'श्रृंखला में लुप्त संख्या क्या है? 1, 1, 2, 3, 5, 8, ?, 21', option_a: '11', option_b: '12', option_c: '13', option_d: '14', correct: 'C', explanation: 'फिबोनाची: 5+8=13', subject_id: reason.id, topic_id: T['श्रृंखला एवं सादृश्यता'], difficulty: 'MEDIUM', source: 'MPESB Reasoning Pattern' },
    { text_hi: '₹1200 की वस्तु पर 15% छूट के बाद मूल्य क्या होगा?', option_a: '₹1020', option_b: '₹1080', option_c: '₹1000', option_d: '₹1050', correct: 'A', explanation: '1200 - 180 = ₹1020', subject_id: math.id, topic_id: T['प्रतिशत, लाभ-हानि'], difficulty: 'EASY', source: 'MPESB Math Pattern' },
    { text_hi: '"खतौनी" क्या होती है?', option_a: 'भूमि का नक्शा', option_b: 'एक मालिक की सभी भूमि का समेकित रिकॉर्ड', option_c: 'फसल का रिकॉर्ड', option_d: 'सिंचाई रजिस्टर', correct: 'B', explanation: 'खतौनी एक मालिक की सभी भूमि का समेकित विवरण है।', subject_id: rural.id, topic_id: T['भू-राजस्व'], difficulty: 'MEDIUM', source: 'MPESB Rural Economy Pattern' },
    { text_hi: 'MS PowerPoint में एक स्लाइड से दूसरी स्लाइड पर जाने के प्रभाव को क्या कहते हैं?', option_a: 'Animation', option_b: 'Transition', option_c: 'Effect', option_d: 'Theme', correct: 'B', explanation: 'Transition = एक स्लाइड से दूसरी पर जाने का प्रभाव।', subject_id: comp.id, topic_id: T['MS Office'], difficulty: 'MEDIUM', source: 'MPESB Computer Pattern' },
  ]

  const { data: qRows } = await supabase.from('questions').insert(questions).select()
  console.log(`✓ ${qRows?.length ?? 0} Questions created`)

  // Mock Tests
  const { data: fullTestRow } = await supabase.from('mock_tests').insert({
    title: 'MP Patwari Full Mock Test 1',
    title_hi: 'MP Patwari 2026 — फुल मॉक टेस्ट 1',
    description: 'MPESB पैटर्न पर आधारित पूर्ण मॉक टेस्ट। 100 प्रश्न, 100 अंक, 120 मिनट।',
    type: 'FULL', total_questions: 100, total_marks: 100, duration: 120,
    negative_marks: 0, is_published: true, sort_order: 1,
  }).select().single()

  const allQs = qRows ?? []
  const fullTqs = allQs.slice(0, 100).map((q: any, i: number) => ({ test_id: fullTestRow!.id, question_id: q.id, sort_order: i }))
  await supabase.from('test_questions').insert(fullTqs)

  // Subject tests
  const subjects = [gk, hin, math, eng, reason, comp, rural]
  for (const sub of subjects) {
    const subQs = allQs.filter((q: any) => q.subject_id === sub.id).slice(0, 20)
    if (subQs.length >= 5) {
      const { data: subTest } = await supabase.from('mock_tests').insert({
        title: `${sub.name} Test`, title_hi: `${sub.name_hi} — विषयवार टेस्ट`,
        description: `${sub.name_hi} पर केंद्रित अभ्यास टेस्ट`,
        type: 'SUBJECT', total_questions: subQs.length, total_marks: subQs.length,
        duration: Math.ceil(subQs.length * 1.5), negative_marks: 0, is_published: true,
        sort_order: sub.sort_order + 10, subject_id: sub.id,
      }).select().single()
      const tqs = subQs.map((q: any, i: number) => ({ test_id: subTest!.id, question_id: q.id, sort_order: i }))
      await supabase.from('test_questions').insert(tqs)
    }
  }

  // Previous Year Pattern
  const { data: pyTest } = await supabase.from('mock_tests').insert({
    title: 'MP Patwari Previous Year Pattern Test',
    title_hi: 'MP Patwari — पिछले वर्ष पैटर्न टेस्ट',
    description: 'MPESB पिछले वर्षों के परीक्षा पैटर्न पर आधारित टेस्ट',
    type: 'PREVIOUS_YEAR', total_questions: 50, total_marks: 50, duration: 60,
    negative_marks: 0, is_published: true, sort_order: 2,
  }).select().single()
  const pyTqs = allQs.slice(0, 50).map((q: any, i: number) => ({ test_id: pyTest!.id, question_id: q.id, sort_order: i }))
  await supabase.from('test_questions').insert(pyTqs)

  console.log('✓ Mock Tests created and published')
  console.log('\n🎉 Seeding complete!')
  console.log('Admin: admin@mppatwari.in / admin@2026')
  console.log('Test User: test@mppatwari.in / test1234')
}

main().catch(console.error)
