'use client'
import { useState, useEffect } from 'react'

interface Section { title: string; rows: string[] }
interface Subject { id: string; nameHi: string; color: string; icon: string; sections: Section[] }

const SUBJECTS: Subject[] = [
  {
    id: 'math', nameHi: 'गणित', color: '#1d4ed8', icon: '🔢',
    sections: [
      {
        title: 'प्रतिशत (Percentage)',
        rows: [
          'x% of y = (x × y) ÷ 100',
          'x% वृद्धि → × (1 + x/100)',
          'x% कमी → × (1 − x/100)',
          'A, B से x% अधिक → B = A × 100/(100+x)',
          '10% = ÷10 | 20% = ÷5 | 25% = ÷4 | 50% = ÷2',
          '33⅓% = ÷3 | 12½% = ÷8 | 16⅔% = ÷6',
        ],
      },
      {
        title: 'लाभ-हानि (Profit & Loss)',
        rows: [
          'लाभ% = (लाभ ÷ CP) × 100',
          'SP = CP × (100 + P%) ÷ 100',
          'CP = SP × 100 ÷ (100 + P%)',
          'हानि% = (हानि ÷ CP) × 100',
          'SP = CP × (100 − हानि%) ÷ 100',
          'बट्टा% = (बट्टा ÷ MP) × 100 | SP = MP × (100−D)/100',
          'दो क्रमिक छूट a% व b% → कुल = (a+b − ab/100)%',
        ],
      },
      {
        title: 'ब्याज (Interest)',
        rows: [
          'SI = P × R × T ÷ 100',
          'A = P + SI = P(1 + RT/100)',
          'CI: A = P(1 + R/100)ᵀ',
          'CI − SI (2 वर्ष) = P(R/100)²',
          'अर्धवार्षिक → R/2 और T×2 लगाएं',
          'तिमाही → R/4 और T×4 लगाएं',
        ],
      },
      {
        title: 'औसत (Average)',
        rows: [
          'औसत = योग ÷ संख्या',
          'नया सदस्य = पुराना औसत + n × बदलाव',
          'हटाया सदस्य = पुराना औसत − n × बदलाव',
          'भारित औसत = Σ(w×x) ÷ Σw',
        ],
      },
      {
        title: 'समय-कार्य (Time & Work)',
        rows: [
          'A की दर = 1/a (यदि a दिन में पूरा करे)',
          'A+B मिलकर = AB/(A+B) दिन',
          'A+B+C = ABC/(AB+BC+CA)',
          'Pipe भरे: 1/a + 1/b | Pipe निकाले: 1/a − 1/b',
          'M₁D₁H₁ = M₂D₂H₂ (समान कार्य)',
        ],
      },
      {
        title: 'चाल-दूरी (Speed & Distance)',
        rows: [
          'चाल = दूरी ÷ समय',
          'औसत चाल = 2S₁S₂ ÷ (S₁+S₂) [समान दूरी]',
          'ट्रेन: लंबाई = (S₁±S₂) × समय',
          '1 km/h = 5/18 m/s | 1 m/s = 18/5 km/h',
          'Boat: धारा के साथ = u+v | विरुद्ध = u−v',
          'धारा चाल = (अनुकूल−प्रतिकूल) ÷ 2',
        ],
      },
      {
        title: 'क्षेत्रफल (Area)',
        rows: [
          'वर्ग: a² | परिमाप: 4a | विकर्ण: a√2',
          'आयत: l×b | परिमाप: 2(l+b) | विकर्ण: √(l²+b²)',
          'त्रिभुज: ½×b×h | हीरो: √s(s-a)(s-b)(s-c), s=(a+b+c)/2',
          'समबाहु △: (√3/4)a² | परिमाप: 3a',
          'वृत्त: πr² | परिधि: 2πr | π ≈ 22/7 ≈ 3.14',
          'समलंब: ½(a+b)×h | समचतुर्भुज: ½×d₁×d₂',
        ],
      },
      {
        title: 'आयतन (Volume)',
        rows: [
          'घन: a³ | पृष्ठ: 6a² | विकर्ण: a√3',
          'घनाभ: l×b×h | पृष्ठ: 2(lb+bh+lh)',
          'बेलन: πr²h | वक्र पृष्ठ: 2πrh | कुल: 2πr(r+h)',
          'शंकु: ⅓πr²h | तिर्यक: πrl | l=√(r²+h²)',
          'गोला: (4/3)πr³ | पृष्ठ: 4πr²',
          'अर्धगोला: (2/3)πr³ | कुल पृष्ठ: 3πr²',
        ],
      },
      {
        title: 'संख्या पद्धति',
        rows: [
          'LCM × HCF = दो संख्याओं का गुणनफल',
          '(a+b)² = a²+2ab+b² | (a−b)² = a²−2ab+b²',
          '(a+b)(a−b) = a²−b²',
          'a³+b³ = (a+b)(a²−ab+b²)',
          'a³−b³ = (a−b)(a²+ab+b²)',
          'विभाज्यता: 2(अंतिम 0/2/4/6/8) | 3(अंकों का योग 3से) | 9(योग 9से) | 11(विषम−सम=0/11)',
        ],
      },
      {
        title: 'अनुपात-समानुपात',
        rows: [
          'a:b = c:d → ad = bc (product of means = extremes)',
          'यदि a:b = m:n → a = mk, b = nk',
          'मिश्रण: सस्ता:महंगा = (महंगा−मध्य):(मध्य−सस्ता)',
          'साझेदारी: लाभ ∝ पूंजी × समय',
        ],
      },
    ],
  },
  {
    id: 'hindi', nameHi: 'हिंदी', color: '#b45309', icon: '📖',
    sections: [
      {
        title: 'संधि',
        rows: [
          '★ स्वर संधि: दो स्वरों का मेल',
          'दीर्घ: अ/आ + अ/आ = आ (विद्यालय = विद्या+आलय)',
          'गुण: अ/आ + इ/ई = ए | + उ/ऊ = ओ | + ऋ = अर्',
          'वृद्धि: अ/आ + ए/ऐ = ऐ | + ओ/औ = औ',
          'यण: इ/ई → य | उ/ऊ → व | ऋ → र् (स्वर से पहले)',
          '★ व्यंजन संधि: व्यंजन+स्वर/व्यंजन',
          '★ विसर्ग संधि: विसर्ग(:)+स्वर/व्यंजन',
        ],
      },
      {
        title: 'समास',
        rows: [
          'तत्पुरुष — दूसरा पद प्रधान (राजपुत्र = राजा का पुत्र)',
          'कर्मधारय — विशेषण+विशेष्य (नीलकमल = नीला कमल)',
          'द्विगु — संख्यावाचक पहला पद (त्रिभुज = तीन भुजाओं का)',
          'द्वंद्व — दोनों पद समान (माता-पिता)',
          'बहुव्रीहि — अन्य अर्थ (गजानन = गज जैसा मुख जिसका)',
          'अव्ययीभाव — पहला पद अव्यय (यथाशक्ति, प्रतिदिन)',
        ],
      },
      {
        title: 'रस (9+1)',
        rows: [
          'शृंगार (प्रेम) | हास्य (हँसी) | करुण (दुःख)',
          'रौद्र (क्रोध) | वीर (उत्साह) | भयानक (भय)',
          'बीभत्स (घृणा) | अद्भुत (आश्चर्य) | शांत (वैराग्य)',
          'वत्सल (बच्चों से प्रेम) — 10वाँ रस',
          'स्थायी भाव → विभाव+अनुभाव+संचारी → रस',
        ],
      },
      {
        title: 'अलंकार',
        rows: [
          '★ शब्द अलंकार: ध्वनि साम्य',
          'अनुप्रास — वर्ण की आवृत्ति (चारु चंद्र की चंचल किरणें)',
          'यमक — एक शब्द अनेक अर्थ | श्लेष — एक प्रयोग अनेक अर्थ',
          '★ अर्थ अलंकार: अर्थ आधारित',
          'उपमा — जैसे, सा, सी से तुलना',
          'रूपक — रूप का आरोप (मुख=चंद्र)',
          'उत्प्रेक्षा — मानो, जनु, ज्यों (कल्पना)',
          'अतिशयोक्ति — बढ़ा-चढ़ाकर',
        ],
      },
      {
        title: 'काल एवं वाच्य',
        rows: [
          'भूत: था/थी/थे — अपूर्ण: रहा था — पूर्ण: चुका था',
          'वर्तमान: है/हैं — अपूर्ण: रहा है — संदिग्ध: होगा',
          'भविष्य: गा/गी/गे',
          '★ वाच्य: कर्तृ | कर्म | भाव',
          'कर्म वाच्य: क्रिया कर्म के अनुसार',
        ],
      },
      {
        title: 'उपसर्ग व प्रत्यय',
        rows: [
          'उपसर्ग: अ(नहीं), सु(अच्छा), कु(बुरा), प्र(आगे), वि(विशेष)',
          'अप(विपरीत), सम(साथ), अव(नीचे), अनु(पीछे), परि(चारों ओर)',
          'प्रत्यय: ता(गुणवाचक), इक(संबंधवाचक), वान/मान(युक्त)',
          'आई, आहट, पन, त्व, आवट — भाव प्रत्यय',
        ],
      },
    ],
  },
  {
    id: 'english', nameHi: 'अंग्रेजी', color: '#15803d', icon: '🔤',
    sections: [
      {
        title: 'Tenses (काल)',
        rows: [
          '★ Present: V1/V5 | is/am/are+V4 | has/have+V3 | has/have+been+V4',
          '★ Past: V2 | was/were+V4 | had+V3 | had+been+V4',
          '★ Future: will+V1 | will+be+V4 | will+have+V3 | will+have+been+V4',
          'V4 = V+ing (Present Participle)',
          'V3 = Past Participle (gone, written, done)',
        ],
      },
      {
        title: 'Active ↔ Passive Voice',
        rows: [
          'Present: S+V+O → O+is/am/are+V3+by S',
          'Past: S+V2+O → O+was/were+V3+by S',
          'Future: S+will+V+O → O+will be+V3+by S',
          'Pres. Cont.: S+is+V4+O → O+is being+V3+by S',
          'Past Perf.: S+had+V3+O → O+had been+V3+by S',
          'Modal: S+can/may+V+O → O+can/may+be+V3+by S',
        ],
      },
      {
        title: 'Articles',
        rows: [
          'A — consonant sound से शुरू (a book, a university)',
          'An — vowel sound से शुरू (an apple, an hour)',
          'The — specific/known noun (the sun, the Taj Mahal)',
          'No article — proper noun, language, sport, meal (usually)',
          'Trick: a/an = अनिश्चित | the = निश्चित',
        ],
      },
      {
        title: 'Narration (Direct → Indirect)',
        rows: [
          'Said → told/said (to) | "that" जोड़ें',
          'Pronouns: I→he/she | we→they | you→he/she/they',
          'Tense: is→was | am→was | will→would | can→could',
          'has/have→had | do/does→did | shall→would',
          'Time: now→then | today→that day | here→there',
          'yesterday→the previous day | tomorrow→the next day',
        ],
      },
      {
        title: 'Prepositions',
        rows: [
          'At: point (at 5pm, at school) | In: period/place (in 2024, in India)',
          'On: surface/day (on Monday, on the table)',
          'Since: point of time (since 2020) | For: period (for 3 years)',
          'Between: दो के बीच | Among: दो से अधिक के बीच',
          'Beside: बगल में | Besides: के अलावा',
          'In spite of / Despite: के बावजूद',
        ],
      },
      {
        title: 'Common Errors',
        rows: [
          'Their(उनका) / There(वहाँ) / They\'re(वे हैं)',
          'Its(उसका) / It\'s(यह है)',
          'Then(तब) / Than(से तुलना)',
          'Affect(प्रभावित करना-verb) / Effect(प्रभाव-noun)',
          'Principal(मुख्य/प्राचार्य) / Principle(सिद्धांत)',
          'Fewer(गिनने योग्य) / Less(अनगिनत) | Many/Few vs Much/Little',
        ],
      },
    ],
  },
  {
    id: 'reasoning', nameHi: 'तर्क शक्ति', color: '#6d28d9', icon: '🧩',
    sections: [
      {
        title: 'रक्त संबंध',
        rows: [
          'माता-पिता: Mother(M) Father(F) | Son(S) Daughter(D)',
          'Brother(B) Sister(Si) | Husband(H) Wife(W)',
          'Uncle = पिता/माता का भाई | Aunt = पिता/माता की बहन',
          'Nephew = भाई/बहन का पुत्र | Niece = भाई/बहन की पुत्री',
          'Maternal = नाना-नानी पक्ष | Paternal = दादा-दादी पक्ष',
          'Trick: पीढ़ी चार्ट बनाएं — ऊपर से नीचे परिवार',
        ],
      },
      {
        title: 'दिशा-ज्ञान',
        rows: [
          'उत्तर↑ दक्षिण↓ पूर्व→ पश्चिम←',
          'दाएं मुड़ने पर: N→E→S→W→N',
          'बाएं मुड़ने पर: N→W→S→E→N',
          'सूर्योदय = पूर्व | सूर्यास्त = पश्चिम',
          'परछाईं: सुबह = पश्चिम में | शाम = पूर्व में',
          'दूरी: a²+b² = c² (pythagorean) — सीधी दूरी',
        ],
      },
      {
        title: 'कूट-भाषा (Coding)',
        rows: [
          'A=1 B=2 ... Z=26 | A=26 B=25 ... Z=1 (विपरीत)',
          'अगला अक्षर: A→B, Z→A | अंग्रेजी अक्षर क्रम जांचें',
          '+2 shift: A→C, B→D | −3 shift: D→A',
          'Position from end: Z=1, Y=2, X=3...',
          'Trick: EJOTY = 5,10,15,20,25 (याद करें)',
        ],
      },
      {
        title: 'श्रृंखला (Series)',
        rows: [
          '★ संख्या श्रृंखला: अंतर देखें → +2,+3,+4... या ×2,×3...',
          'वर्ग: 1,4,9,16,25,36,49,64,81,100',
          'घन: 1,8,27,64,125,216,343',
          'अभाज्य: 2,3,5,7,11,13,17,19,23,29,31,37',
          '★ अक्षर श्रृंखला: +3 = skip 2 letters',
          'Fibonacci: 1,1,2,3,5,8,13,21 (पिछले दो का योग)',
        ],
      },
      {
        title: 'न्याय निगमन (Syllogism)',
        rows: [
          'सभी A, B है → कुछ B, A है (✓)',
          'कोई A, B नहीं → कोई B, A नहीं (✓)',
          'कुछ A, B हैं → कुछ B, A हैं (✓)',
          'सभी A, B और सभी B, C → सभी A, C (✓)',
          'Possibility: "हो सकता है" — विरोध नहीं होना चाहिए',
          'Venn Diagram: गोले बनाएं और निष्कर्ष जाँचें',
        ],
      },
      {
        title: 'वर्गीकरण व अनुक्रम',
        rows: [
          'विषम पद: जो बाकी से संबंधित न हो',
          'Ranking: बाएं+दाएं−1 = कुल (यदि दोनों दिशा से)',
          'Clock: मिनट की सुई 1 मिनट = 6° | घंटे की = 0.5°',
          'दोनों का कोण = |30H − 5.5M|',
          'Calendar: Jan1,2023=Sun → 365 दिन = 52w+1 दिन → बढ़े 1',
          'Leap year: 366 दिन = 52w+2 दिन → बढ़े 2',
        ],
      },
    ],
  },
  {
    id: 'computer', nameHi: 'कंप्यूटर', color: '#0e7490', icon: '💻',
    sections: [
      {
        title: 'महत्वपूर्ण शॉर्टकट',
        rows: [
          'Ctrl+C=कॉपी | Ctrl+X=कट | Ctrl+V=पेस्ट',
          'Ctrl+Z=अनडू | Ctrl+Y=रीडू | Ctrl+A=सब चुनें',
          'Ctrl+S=सेव | Ctrl+P=प्रिंट | Ctrl+F=खोजें',
          'Alt+F4=बंद करें | F1=मदद | F5=रिफ्रेश',
          'Windows+D=डेस्कटॉप | Windows+E=फाइल एक्सप्लोरर',
          'Shift+Delete=स्थायी हटाएं | Delete=रीसाइकिल बिन',
        ],
      },
      {
        title: 'डेटा इकाइयाँ',
        rows: [
          '8 Bits = 1 Byte',
          '1024 Bytes = 1 KB (Kilobyte)',
          '1024 KB = 1 MB (Megabyte)',
          '1024 MB = 1 GB (Gigabyte)',
          '1024 GB = 1 TB (Terabyte)',
          'Bit = smallest unit | Nibble = 4 bits',
        ],
      },
      {
        title: 'कंप्यूटर पीढ़ियाँ',
        rows: [
          '1st (1940-56): Vacuum Tube — ENIAC, UNIVAC',
          '2nd (1956-63): Transistor — IBM 1401',
          '3rd (1964-71): IC (Integrated Circuit)',
          '4th (1971-): Microprocessor — Personal Computer',
          '5th (अब): AI, VLSI, Parallel Processing',
          'PARAM = भारत का सुपर कंप्यूटर',
        ],
      },
      {
        title: 'इंटरनेट व नेटवर्क',
        rows: [
          'WWW = World Wide Web | HTTP/HTTPS = web protocol',
          'FTP(21) | SMTP(25) | POP3(110) | HTTP(80) | HTTPS(443)',
          'IP Address: IPv4 (32-bit) | IPv6 (128-bit)',
          'LAN=Local | MAN=Metropolitan | WAN=Wide Area Network',
          'Modem = Modulator+Demodulator (Analog↔Digital)',
          'ISP = Internet Service Provider | DNS = Domain Name System',
        ],
      },
      {
        title: 'MS Office',
        rows: [
          'Word: .docx | Excel: .xlsx | PowerPoint: .pptx',
          'Excel: SUM/AVERAGE/COUNT/MAX/MIN/IF फंक्शन',
          'Cells: A1, B2 (Column+Row) | $ = Absolute reference',
          'PowerPoint: Slide, Slide Show, Animation, Transition',
          'Mail Merge: अनेक को एक ही पत्र भेजना',
          'Macro: स्वचालित कार्य रिकॉर्ड करना',
        ],
      },
      {
        title: 'OS व सुरक्षा',
        rows: [
          'OS: Windows, Linux, Mac | Kernel = मुख्य भाग',
          'RAM = Volatile (बंद होने पर मिटे) | ROM = Non-volatile',
          'Cache > RAM > HDD (गति क्रम)',
          'Virus: Boot | File | Macro | Worm | Trojan Horse',
          'Antivirus: Norton, Kaspersky, Quick Heal, Avast',
          'Firewall = नेटवर्क सुरक्षा दीवार',
        ],
      },
    ],
  },
  {
    id: 'gk', nameHi: 'सामान्य ज्ञान', color: '#b91c1c', icon: '🗺️',
    sections: [
      {
        title: 'मध्यप्रदेश — सामान्य',
        rows: [
          'राजधानी: भोपाल | राजकीय भाषा: हिंदी',
          'जिले: 55 | संभाग: 10 | तहसील: 342+',
          'क्षेत्रफल: 3,08,252 km² (देश में 2वाँ)',
          'MP का गठन: 1 नवंबर 1956',
          'राज्यपाल: मनसुख मंडाविया | CM: मोहन यादव (2024)',
          'MP की सबसे लंबी नदी: नर्मदा (1,312 km)',
        ],
      },
      {
        title: 'MP — भूगोल',
        rows: [
          'सबसे ऊँची चोटी: धूपगढ़ (1350m) — पचमढ़ी',
          'राष्ट्रीय उद्यान: 12 (कान्हा, बांधवगढ़, पेंच, सतपुड़ा)',
          'प्रमुख नदियाँ: नर्मदा, चंबल, बेतवा, तापी, सोन, वैनगंगा',
          'खनिज: हीरा (पन्ना), कोयला, चूना पत्थर, मैंगनीज',
          'मध्यप्रदेश का हृदय (Heart of India) कहलाता है',
          'वन क्षेत्र: 25% से अधिक (सागौन वन प्रसिद्ध)',
        ],
      },
      {
        title: 'MP — राजव्यवस्था',
        rows: [
          'विधानसभा: 230 सीटें | लोकसभा: 29 | राज्यसभा: 11',
          'उच्च न्यायालय: जबलपुर (खंडपीठ: ग्वालियर, इंदौर)',
          'पटवारी: तहसील स्तर पर भूमि अभिलेख अधिकारी',
          'ग्राम पंचायत → जनपद → जिला पंचायत',
          'नगर पंचायत → नगर परिषद → नगर पालिका → नगर निगम',
        ],
      },
      {
        title: 'भारत — संविधान',
        rows: [
          '26 जनवरी 1950 — लागू | 26 नवंबर 1949 — अंगीकृत',
          'अनुच्छेद 1: भारत राज्यों का संघ',
          'अनुच्छेद 14-18: समानता का अधिकार',
          'अनुच्छेद 19-22: स्वतंत्रता का अधिकार',
          'अनुच्छेद 32: संवैधानिक उपचारों का अधिकार (हृदय)',
          'मूल कर्तव्य: अनुच्छेद 51A | 42वाँ संशोधन 1976',
        ],
      },
      {
        title: 'MP — योजनाएँ',
        rows: [
          'लाडली बहना: ₹1250/माह महिलाओं को',
          'CM Rise School: उत्कृष्ट विद्यालय योजना',
          'मुख्यमंत्री किसान कल्याण योजना: ₹4000/वर्ष',
          'जन-सेवा केंद्र: एक खिड़की सेवा',
          'मुख्यमंत्री मेधावी विद्यार्थी योजना: उच्च शिक्षा',
          'PM-KISAN: ₹6000/वर्ष | PMFBY: फसल बीमा',
        ],
      },
    ],
  },
  {
    id: 'rural', nameHi: 'ग्रामीण अर्थव्यवस्था', color: '#166534', icon: '🌾',
    sections: [
      {
        title: 'पटवारी के कार्य',
        rows: [
          'भूमि अभिलेख (Land Records) का रखरखाव',
          'नामांतरण (Mutation/Namantar): स्वामित्व बदलाव दर्ज',
          'बंटवारा (Partition): भूमि विभाजन का अभिलेख',
          'फसल गिरदावरी (Crop Inspection): मौसम में फसल सर्वेक्षण',
          'सीमाचिह्न (Boundary Mark): खेतों की सीमा निर्धारण',
          'राजस्व वसूली में सहायता | प्राकृतिक आपदा रिपोर्ट',
        ],
      },
      {
        title: 'भूमि अभिलेख दस्तावेज़',
        rows: [
          'खसरा (Khasra): भूखंड का विवरण — नंबर, क्षेत्र, फसल',
          'खतौनी (Khatauni): भूमि स्वामी का विवरण (B1)',
          'नक्शा (Map): भूखंड का नक्शा',
          'P-11: खसरे का सारांश | B-1: खतौनी की नकल',
          'राजस्व रजिस्टर: 1-16 तक (विभिन्न अभिलेख)',
          'RCMS पोर्टल: MP में भूमि अभिलेख ऑनलाइन',
        ],
      },
      {
        title: 'फसल ऋतुएँ',
        rows: [
          'खरीफ: जून-नवंबर (वर्षा ऋतु) — धान, सोयाबीन, मक्का, कपास',
          'रबी: नवंबर-मार्च (शीत) — गेहूँ, चना, सरसों, मसूर',
          'जायद: मार्च-जून (ग्रीष्म) — तरबूज, खीरा, सब्जियाँ',
          'MP की मुख्य फसलें: गेहूँ, सोयाबीन, चना, धान',
          'MP = सोयाबीन राज्य (देश में सर्वाधिक उत्पादन)',
        ],
      },
      {
        title: 'सिंचाई व कृषि',
        rows: [
          'सिंचाई: नहर, नलकूप, तालाब, ड्रिप, स्प्रिंकलर',
          'हरित क्रांति: गेहूँ-चावल उत्पादन में वृद्धि (1960s)',
          'श्वेत क्रांति: दुग्ध उत्पादन (Amul, NDDB)',
          'नीली क्रांति: मछली उत्पादन',
          'जैव उर्वरक: राइजोबियम, एजोटोबैक्टर',
          'NPK: N=नाइट्रोजन, P=फास्फोरस, K=पोटेशियम',
        ],
      },
      {
        title: 'सरकारी योजनाएँ (कृषि)',
        rows: [
          'PM-KISAN: ₹6000/वर्ष (3 किस्त) — सभी किसान',
          'PMFBY: फसल बीमा — न्यूनतम प्रीमियम',
          'MGNREGA: 100 दिन का रोजगार गारंटी',
          'PM Awas Yojana (Gramin): ग्रामीण आवास',
          'Nal Jal Yojana: घर-घर पानी',
          'KCC (Kisan Credit Card): अल्पकालीन कृषि ऋण',
        ],
      },
      {
        title: 'पंचायती राज',
        rows: [
          '73वाँ संविधान संशोधन 1992 — पंचायती राज',
          '3 स्तर: ग्राम पंचायत → जनपद → जिला पंचायत',
          'ग्राम सभा: 18+ आयु के सभी मतदाता',
          'पंचायत चुनाव: हर 5 वर्ष | 33% महिला आरक्षण',
          '11वीं अनुसूची: 29 विषय पंचायत को',
          'सरपंच: ग्राम पंचायत प्रमुख',
        ],
      },
    ],
  },
]

