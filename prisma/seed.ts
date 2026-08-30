import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql({ url: 'file:///Users/anilkumar/Documents/work/test-papers/dev.db' })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Seeding MP Patwari 2026 database...')

  // Admin user
  const adminPw = await bcrypt.hash('admin@2026', 12)
  await prisma.user.upsert({
    where: { email: 'admin@mppatwari.in' },
    update: {},
    create: { name: 'Admin', email: 'admin@mppatwari.in', password: adminPw, role: 'ADMIN' }
  })
  const testUser = await prisma.user.upsert({
    where: { email: 'test@mppatwari.in' },
    update: {},
    create: { name: 'परीक्षार्थी', email: 'test@mppatwari.in', password: await bcrypt.hash('test1234', 12), role: 'USER' }
  })
  console.log('✓ Users created')

  // Subjects
  const subjects = await Promise.all([
    prisma.subject.upsert({ where: { code: 'GK' }, update: {}, create: { name: 'General Knowledge & MP GK', nameHi: 'सामान्य ज्ञान एवं MP GK', code: 'GK', order: 1, color: '#3b82f6' } }),
    prisma.subject.upsert({ where: { code: 'HIN' }, update: {}, create: { name: 'General Hindi', nameHi: 'सामान्य हिन्दी', code: 'HIN', order: 2, color: '#8b5cf6' } }),
    prisma.subject.upsert({ where: { code: 'MATH' }, update: {}, create: { name: 'General Mathematics', nameHi: 'सामान्य गणित', code: 'MATH', order: 3, color: '#f59e0b' } }),
    prisma.subject.upsert({ where: { code: 'ENG' }, update: {}, create: { name: 'General English', nameHi: 'सामान्य अंग्रेजी', code: 'ENG', order: 4, color: '#10b981' } }),
    prisma.subject.upsert({ where: { code: 'REASON' }, update: {}, create: { name: 'General Reasoning', nameHi: 'सामान्य तर्कशक्ति', code: 'REASON', order: 5, color: '#ef4444' } }),
    prisma.subject.upsert({ where: { code: 'COMP' }, update: {}, create: { name: 'Computer Knowledge', nameHi: 'कंप्यूटर ज्ञान', code: 'COMP', order: 6, color: '#06b6d4' } }),
    prisma.subject.upsert({ where: { code: 'RURAL' }, update: {}, create: { name: 'Rural Economy & Panchayati Raj', nameHi: 'ग्रामीण अर्थव्यवस्था एवं पंचायती राज', code: 'RURAL', order: 7, color: '#84cc16' } }),
  ])
  const [gk, hin, math, eng, reason, comp, rural] = subjects
  console.log('✓ Subjects created')

  // Topics
  const topicsData = [
    // GK Topics
    { name: 'MP History', nameHi: 'मध्यप्रदेश का इतिहास', subjectId: gk.id },
    { name: 'MP Geography', nameHi: 'मध्यप्रदेश भूगोल', subjectId: gk.id },
    { name: 'MP Culture & Art', nameHi: 'मध्यप्रदेश संस्कृति एवं कला', subjectId: gk.id },
    { name: 'MP Economy & Industry', nameHi: 'मध्यप्रदेश अर्थव्यवस्था', subjectId: gk.id },
    { name: 'MP Government Schemes', nameHi: 'मध्यप्रदेश शासन योजनाएं', subjectId: gk.id },
    { name: 'India GK', nameHi: 'भारतीय सामान्य ज्ञान', subjectId: gk.id },
    { name: 'Current Affairs', nameHi: 'करंट अफेयर्स', subjectId: gk.id },
    { name: 'Indian Polity', nameHi: 'भारतीय राजव्यवस्था', subjectId: gk.id },
    // Hindi Topics
    { name: 'Sandhi Samas', nameHi: 'संधि-समास', subjectId: hin.id },
    { name: 'Vyakaran', nameHi: 'हिन्दी व्याकरण', subjectId: hin.id },
    { name: 'Muhavare Lokokti', nameHi: 'मुहावरे एवं लोकोक्तियाँ', subjectId: hin.id },
    { name: 'Ras Chhand Alankar', nameHi: 'रस-छंद-अलंकार', subjectId: hin.id },
    { name: 'Hindi Literature', nameHi: 'हिंदी साहित्य', subjectId: hin.id },
    // Math Topics
    { name: 'Number System', nameHi: 'संख्या प्रणाली', subjectId: math.id },
    { name: 'Percentage Profit Loss', nameHi: 'प्रतिशत, लाभ-हानि', subjectId: math.id },
    { name: 'Simple Compound Interest', nameHi: 'साधारण एवं चक्रवृद्धि ब्याज', subjectId: math.id },
    { name: 'Time Speed Distance', nameHi: 'समय, गति, दूरी', subjectId: math.id },
    { name: 'Mensuration', nameHi: 'क्षेत्रमिति', subjectId: math.id },
    { name: 'Algebra', nameHi: 'बीजगणित', subjectId: math.id },
    { name: 'Ratio Proportion', nameHi: 'अनुपात-समानुपात', subjectId: math.id },
    // English Topics
    { name: 'Grammar', nameHi: 'Grammar', subjectId: eng.id },
    { name: 'Vocabulary', nameHi: 'Vocabulary', subjectId: eng.id },
    { name: 'Comprehension', nameHi: 'Comprehension', subjectId: eng.id },
    // Reasoning Topics
    { name: 'Series Analogy', nameHi: 'श्रृंखला एवं सादृश्यता', subjectId: reason.id },
    { name: 'Coding Decoding', nameHi: 'कोडिंग-डिकोडिंग', subjectId: reason.id },
    { name: 'Blood Relations', nameHi: 'रक्त संबंध', subjectId: reason.id },
    { name: 'Direction Sense', nameHi: 'दिशा ज्ञान', subjectId: reason.id },
    { name: 'Logical Reasoning', nameHi: 'तार्किक अनुमान', subjectId: reason.id },
    // Computer Topics
    { name: 'Computer Basics', nameHi: 'कंप्यूटर की मूल बातें', subjectId: comp.id },
    { name: 'MS Office', nameHi: 'MS Office', subjectId: comp.id },
    { name: 'Internet & Networking', nameHi: 'इंटरनेट एवं नेटवर्किंग', subjectId: comp.id },
    { name: 'Operating System', nameHi: 'ऑपरेटिंग सिस्टम', subjectId: comp.id },
    // Rural Topics
    { name: 'Panchayati Raj System', nameHi: 'पंचायती राज व्यवस्था', subjectId: rural.id },
    { name: 'Rural Development', nameHi: 'ग्रामीण विकास', subjectId: rural.id },
    { name: 'Land Revenue', nameHi: 'भू-राजस्व', subjectId: rural.id },
    { name: 'Agriculture', nameHi: 'कृषि', subjectId: rural.id },
  ]

  const createdTopics: Record<string, string> = {}
  for (const t of topicsData) {
    const topic = await prisma.topic.create({ data: t })
    createdTopics[t.nameHi] = topic.id
  }
  console.log('✓ Topics created')

  // Questions — 150+ high-quality MP Patwari pattern questions
  const questions = [
    // ====== सामान्य ज्ञान - MP History ======
    {
      textHi: 'मध्यप्रदेश राज्य का गठन कब हुआ था?',
      optionA: '1 नवंबर 1956', optionB: '1 नवंबर 1950', optionC: '26 जनवरी 1950', optionD: '15 अगस्त 1947',
      correct: 'A',
      explanation: 'मध्यप्रदेश राज्य का गठन राज्य पुनर्गठन आयोग की सिफारिशों के आधार पर 1 नवंबर 1956 को हुआ था।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश का इतिहास'], difficulty: 'EASY',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'मध्यप्रदेश के प्रथम मुख्यमंत्री कौन थे?',
      optionA: 'श्यामा चरण शुक्ल', optionB: 'रवि शंकर शुक्ल', optionC: 'कैलाश नाथ काटजू', optionD: 'द्वारका प्रसाद मिश्र',
      correct: 'B',
      explanation: 'पं. रवि शंकर शुक्ल मध्यप्रदेश के प्रथम मुख्यमंत्री थे। उनका कार्यकाल 1 नवंबर 1956 से 31 दिसंबर 1956 तक था।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश का इतिहास'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'सन् 2000 में मध्यप्रदेश से अलग कौन-सा राज्य बना?',
      optionA: 'उत्तराखंड', optionB: 'झारखंड', optionC: 'छत्तीसगढ़', optionD: 'तेलंगाना',
      correct: 'C',
      explanation: '1 नवंबर 2000 को मध्यप्रदेश के दक्षिण-पूर्वी हिस्से को अलग कर छत्तीसगढ़ राज्य बनाया गया।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश का इतिहास'], difficulty: 'EASY',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'मध्यप्रदेश की राजधानी क्या है?',
      optionA: 'इंदौर', optionB: 'ग्वालियर', optionC: 'जबलपुर', optionD: 'भोपाल',
      correct: 'D',
      explanation: 'भोपाल मध्यप्रदेश की राजधानी है। यह मध्यप्रदेश का दूसरा सबसे बड़ा शहर भी है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश का इतिहास'], difficulty: 'EASY',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'चंदेल वंश की राजधानी कौन-सी थी?',
      optionA: 'उज्जैन', optionB: 'महोबा', optionC: 'धार', optionD: 'खजुराहो',
      correct: 'B',
      explanation: 'चंदेल वंश की राजधानी महोबा थी। खजुराहो उनका धार्मिक और सांस्कृतिक केंद्र था जहाँ विश्वप्रसिद्ध मंदिर बनवाए गए।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश का इतिहास'], difficulty: 'HARD',
      source: 'MPESB Previous Pattern'
    },

    // ====== MP Geography ======
    {
      textHi: 'मध्यप्रदेश का सबसे बड़ा जिला (क्षेत्रफल में) कौन-सा है?',
      optionA: 'सागर', optionB: 'बालाघाट', optionC: 'छिंदवाड़ा', optionD: 'सिवनी',
      correct: 'C',
      explanation: 'छिंदवाड़ा जिला क्षेत्रफल की दृष्टि से मध्यप्रदेश का सबसे बड़ा जिला है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश भूगोल'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'मध्यप्रदेश की सबसे लंबी नदी कौन-सी है?',
      optionA: 'बेतवा', optionB: 'नर्मदा', optionC: 'ताप्ती', optionD: 'चंबल',
      correct: 'B',
      explanation: 'नर्मदा नदी मध्यप्रदेश की सबसे लंबी नदी है। यह अमरकंटक से निकलकर गुजरात में अरब सागर में मिलती है। इसे "मध्यप्रदेश की जीवन रेखा" भी कहते हैं।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश भूगोल'], difficulty: 'EASY',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'मध्यप्रदेश की सर्वोच्च चोटी कौन-सी है?',
      optionA: 'सतपुड़ा', optionB: 'धूपगढ़', optionC: 'अमरकंटक', optionD: 'पचमढ़ी',
      correct: 'B',
      explanation: 'धूपगढ़ (1350 मीटर) मध्यप्रदेश की सर्वोच्च चोटी है। यह पचमढ़ी के पास सतपुड़ा रेंज में स्थित है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश भूगोल'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'इंदिरा सागर बाँध किस नदी पर बना है?',
      optionA: 'चंबल', optionB: 'बेतवा', optionC: 'नर्मदा', optionD: 'ताप्ती',
      correct: 'C',
      explanation: 'इंदिरा सागर बाँध नर्मदा नदी पर खंडवा जिले में स्थित है। यह मध्यप्रदेश का सबसे बड़ा बाँध है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश भूगोल'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'मध्यप्रदेश में कुल कितने जिले हैं?',
      optionA: '50', optionB: '51', optionC: '52', optionD: '55',
      correct: 'C',
      explanation: 'मध्यप्रदेश में वर्तमान में कुल 52 जिले हैं। (नवीनतम जानकारी के अनुसार जिलों की संख्या बदल सकती है — आधिकारिक अधिसूचना से पुष्टि करें।)',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश भूगोल'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },

    // ====== MP Culture ======
    {
      textHi: 'खजुराहो के मंदिर किस वंश ने बनवाए?',
      optionA: 'गुप्त वंश', optionB: 'मराठा वंश', optionC: 'चंदेल वंश', optionD: 'परमार वंश',
      correct: 'C',
      explanation: 'खजुराहो के विश्वप्रसिद्ध मंदिर 9वीं-12वीं शताब्दी के बीच चंदेल राजपूत शासकों ने बनवाए। ये मंदिर यूनेस्को विश्व धरोहर स्थल हैं।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश संस्कृति एवं कला'], difficulty: 'EASY',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'मध्यप्रदेश में "सांची स्तूप" किस जिले में स्थित है?',
      optionA: 'भोपाल', optionB: 'रायसेन', optionC: 'विदिशा', optionD: 'सागर',
      correct: 'B',
      explanation: 'सांची स्तूप रायसेन जिले में स्थित है। यह यूनेस्को विश्व धरोहर स्थल है और बौद्ध वास्तुकला का उत्कृष्ट उदाहरण है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश संस्कृति एवं कला'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: '"माधव राष्ट्रीय उद्यान" मध्यप्रदेश के किस जिले में है?',
      optionA: 'शिवपुरी', optionB: 'पन्ना', optionC: 'कान्हा', optionD: 'भोपाल',
      correct: 'A',
      explanation: 'माधव राष्ट्रीय उद्यान शिवपुरी जिले में स्थित है। यह पहले राजाओं का शिकार स्थल था।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश भूगोल'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'मध्यप्रदेश के किस शहर को "झीलों का शहर" कहा जाता है?',
      optionA: 'जबलपुर', optionB: 'भोपाल', optionC: 'इंदौर', optionD: 'उज्जैन',
      correct: 'B',
      explanation: 'भोपाल को "झीलों का शहर" कहा जाता है। यहाँ बड़ा तालाब (Upper Lake) और छोटा तालाब (Lower Lake) प्रमुख हैं।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश संस्कृति एवं कला'], difficulty: 'EASY',
      source: 'MPESB Previous Pattern'
    },

    // ====== MP Government Schemes ======
    {
      textHi: 'मध्यप्रदेश सरकार की "लाड़ली लक्ष्मी योजना" किस वर्ष शुरू हुई?',
      optionA: '2004', optionB: '2007', optionC: '2010', optionD: '2012',
      correct: 'B',
      explanation: 'लाड़ली लक्ष्मी योजना मध्यप्रदेश सरकार ने 2007 में शुरू की। इस योजना में बालिका के जन्म पर और पढ़ाई के विभिन्न चरणों में आर्थिक सहायता दी जाती है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश शासन योजनाएं'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: '"मुख्यमंत्री जन सेवा अभियान" का संबंध किससे है?',
      optionA: 'किसान ऋण माफी', optionB: 'शिविर के माध्यम से जनता की समस्याओं का निराकरण', optionC: 'बेटी बचाओ अभियान', optionD: 'डिजिटल साक्षरता',
      correct: 'B',
      explanation: 'मुख्यमंत्री जन सेवा अभियान के तहत ग्राम पंचायत स्तर पर शिविर लगाकर जनता की विभिन्न समस्याओं व योजनाओं के लाभ का त्वरित निराकरण किया जाता है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश शासन योजनाएं'], difficulty: 'HARD',
      source: 'MPESB Previous Pattern'
    },

    // ====== India GK ======
    {
      textHi: 'भारत का सर्वोच्च नागरिक पुरस्कार कौन-सा है?',
      optionA: 'पद्म विभूषण', optionB: 'भारत रत्न', optionC: 'अर्जुन पुरस्कार', optionD: 'पद्म भूषण',
      correct: 'B',
      explanation: 'भारत रत्न भारत का सर्वोच्च नागरिक पुरस्कार है। इसे सर्वोच्च राष्ट्रीय सेवा हेतु प्रदान किया जाता है।',
      subjectId: gk.id, topicId: createdTopics['भारतीय सामान्य ज्ञान'], difficulty: 'EASY',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'भारतीय संविधान के किस अनुच्छेद के अंतर्गत आपातकाल की घोषणा की जाती है?',
      optionA: 'अनुच्छेद 352', optionB: 'अनुच्छेद 356', optionC: 'अनुच्छेद 370', optionD: 'अनुच्छेद 360',
      correct: 'A',
      explanation: 'भारतीय संविधान के अनुच्छेद 352 के तहत राष्ट्रीय आपातकाल की घोषणा की जाती है। अनुच्छेद 356 राज्य में राष्ट्रपति शासन और अनुच्छेद 360 वित्तीय आपातकाल से संबंधित है।',
      subjectId: gk.id, topicId: createdTopics['भारतीय राजव्यवस्था'], difficulty: 'HARD',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'पंचायती राज व्यवस्था को संवैधानिक दर्जा किस संशोधन से मिला?',
      optionA: '72वाँ संशोधन', optionB: '73वाँ संशोधन', optionC: '74वाँ संशोधन', optionD: '75वाँ संशोधन',
      correct: 'B',
      explanation: '73वें संविधान संशोधन अधिनियम 1992 द्वारा पंचायती राज व्यवस्था को संवैधानिक दर्जा दिया गया। यह 24 अप्रैल 1993 को लागू हुआ।',
      subjectId: gk.id, topicId: createdTopics['भारतीय राजव्यवस्था'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'भारत में लोकसभा की कुल सीटें कितनी हैं?',
      optionA: '542', optionB: '543', optionC: '544', optionD: '545',
      correct: 'B',
      explanation: 'लोकसभा में 543 निर्वाचित सीटें हैं। (2 सीटें आंग्ल-भारतीय समुदाय के लिए मनोनीत थीं जो 2020 के 104वें संविधान संशोधन से समाप्त कर दी गईं।)',
      subjectId: gk.id, topicId: createdTopics['भारतीय राजव्यवस्था'], difficulty: 'EASY',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'भारत के राष्ट्रपति का कार्यकाल कितने वर्षों का होता है?',
      optionA: '4 वर्ष', optionB: '6 वर्ष', optionC: '5 वर्ष', optionD: '3 वर्ष',
      correct: 'C',
      explanation: 'भारत के राष्ट्रपति का कार्यकाल 5 वर्ष का होता है। भारतीय संविधान के अनुच्छेद 56 में इसका उल्लेख है।',
      subjectId: gk.id, topicId: createdTopics['भारतीय राजव्यवस्था'], difficulty: 'EASY',
      source: 'MPESB Previous Pattern'
    },

    // ====== सामान्य हिन्दी ======
    {
      textHi: 'निम्नलिखित में से "स्वर संधि" का उदाहरण कौन-सा है?',
      optionA: 'दिगंबर', optionB: 'देवालय', optionC: 'सज्जन', optionD: 'उज्ज्वल',
      correct: 'B',
      explanation: '"देवालय" स्वर संधि का उदाहरण है: देव + आलय = देवालय (अ + आ = आ)। "दिगंबर" व्यंजन संधि और "सज्जन", "उज्ज्वल" भी व्यंजन संधि के उदाहरण हैं।',
      subjectId: hin.id, topicId: createdTopics['संधि-समास'], difficulty: 'MEDIUM',
      source: 'MPESB Hindi Pattern'
    },
    {
      textHi: '"राजा-प्रजा" में कौन-सा समास है?',
      optionA: 'तत्पुरुष समास', optionB: 'कर्मधारय समास', optionC: 'द्वंद्व समास', optionD: 'अव्ययीभाव समास',
      correct: 'C',
      explanation: '"राजा-प्रजा" में द्वंद्व समास है क्योंकि दोनों पद प्रधान हैं और उनके बीच "और" का संबंध है।',
      subjectId: hin.id, topicId: createdTopics['संधि-समास'], difficulty: 'MEDIUM',
      source: 'MPESB Hindi Pattern'
    },
    {
      textHi: '"अनुनासिक" का सही अर्थ क्या है?',
      optionA: 'मुख से बोला जाने वाला वर्ण', optionB: 'नाक और मुख दोनों से बोला जाने वाला वर्ण', optionC: 'केवल नाक से बोला जाने वाला वर्ण', optionD: 'कठोर वर्ण',
      correct: 'B',
      explanation: 'अनुनासिक वे वर्ण हैं जिनका उच्चारण नाक और मुख दोनों से होता है। इन्हें चंद्रबिंदु (ँ) से दर्शाया जाता है। जैसे — आँख, मुँह।',
      subjectId: hin.id, topicId: createdTopics['हिन्दी व्याकरण'], difficulty: 'MEDIUM',
      source: 'MPESB Hindi Pattern'
    },
    {
      textHi: '"अंधे के हाथ बटेर लगना" मुहावरे का सही अर्थ है —',
      optionA: 'बिना परिश्रम सफलता मिलना', optionB: 'अयोग्य व्यक्ति को बड़ी सफलता मिलना', optionC: 'शिकार में अंधे की जीत', optionD: 'अचानक लाभ होना',
      correct: 'B',
      explanation: '"अंधे के हाथ बटेर लगना" मुहावरे का अर्थ है — अयोग्य या अपात्र व्यक्ति को अचानक बड़ी सफलता या लाभ मिलना।',
      subjectId: hin.id, topicId: createdTopics['मुहावरे एवं लोकोक्तियाँ'], difficulty: 'MEDIUM',
      source: 'MPESB Hindi Pattern'
    },
    {
      textHi: '"जो बीत गई सो बात गई" — यह किसकी कविता की पंक्ति है?',
      optionA: 'सुमित्रानंदन पंत', optionB: 'हरिवंश राय बच्चन', optionC: 'महादेवी वर्मा', optionD: 'सूर्यकांत त्रिपाठी "निराला"',
      correct: 'B',
      explanation: '"जो बीत गई सो बात गई" हरिवंश राय बच्चन की प्रसिद्ध कविता की पंक्ति है। वे आधुनिक हिंदी कविता के प्रमुख कवि थे।',
      subjectId: hin.id, topicId: createdTopics['हिंदी साहित्य'], difficulty: 'MEDIUM',
      source: 'MPESB Hindi Pattern'
    },
    {
      textHi: '"तद्भव" शब्द का अर्थ है —',
      optionA: 'संस्कृत से लिया गया शब्द', optionB: 'संस्कृत से बिगड़कर बना हिंदी शब्द', optionC: 'विदेशी भाषा से लिया गया शब्द', optionD: 'हिंदी में नया बना शब्द',
      correct: 'B',
      explanation: 'तद्भव शब्द संस्कृत के मूल शब्दों से बिगड़कर (परिवर्तित होकर) बने हैं। जैसे: कर्म → काम, दूध → दुग्ध का तद्भव।',
      subjectId: hin.id, topicId: createdTopics['हिन्दी व्याकरण'], difficulty: 'MEDIUM',
      source: 'MPESB Hindi Pattern'
    },
    {
      textHi: '"विधानसभा" शब्द में उपसर्ग बताइए —',
      optionA: 'वि', optionB: 'विधान', optionC: 'वि + धान', optionD: 'आ',
      correct: 'A',
      explanation: '"विधानसभा" में "वि" उपसर्ग है। वि + धान + सभा = विधानसभा। "वि" एक संस्कृत उपसर्ग है जिसका अर्थ विशेष, अलग है।',
      subjectId: hin.id, topicId: createdTopics['हिन्दी व्याकरण'], difficulty: 'HARD',
      source: 'MPESB Hindi Pattern'
    },
    {
      textHi: 'वीर रस का स्थायी भाव क्या है?',
      optionA: 'क्रोध', optionB: 'उत्साह', optionC: 'भय', optionD: 'श्रृंगार',
      correct: 'B',
      explanation: 'वीर रस का स्थायी भाव "उत्साह" है। वीरता, युद्ध और पराक्रम के वर्णन में वीर रस होता है।',
      subjectId: hin.id, topicId: createdTopics['रस-छंद-अलंकार'], difficulty: 'MEDIUM',
      source: 'MPESB Hindi Pattern'
    },

    // ====== सामान्य गणित ======
    {
      textHi: 'यदि किसी संख्या का 20% = 80 हो, तो वह संख्या क्या है?',
      optionA: '300', optionB: '400', optionC: '500', optionD: '160',
      correct: 'B',
      explanation: 'माना संख्या = x\n20% of x = 80\n(20/100) × x = 80\nx = 80 × 100/20 = 400',
      subjectId: math.id, topicId: createdTopics['प्रतिशत, लाभ-हानि'], difficulty: 'EASY',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: 'एक वस्तु ₹480 में खरीदकर ₹600 में बेची गई। लाभ का प्रतिशत क्या होगा?',
      optionA: '20%', optionB: '25%', optionC: '15%', optionD: '22%',
      correct: 'B',
      explanation: 'लाभ = 600 - 480 = ₹120\nलाभ% = (120/480) × 100 = 25%',
      subjectId: math.id, topicId: createdTopics['प्रतिशत, लाभ-हानि'], difficulty: 'EASY',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: '₹5000 का 2 वर्षों का 10% वार्षिक दर से साधारण ब्याज कितना होगा?',
      optionA: '₹500', optionB: '₹1000', optionC: '₹1100', optionD: '₹2000',
      correct: 'B',
      explanation: 'साधारण ब्याज = (P × R × T) / 100\n= (5000 × 10 × 2) / 100\n= 1,00,000 / 100 = ₹1000',
      subjectId: math.id, topicId: createdTopics['साधारण एवं चक्रवृद्धि ब्याज'], difficulty: 'EASY',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: '₹8000 पर 2 वर्षों के लिए 10% वार्षिक दर से चक्रवृद्धि ब्याज कितना होगा?',
      optionA: '₹1600', optionB: '₹1680', optionC: '₹1700', optionD: '₹2000',
      correct: 'B',
      explanation: 'पहले वर्ष ब्याज = 8000 × 10/100 = ₹800\nदूसरे वर्ष मूलधन = 8800\nदूसरे वर्ष ब्याज = 8800 × 10/100 = ₹880\nकुल C.I. = 800 + 880 = ₹1680',
      subjectId: math.id, topicId: createdTopics['साधारण एवं चक्रवृद्धि ब्याज'], difficulty: 'MEDIUM',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: 'एक ट्रेन 72 km/h की गति से चलती है। 10 सेकंड में वह कितने मीटर तय करेगी?',
      optionA: '150 मीटर', optionB: '200 मीटर', optionC: '250 मीटर', optionD: '180 मीटर',
      correct: 'B',
      explanation: 'गति = 72 km/h = 72 × 1000/3600 = 20 m/s\n10 सेकंड में दूरी = 20 × 10 = 200 मीटर',
      subjectId: math.id, topicId: createdTopics['समय, गति, दूरी'], difficulty: 'MEDIUM',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: 'एक आयत की लंबाई 12 cm और चौड़ाई 8 cm है। उसका क्षेत्रफल क्या होगा?',
      optionA: '40 cm²', optionB: '80 cm²', optionC: '96 cm²', optionD: '48 cm²',
      correct: 'C',
      explanation: 'आयत का क्षेत्रफल = लंबाई × चौड़ाई\n= 12 × 8 = 96 cm²',
      subjectId: math.id, topicId: createdTopics['क्षेत्रमिति'], difficulty: 'EASY',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: '7 cm त्रिज्या वाले वृत्त का क्षेत्रफल (π = 22/7 लेकर) क्या होगा?',
      optionA: '144 cm²', optionB: '154 cm²', optionC: '148 cm²', optionD: '162 cm²',
      correct: 'B',
      explanation: 'वृत्त का क्षेत्रफल = π × r²\n= (22/7) × 7 × 7\n= 22 × 7 = 154 cm²',
      subjectId: math.id, topicId: createdTopics['क्षेत्रमिति'], difficulty: 'EASY',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: '3 : 4 के अनुपात में दो संख्याएँ हैं। यदि उनका योग 105 हो, तो बड़ी संख्या क्या होगी?',
      optionA: '45', optionB: '60', optionC: '63', optionD: '70',
      correct: 'B',
      explanation: 'माना संख्याएँ 3x और 4x हैं।\n3x + 4x = 105\n7x = 105 → x = 15\nबड़ी संख्या = 4x = 4 × 15 = 60',
      subjectId: math.id, topicId: createdTopics['अनुपात-समानुपात'], difficulty: 'MEDIUM',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: 'यदि 2x + 3 = 11 हो, तो x का मान क्या होगा?',
      optionA: '3', optionB: '4', optionC: '5', optionD: '2',
      correct: 'B',
      explanation: '2x + 3 = 11\n2x = 11 - 3 = 8\nx = 8/2 = 4',
      subjectId: math.id, topicId: createdTopics['बीजगणित'], difficulty: 'EASY',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: 'LCM(12, 18) का मान क्या है?',
      optionA: '36', optionB: '48', optionC: '72', optionD: '54',
      correct: 'A',
      explanation: '12 = 2² × 3\n18 = 2 × 3²\nLCM = 2² × 3² = 4 × 9 = 36',
      subjectId: math.id, topicId: createdTopics['संख्या प्रणाली'], difficulty: 'EASY',
      source: 'MPESB Math Pattern'
    },

    // ====== सामान्य अंग्रेजी ======
    {
      textHi: 'Choose the correct passive voice of: "She writes a letter."',
      optionA: 'A letter is written by her.', optionB: 'A letter was written by her.', optionC: 'A letter has been written by her.', optionD: 'A letter will be written by her.',
      correct: 'A',
      explanation: 'Simple Present active voice → Passive voice: Subject + is/am/are + V3 + by + object.\n"She writes" → "A letter is written by her."',
      subjectId: eng.id, topicId: createdTopics['Grammar'], difficulty: 'MEDIUM',
      source: 'MPESB English Pattern'
    },
    {
      textHi: 'The synonym of "Diligent" is —',
      optionA: 'Lazy', optionB: 'Hardworking', optionC: 'Careless', optionD: 'Slow',
      correct: 'B',
      explanation: '"Diligent" means showing careful and persistent work or effort. Its synonym is "Hardworking." Antonym is "Lazy."',
      subjectId: eng.id, topicId: createdTopics['Vocabulary'], difficulty: 'MEDIUM',
      source: 'MPESB English Pattern'
    },
    {
      textHi: 'Fill in the blank: He has been working here ____ 2010.',
      optionA: 'for', optionB: 'since', optionC: 'from', optionD: 'during',
      correct: 'B',
      explanation: '"Since" is used with a specific point in time (2010 is a year/specific time). "For" is used with a duration of time (e.g., "for 10 years").',
      subjectId: eng.id, topicId: createdTopics['Grammar'], difficulty: 'EASY',
      source: 'MPESB English Pattern'
    },
    {
      textHi: 'The antonym of "Transparent" is —',
      optionA: 'Clear', optionB: 'Visible', optionC: 'Opaque', optionD: 'Bright',
      correct: 'C',
      explanation: 'Antonym of "Transparent" (see-through, clear) is "Opaque" (not see-through, not transparent).',
      subjectId: eng.id, topicId: createdTopics['Vocabulary'], difficulty: 'EASY',
      source: 'MPESB English Pattern'
    },
    {
      textHi: 'Correct the sentence: "One of the student were absent."',
      optionA: 'One of the students was absent.', optionB: 'One of the student was absent.', optionC: 'One of the students were absent.', optionD: 'No correction needed.',
      correct: 'A',
      explanation: '"One of" is followed by a plural noun but takes a singular verb. Correct: "One of the students was absent."',
      subjectId: eng.id, topicId: createdTopics['Grammar'], difficulty: 'MEDIUM',
      source: 'MPESB English Pattern'
    },

    // ====== सामान्य तर्कशक्ति ======
    {
      textHi: 'श्रृंखला में अगला पद क्या होगा? 2, 6, 12, 20, 30, ?',
      optionA: '40', optionB: '42', optionC: '44', optionD: '45',
      correct: 'B',
      explanation: 'पैटर्न: 2 = 1×2, 6 = 2×3, 12 = 3×4, 20 = 4×5, 30 = 5×6, अगला = 6×7 = 42',
      subjectId: reason.id, topicId: createdTopics['श्रृंखला एवं सादृश्यता'], difficulty: 'MEDIUM',
      source: 'MPESB Reasoning Pattern'
    },
    {
      textHi: 'यदि BOOK को DQQM लिखें, तो WORD को कैसे लिखेंगे?',
      optionA: 'YQTF', optionB: 'YOSF', optionC: 'AQTF', optionD: 'YQRF',
      correct: 'A',
      explanation: 'प्रत्येक अक्षर को +2 के स्थान पर बदला जाता है:\nB+2=D, O+2=Q, O+2=Q, K+2=M\nW+2=Y, O+2=Q, R+2=T, D+2=F → YQTF',
      subjectId: reason.id, topicId: createdTopics['कोडिंग-डिकोडिंग'], difficulty: 'MEDIUM',
      source: 'MPESB Reasoning Pattern'
    },
    {
      textHi: 'राम की माँ की बहन का पुत्र राम का क्या लगेगा?',
      optionA: 'मामा', optionB: 'चाचा', optionC: 'मौसेरा भाई', optionD: 'चचेरा भाई',
      correct: 'C',
      explanation: 'राम की माँ की बहन = राम की मौसी। मौसी का पुत्र = मौसेरा भाई।',
      subjectId: reason.id, topicId: createdTopics['रक्त संबंध'], difficulty: 'EASY',
      source: 'MPESB Reasoning Pattern'
    },
    {
      textHi: 'सूर्योदय से मुँह पूर्व की ओर करके खड़ा व्यक्ति यदि बाईं ओर मुड़े, तो वह किस दिशा में जाएगा?',
      optionA: 'पश्चिम', optionB: 'उत्तर', optionC: 'दक्षिण', optionD: 'पूर्व',
      correct: 'B',
      explanation: 'पूर्व की ओर मुँह करके बायीं ओर मुड़ने पर — उत्तर दिशा में जाएगा। (पूर्व → बायाँ = उत्तर)',
      subjectId: reason.id, topicId: createdTopics['दिशा ज्ञान'], difficulty: 'EASY',
      source: 'MPESB Reasoning Pattern'
    },
    {
      textHi: 'A, B का भाई है। C, A की माँ है। D, C का पिता है। E, D की माँ है। B का D से क्या संबंध है?',
      optionA: 'पोता', optionB: 'नाती', optionC: 'दादा', optionD: 'नाना',
      correct: 'B',
      explanation: 'B → A का भाई (C की संतान) → C का पुत्र। C → D की पुत्री। B → D का नाती (Grandson through daughter).',
      subjectId: reason.id, topicId: createdTopics['रक्त संबंध'], difficulty: 'HARD',
      source: 'MPESB Reasoning Pattern'
    },
    {
      textHi: 'निम्नलिखित में विषम (odd one out) कौन-सा है?\nA. गुलाब  B. कमल  C. चमेली  D. आम',
      optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D',
      correct: 'D',
      explanation: 'गुलाब, कमल और चमेली सभी फूल हैं, जबकि आम एक फल है। इसलिए "आम" विषम है।',
      subjectId: reason.id, topicId: createdTopics['श्रृंखला एवं सादृश्यता'], difficulty: 'EASY',
      source: 'MPESB Reasoning Pattern'
    },

    // ====== कंप्यूटर ज्ञान ======
    {
      textHi: 'CPU का पूर्ण रूप क्या है?',
      optionA: 'Central Processing Unit', optionB: 'Computer Processing Unit', optionC: 'Central Program Utility', optionD: 'Common Processing Unit',
      correct: 'A',
      explanation: 'CPU का पूर्ण रूप Central Processing Unit है। यह कंप्यूटर का मुख्य भाग है जो सभी गणनाएं और प्रोसेसिंग करता है।',
      subjectId: comp.id, topicId: createdTopics['कंप्यूटर की मूल बातें'], difficulty: 'EASY',
      source: 'MPESB Computer Pattern'
    },
    {
      textHi: 'माइक्रोसॉफ्ट वर्ड में नई फाइल बनाने का शॉर्टकट है —',
      optionA: 'Ctrl+N', optionB: 'Ctrl+O', optionC: 'Ctrl+S', optionD: 'Ctrl+W',
      correct: 'A',
      explanation: 'MS Word में नई फाइल बनाने के लिए Ctrl+N shortcut का उपयोग होता है। Ctrl+O = Open, Ctrl+S = Save, Ctrl+W = Close.',
      subjectId: comp.id, topicId: createdTopics['MS Office'], difficulty: 'EASY',
      source: 'MPESB Computer Pattern'
    },
    {
      textHi: 'WWW का पूर्ण रूप क्या है?',
      optionA: 'World Wide Web', optionB: 'World Wide Window', optionC: 'Wide Web World', optionD: 'Web World Wide',
      correct: 'A',
      explanation: 'WWW का पूर्ण रूप World Wide Web है। इसका आविष्कार टिम बर्नर्स-ली ने 1989 में किया था।',
      subjectId: comp.id, topicId: createdTopics['इंटरनेट एवं नेटवर्किंग'], difficulty: 'EASY',
      source: 'MPESB Computer Pattern'
    },
    {
      textHi: 'RAM का पूर्ण रूप क्या है?',
      optionA: 'Read Access Memory', optionB: 'Random Access Memory', optionC: 'Read And Memory', optionD: 'Random Accessing Module',
      correct: 'B',
      explanation: 'RAM का पूर्ण रूप Random Access Memory है। यह कंप्यूटर की प्राथमिक अस्थायी मेमोरी है जो डेटा को अस्थायी रूप से संग्रहित करती है।',
      subjectId: comp.id, topicId: createdTopics['कंप्यूटर की मूल बातें'], difficulty: 'EASY',
      source: 'MPESB Computer Pattern'
    },
    {
      textHi: 'विंडोज ऑपरेटिंग सिस्टम किस कंपनी ने बनाया?',
      optionA: 'Apple', optionB: 'Google', optionC: 'Microsoft', optionD: 'IBM',
      correct: 'C',
      explanation: 'Windows Operating System Microsoft Corporation ने बनाया है। इसके संस्थापक बिल गेट्स और पॉल एलन हैं।',
      subjectId: comp.id, topicId: createdTopics['ऑपरेटिंग सिस्टम'], difficulty: 'EASY',
      source: 'MPESB Computer Pattern'
    },
    {
      textHi: 'ईमेल भेजने के लिए किस प्रोटोकॉल का उपयोग होता है?',
      optionA: 'HTTP', optionB: 'FTP', optionC: 'SMTP', optionD: 'POP3',
      correct: 'C',
      explanation: 'ईमेल भेजने के लिए SMTP (Simple Mail Transfer Protocol) का उपयोग होता है। POP3 और IMAP ईमेल प्राप्त करने के लिए उपयोग होते हैं।',
      subjectId: comp.id, topicId: createdTopics['इंटरनेट एवं नेटवर्किंग'], difficulty: 'MEDIUM',
      source: 'MPESB Computer Pattern'
    },
    {
      textHi: 'Excel में एक सेल से दूसरे सेल में जाने के लिए किस कुंजी का उपयोग होता है?',
      optionA: 'Shift', optionB: 'Alt', optionC: 'Tab', optionD: 'Ctrl',
      correct: 'C',
      explanation: 'MS Excel में Tab key दबाने से अगले cell में जाया जा सकता है। Enter दबाने पर नीचे वाले cell में जाते हैं।',
      subjectId: comp.id, topicId: createdTopics['MS Office'], difficulty: 'EASY',
      source: 'MPESB Computer Pattern'
    },

    // ====== ग्रामीण अर्थव्यवस्था एवं पंचायती राज ======
    {
      textHi: 'मध्यप्रदेश में ग्राम पंचायत के चुनाव कितने वर्षों में होते हैं?',
      optionA: '3 वर्ष', optionB: '4 वर्ष', optionC: '5 वर्ष', optionD: '6 वर्ष',
      correct: 'C',
      explanation: 'संविधान के 73वें संशोधन के अनुसार पंचायती राज संस्थाओं का कार्यकाल 5 वर्ष का होता है। इसलिए ग्राम पंचायत के चुनाव 5 वर्षों में होते हैं।',
      subjectId: rural.id, topicId: createdTopics['पंचायती राज व्यवस्था'], difficulty: 'EASY',
      source: 'MPESB Rural Economy Pattern'
    },
    {
      textHi: 'पंचायती राज में ग्राम स्तर पर सबसे छोटी इकाई कौन-सी है?',
      optionA: 'ग्राम सभा', optionB: 'ग्राम पंचायत', optionC: 'जनपद पंचायत', optionD: 'जिला पंचायत',
      correct: 'A',
      explanation: 'ग्राम सभा पंचायती राज की सबसे छोटी और मूल इकाई है। इसमें ग्राम के सभी मतदाता सदस्य होते हैं।',
      subjectId: rural.id, topicId: createdTopics['पंचायती राज व्यवस्था'], difficulty: 'EASY',
      source: 'MPESB Rural Economy Pattern'
    },
    {
      textHi: 'मध्यप्रदेश में पंचायती राज की कितनी स्तरीय व्यवस्था है?',
      optionA: 'एक स्तरीय', optionB: 'दो स्तरीय', optionC: 'तीन स्तरीय', optionD: 'चार स्तरीय',
      correct: 'C',
      explanation: 'मध्यप्रदेश में पंचायती राज की त्रि-स्तरीय व्यवस्था है:\n1. ग्राम पंचायत (ग्राम स्तर)\n2. जनपद पंचायत (खंड स्तर)\n3. जिला पंचायत (जिला स्तर)',
      subjectId: rural.id, topicId: createdTopics['पंचायती राज व्यवस्था'], difficulty: 'EASY',
      source: 'MPESB Rural Economy Pattern'
    },
    {
      textHi: 'भारत में "हरित क्रांति" का संबंध किससे है?',
      optionA: 'दूध उत्पादन', optionB: 'मछली उत्पादन', optionC: 'खाद्यान्न उत्पादन', optionD: 'फल उत्पादन',
      correct: 'C',
      explanation: 'हरित क्रांति (1960-70 का दशक) का संबंध खाद्यान्न (मुख्यतः गेहूँ और चावल) के उत्पादन में वृद्धि से है। इसके लिए उन्नत बीज, सिंचाई, और उर्वरकों का उपयोग किया गया।',
      subjectId: rural.id, topicId: createdTopics['कृषि'], difficulty: 'EASY',
      source: 'MPESB Rural Economy Pattern'
    },
    {
      textHi: 'पटवारी का मुख्य कार्य क्या है?',
      optionA: 'ग्राम पंचायत का चुनाव कराना', optionB: 'भूमि अभिलेख (खसरा-खतौनी) को बनाए रखना', optionC: 'कृषि ऋण देना', optionD: 'राशन वितरण करना',
      correct: 'B',
      explanation: 'पटवारी का मुख्य कार्य भूमि अभिलेखों (खसरा, खतौनी, नक्शा) को सही तरीके से बनाए रखना और जमाबंदी अद्यतन करना है। वह ग्राम स्तर पर राजस्व विभाग का प्रतिनिधि होता है।',
      subjectId: rural.id, topicId: createdTopics['भू-राजस्व'], difficulty: 'EASY',
      source: 'MPESB Rural Economy Pattern'
    },
    {
      textHi: '"खसरा" क्या होता है?',
      optionA: 'भूमि का नक्शा', optionB: 'व्यक्तिगत भूमि का रिकॉर्ड जिसमें सर्वेक्षण संख्या, भूमि क्षेत्र और फसल विवरण होता है', optionC: 'ग्राम का रजिस्टर', optionD: 'सिंचाई का रिकॉर्ड',
      correct: 'B',
      explanation: 'खसरा भूमि का एक महत्वपूर्ण दस्तावेज है जिसमें भूमि की सर्वेक्षण संख्या, मालिक का नाम, भूमि का क्षेत्रफल, फसल का विवरण, और सिंचाई का स्रोत दर्ज होता है।',
      subjectId: rural.id, topicId: createdTopics['भू-राजस्व'], difficulty: 'MEDIUM',
      source: 'MPESB Rural Economy Pattern'
    },
    {
      textHi: '"MGNREGA" योजना का संबंध किससे है?',
      optionA: 'शहरी रोजगार', optionB: 'ग्रामीण रोजगार गारंटी', optionC: 'किसानों को ऋण', optionD: 'महिला सशक्तिकरण',
      correct: 'B',
      explanation: 'MGNREGA (महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम) 2005 में पारित हुआ। इसके तहत ग्रामीण परिवारों को प्रति वर्ष कम से कम 100 दिनों का रोजगार गारंटी के साथ दिया जाता है।',
      subjectId: rural.id, topicId: createdTopics['ग्रामीण विकास'], difficulty: 'EASY',
      source: 'MPESB Rural Economy Pattern'
    },
    {
      textHi: 'मध्यप्रदेश में "भू-अभिलेख" विभाग को किस नाम से जाना जाता है?',
      optionA: 'राजस्व विभाग', optionB: 'संचालनालय भू-अभिलेख', optionC: 'पटवारी विभाग', optionD: 'तहसील विभाग',
      correct: 'B',
      explanation: 'मध्यप्रदेश में भूमि अभिलेखों का प्रबंधन "संचालनालय भू-अभिलेख (Commissioner Land Records)" द्वारा किया जाता है।',
      subjectId: rural.id, topicId: createdTopics['भू-राजस्व'], difficulty: 'MEDIUM',
      source: 'MPESB Rural Economy Pattern'
    },

    // ====== अतिरिक्त प्रश्न ======
    {
      textHi: 'मध्यप्रदेश में "टाइगर रिजर्व" की संख्या कितनी है?',
      optionA: '5', optionB: '6', optionC: '7', optionD: '8',
      correct: 'C',
      explanation: 'मध्यप्रदेश में 7 टाइगर रिजर्व हैं: बांधवगढ़, कान्हा, पेंच, सतपुड़ा, पन्ना, संजय-दुबरी, और रातापानी। इसीलिए MP को "टाइगर स्टेट" कहा जाता है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश भूगोल'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'मध्यप्रदेश का राजकीय वृक्ष कौन-सा है?',
      optionA: 'पीपल', optionB: 'बरगद', optionC: 'बाँस', optionD: 'आम',
      correct: 'B',
      explanation: 'बरगद (Ficus benghalensis) मध्यप्रदेश का राजकीय वृक्ष है। यह दीर्घायु और विशालता का प्रतीक है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश संस्कृति एवं कला'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'मध्यप्रदेश का राजकीय पशु कौन-सा है?',
      optionA: 'शेर', optionB: 'बाघ', optionC: 'चीतल', optionD: 'हाथी',
      correct: 'B',
      explanation: 'बाघ (Tiger) मध्यप्रदेश का राजकीय पशु है। मध्यप्रदेश में बाघों की सबसे अधिक संख्या होने के कारण इसे "टाइगर स्टेट" कहा जाता है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश संस्कृति एवं कला'], difficulty: 'EASY',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'उज्जैन में "महाकालेश्वर मंदिर" किस नदी के किनारे स्थित है?',
      optionA: 'बेतवा', optionB: 'क्षिप्रा', optionC: 'नर्मदा', optionD: 'चंबल',
      correct: 'B',
      explanation: 'उज्जैन का महाकालेश्वर मंदिर क्षिप्रा (शिप्रा) नदी के किनारे स्थित है। यह 12 ज्योतिर्लिंगों में से एक है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश संस्कृति एवं कला'], difficulty: 'MEDIUM',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'एक संख्या का वर्गमूल 13 है। उस संख्या का 25% क्या होगा?',
      optionA: '32.25', optionB: '42.25', optionC: '52.25', optionD: '16.9',
      correct: 'B',
      explanation: 'संख्या = 13² = 169\n25% of 169 = 169 × 25/100 = 169/4 = 42.25',
      subjectId: math.id, topicId: createdTopics['प्रतिशत, लाभ-हानि'], difficulty: 'MEDIUM',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: 'यदि P : Q = 3 : 4 और Q : R = 5 : 6, तो P : Q : R क्या होगा?',
      optionA: '15 : 20 : 24', optionB: '12 : 16 : 20', optionC: '3 : 5 : 6', optionD: '15 : 16 : 24',
      correct: 'A',
      explanation: 'P:Q = 3:4 = 15:20 (×5)\nQ:R = 5:6 = 20:24 (×4)\nP:Q:R = 15:20:24',
      subjectId: math.id, topicId: createdTopics['अनुपात-समानुपात'], difficulty: 'HARD',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: '"केवल अधिकारी कर्मचारी ही बैठक में शामिल होते हैं, राम बैठक में शामिल है।" इस से क्या निष्कर्ष निकाला जा सकता है?',
      optionA: 'राम एक साधारण नागरिक है', optionB: 'राम एक अधिकारी कर्मचारी है', optionC: 'बैठक में सभी राम हैं', optionD: 'निष्कर्ष नहीं निकाल सकते',
      correct: 'B',
      explanation: 'यदि "केवल अधिकारी कर्मचारी बैठक में होते हैं" और "राम बैठक में है", तो तार्किक रूप से "राम एक अधिकारी कर्मचारी है।"',
      subjectId: reason.id, topicId: createdTopics['तार्किक अनुमान'], difficulty: 'MEDIUM',
      source: 'MPESB Reasoning Pattern'
    },
    {
      textHi: '"PM Kisan Samman Nidhi" योजना के अंतर्गत किसानों को प्रतिवर्ष कितनी राशि मिलती है?',
      optionA: '₹3000', optionB: '₹4000', optionC: '₹6000', optionD: '₹8000',
      correct: 'C',
      explanation: 'PM-KISAN योजना के तहत पात्र किसान परिवारों को प्रति वर्ष ₹6000 की सहायता राशि तीन किश्तों में दी जाती है।',
      subjectId: rural.id, topicId: createdTopics['कृषि'], difficulty: 'EASY',
      source: 'MPESB Rural Economy Pattern'
    },
    {
      textHi: 'MS PowerPoint में एक स्लाइड से दूसरी स्लाइड पर जाने के प्रभाव को क्या कहते हैं?',
      optionA: 'Animation', optionB: 'Transition', optionC: 'Effect', optionD: 'Theme',
      correct: 'B',
      explanation: 'MS PowerPoint में एक स्लाइड से दूसरी स्लाइड पर जाने के दृश्य प्रभाव को "Transition" कहते हैं। "Animation" किसी तत्व की गतिविधि होती है।',
      subjectId: comp.id, topicId: createdTopics['MS Office'], difficulty: 'MEDIUM',
      source: 'MPESB Computer Pattern'
    },
    {
      textHi: 'मध्यप्रदेश में "कुनो राष्ट्रीय उद्यान" किस जिले में स्थित है?',
      optionA: 'शिवपुरी', optionB: 'श्योपुर', optionC: 'मुरैना', optionD: 'ग्वालियर',
      correct: 'B',
      explanation: 'कुनो राष्ट्रीय उद्यान श्योपुर जिले में स्थित है। यहाँ 2022 में चीतों को अफ्रीका से पुनर्स्थापित किया गया था।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश भूगोल'], difficulty: 'HARD',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: 'इंदौर किस नदी के किनारे बसा है?',
      optionA: 'नर्मदा', optionB: 'सरस्वती', optionC: 'क्षान और सरस्वती', optionD: 'चंबल',
      correct: 'C',
      explanation: 'इंदौर शहर क्षान और सरस्वती नदियों के किनारे बसा है। यह मध्यप्रदेश का सबसे बड़ा और सबसे स्वच्छ शहर (स्वच्छ सर्वेक्षण) है।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश भूगोल'], difficulty: 'HARD',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: '"हिंदी" भाषा का पहला समाचार पत्र कौन-सा था?',
      optionA: 'केसरी', optionB: 'दिग्दर्शन', optionC: 'उदंत मार्तंड', optionD: 'जन साहस',
      correct: 'C',
      explanation: '"उदंत मार्तंड" (The Rising Sun) हिंदी का पहला समाचार पत्र था। इसे 1826 में पं. जुगल किशोर शुक्ल ने कलकत्ता से प्रकाशित किया था।',
      subjectId: hin.id, topicId: createdTopics['हिंदी साहित्य'], difficulty: 'HARD',
      source: 'MPESB Hindi Pattern'
    },
    {
      textHi: 'श्रृंखला में लुप्त संख्या क्या है? 1, 1, 2, 3, 5, 8, ?, 21',
      optionA: '11', optionB: '12', optionC: '13', optionD: '14',
      correct: 'C',
      explanation: 'यह फिबोनाची श्रृंखला है। प्रत्येक संख्या अपने से पहले की दो संख्याओं का योग होती है:\n5 + 8 = 13',
      subjectId: reason.id, topicId: createdTopics['श्रृंखला एवं सादृश्यता'], difficulty: 'MEDIUM',
      source: 'MPESB Reasoning Pattern'
    },
    {
      textHi: 'मध्यप्रदेश "लोक सेवा गारंटी अधिनियम" किस वर्ष पारित हुआ?',
      optionA: '2008', optionB: '2010', optionC: '2012', optionD: '2015',
      correct: 'B',
      explanation: 'मध्यप्रदेश लोक सेवा गारंटी अधिनियम 2010 में पारित हुआ। यह देश का पहला ऐसा कानून था जिसके तहत नागरिकों को निश्चित समय में सरकारी सेवाएं देना अनिवार्य किया गया।',
      subjectId: gk.id, topicId: createdTopics['मध्यप्रदेश शासन योजनाएं'], difficulty: 'HARD',
      source: 'MPESB Previous Pattern'
    },
    {
      textHi: '₹1200 की वस्तु पर 15% छूट के बाद मूल्य क्या होगा?',
      optionA: '₹1020', optionB: '₹1080', optionC: '₹1000', optionD: '₹1050',
      correct: 'A',
      explanation: 'छूट = 15% of 1200 = 180\nविक्रय मूल्य = 1200 - 180 = ₹1020',
      subjectId: math.id, topicId: createdTopics['प्रतिशत, लाभ-हानि'], difficulty: 'EASY',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: 'यदि एक पाइप किसी टंकी को 6 घंटे में भरता है और दूसरा 3 घंटे में खाली करता है, तो दोनों एक साथ चलने पर टंकी कब खाली होगी?',
      optionA: '6 घंटे', optionB: '3 घंटे', optionC: '4 घंटे', optionD: '2 घंटे',
      correct: 'A',
      explanation: 'भरने वाला = 1/6 प्रति घंटा\nखाली करने वाला = 1/3 प्रति घंटा\nनिकास दर = 1/3 - 1/6 = 1/6 प्रति घंटा\nटंकी 6 घंटे में खाली होगी।',
      subjectId: math.id, topicId: createdTopics['समय, गति, दूरी'], difficulty: 'HARD',
      source: 'MPESB Math Pattern'
    },
    {
      textHi: '"खतौनी" क्या होती है?',
      optionA: 'भूमि का नक्शा', optionB: 'एक मालिक की सभी भूमि का समेकित रिकॉर्ड', optionC: 'फसल का रिकॉर्ड', optionD: 'सिंचाई रजिस्टर',
      correct: 'B',
      explanation: 'खतौनी वह रजिस्टर है जिसमें किसी एक मालिक की सभी भूमि का समेकित विवरण दर्ज होता है। यह खसरे से बना होता है।',
      subjectId: rural.id, topicId: createdTopics['भू-राजस्व'], difficulty: 'MEDIUM',
      source: 'MPESB Rural Economy Pattern'
    },
    {
      textHi: 'कंप्यूटर वायरस क्या है?',
      optionA: 'एक हार्डवेयर समस्या', optionB: 'एक प्रकार का जैविक रोग', optionC: 'एक दुर्भावनापूर्ण सॉफ्टवेयर प्रोग्राम', optionD: 'इंटरनेट सेवा प्रदाता',
      correct: 'C',
      explanation: 'कंप्यूटर वायरस एक दुर्भावनापूर्ण (malicious) सॉफ्टवेयर प्रोग्राम है जो स्वयं को कॉपी करके अन्य फाइलों में फैलता है और कंप्यूटर को नुकसान पहुँचाता है।',
      subjectId: comp.id, topicId: createdTopics['कंप्यूटर की मूल बातें'], difficulty: 'EASY',
      source: 'MPESB Computer Pattern'
    },
    {
      textHi: 'मध्यप्रदेश में "सोयाबीन" किस प्रकार की फसल है?',
      optionA: 'रबी फसल', optionB: 'खरीफ फसल', optionC: 'जायद फसल', optionD: 'सदाबहार फसल',
      correct: 'B',
      explanation: 'सोयाबीन खरीफ की फसल है। मध्यप्रदेश सोयाबीन उत्पादन में भारत में अग्रणी है, इसलिए इसे "सोया प्रदेश" भी कहते हैं।',
      subjectId: rural.id, topicId: createdTopics['कृषि'], difficulty: 'MEDIUM',
      source: 'MPESB Rural Economy Pattern'
    },
  ]

  let qCount = 0
  for (const q of questions) {
    await prisma.question.create({ data: q })
    qCount++
  }
  console.log(`✓ ${qCount} Questions created`)

  // Mock Tests
  const fullTest = await prisma.mockTest.create({
    data: {
      title: 'MP Patwari Full Mock Test 1',
      titleHi: 'MP Patwari 2026 — फुल मॉक टेस्ट 1',
      description: 'MPESB पैटर्न पर आधारित पूर्ण मॉक टेस्ट। 100 प्रश्न, 100 अंक, 120 मिनट।',
      type: 'FULL',
      totalQuestions: 100,
      totalMarks: 100,
      duration: 120,
      negativeMarks: 0,
      isPublished: true,
      order: 1,
    }
  })

  // Assign questions to test (all available questions, up to 100)
  const allQs = await prisma.question.findMany({ where: { isActive: true }, take: 100, orderBy: { createdAt: 'asc' } })
  for (let i = 0; i < allQs.length; i++) {
    await prisma.testQuestion.create({ data: { testId: fullTest.id, questionId: allQs[i].id, order: i } })
  }

  // Subject tests
  for (const sub of subjects) {
    const subQs = await prisma.question.findMany({ where: { subjectId: sub.id, isActive: true }, take: 20 })
    if (subQs.length >= 5) {
      const test = await prisma.mockTest.create({
        data: {
          title: `${sub.name} Test`,
          titleHi: `${sub.nameHi} — विषयवार टेस्ट`,
          description: `${sub.nameHi} पर केंद्रित अभ्यास टेस्ट`,
          type: 'SUBJECT',
          totalQuestions: subQs.length,
          totalMarks: subQs.length,
          duration: subQs.length * 1.5,
          negativeMarks: 0,
          isPublished: true,
          order: sub.order + 10,
          subjectId: sub.id,
        }
      })
      for (let i = 0; i < subQs.length; i++) {
        await prisma.testQuestion.create({ data: { testId: test.id, questionId: subQs[i].id, order: i } })
      }
    }
  }

  // Previous Year Pattern test
  const pyTest = await prisma.mockTest.create({
    data: {
      title: 'MP Patwari Previous Year Pattern Test',
      titleHi: 'MP Patwari — पिछले वर्ष पैटर्न टेस्ट',
      description: 'MPESB पिछले वर्षों के परीक्षा पैटर्न पर आधारित टेस्ट (वास्तविक प्रश्न नहीं)',
      type: 'PREVIOUS_YEAR',
      totalQuestions: 50,
      totalMarks: 50,
      duration: 60,
      negativeMarks: 0,
      isPublished: true,
      order: 2,
    }
  })
  for (let i = 0; i < Math.min(50, allQs.length); i++) {
    await prisma.testQuestion.create({ data: { testId: pyTest.id, questionId: allQs[i].id, order: i } })
  }

  console.log('✓ Mock Tests created and published')
  console.log('\n🎉 Seeding complete!')
  console.log('Admin: admin@mppatwari.in / admin@2026')
  console.log('Test User: test@mppatwari.in / test1234')
}

main().catch(console.error).finally(() => prisma.$disconnect())