interface FormulaPanelProps { open: boolean; onClose: () => void }

export default function FormulaPanel({ open, onClose }: FormulaPanelProps) {
  const [activeSubject, setActiveSubject] = useState('math')

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const subject = SUBJECTS.find(s => s.id === activeSubject) ?? SUBJECTS[0]

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col"
        style={{
          width: 'min(540px, 100vw)',
          background: '#fff',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
          animation: 'slideIn 0.22s ease-out',
        }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#1e3a8a,#2563eb)', borderBottom: '1px solid #1e40af' }}>
          <div>
            <h2 className="font-bold text-white text-base">📚 फॉर्मूला शीट</h2>
            <p className="text-xs mt-0.5" style={{ color: '#93c5fd' }}>MP Patwari 2026 — परीक्षा संदर्भ पत्रिका</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}>
            ✕
          </button>
        </div>

        {/* Subject tabs — horizontal scroll */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto flex-shrink-0"
          style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
          {SUBJECTS.map(s => (
            <button key={s.id} onClick={() => setActiveSubject(s.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
              style={activeSubject === s.id
                ? { background: s.color, color: '#fff', boxShadow: `0 2px 8px ${s.color}55` }
                : { background: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }}>
              <span>{s.icon}</span>
              <span>{s.nameHi}</span>
            </button>
          ))}
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {subject.sections.map((sec, si) => (
            <div key={si} className="rounded-xl overflow-hidden"
              style={{ border: '1px solid #f1f5f9' }}>
              {/* Section header */}
              <div className="px-4 py-2.5 flex items-center gap-2"
                style={{ background: subject.color + '12' }}>
                <div className="w-1 h-4 rounded-full flex-shrink-0" style={{ background: subject.color }} />
                <span className="text-sm font-bold" style={{ color: subject.color }}>{sec.title}</span>
              </div>
              {/* Rows */}
              <div className="divide-y" style={{ borderColor: '#f8fafc' }}>
                {sec.rows.map((row, ri) => (
                  <div key={ri} className="px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      color: row.startsWith('★') ? '#1e293b' : '#334155',
                      fontWeight: row.startsWith('★') ? '600' : '400',
                      background: ri % 2 === 0 ? '#fff' : '#fafafa',
                      fontFamily: row.match(/[A-Z]{2,}|[\d×÷+−=]/) ? 'monospace' : 'inherit',
                    }}>
                    {row}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 flex-shrink-0 text-center"
          style={{ borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
          <p className="text-xs" style={{ color: '#94a3b8' }}>
            MP Patwari 2026 परीक्षा के लिए विशेष रूप से तैयार — अभ्यास जारी रखें 🎯
          </p>
        </div>
      </div>
    </>
  )
}
