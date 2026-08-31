import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// [text, optA, optB, optC, optD, correct, subCode, topicKey, difficulty]
type RQ = [string,string,string,string,string,'A'|'B'|'C'|'D',string,string,'EASY'|'MEDIUM'|'HARD']

const p1: RQ[] = [
  // GK 1-20
  ["'Right to Education' is guaranteed under which Article?","Article 19","Article 21A","Article 29","Article 45","B","GK","polity","EASY"],
  ["Which planet has the most natural satellites (moons)?","Jupiter","Saturn","Uranus","Neptune","B","GK","india_gk","EASY"],
  ["Headquarters of Reserve Bank of India is located in?","New Delhi","Kolkata","Chennai","Mumbai","D","GK","india_gk","EASY"],
  ["Who was the founder of the Mughal Empire in India?","Humayun","Akbar","Babur","Sher Shah Suri","C","GK","india_gk","EASY"],
  ["'Bhagoria Festival' is celebrated by which tribe of MP?","Gond","Bhil","Baiga","Korku","B","GK","mp_culture","EASY"],
  ["'Repo Rate' is the rate at which?","Banks lend to the public","RBI lends to commercial banks","Commercial banks lend to each other","RBI borrows from banks","B","GK","india_gk","MEDIUM"],
  ["Tropic of Cancer passes through how many Indian states?","6","7","8","9","C","GK","india_gk","MEDIUM"],
  ["Which Article of Indian Constitution abolishes untouchability?","Article 14","Article 15","Article 17","Article 18","C","GK","polity","EASY"],
  ["Chanderi Fort in MP is associated with which historical period?","Maratha","Mughal","Bundela","British","C","GK","mp_history","MEDIUM"],
  ["Who won Gold in Javelin Throw at 2020 Tokyo Olympics?","Bajrang Punia","Sumit Antil","Neeraj Chopra","Ravi Dahiya","C","GK","current_affairs","EASY"],
  ["In which year did India adopt its current National Flag?","1946","1947","1950","1952","B","GK","india_gk","EASY"],
  ["'Operation Flood' was related to?","Wheat production","Milk production","Fish production","Oilseed production","B","GK","india_gk","EASY"],
  ["Which is the largest river basin in Madhya Pradesh?","Chambal Basin","Tapti Basin","Narmada Basin","Betwa Basin","C","GK","mp_geo","EASY"],
  ["'Bull Run' in stock market indicates?","Falling prices","Rising prices","Stable prices","Market crash","B","GK","india_gk","MEDIUM"],
  ["Which body conducts elections in India?","UPSC","Election Commission of India","Planning Commission","Finance Commission","B","GK","polity","EASY"],
  ["Sundarbans is famous habitat of which animal?","Snow Leopard","One-horned Rhinoceros","Royal Bengal Tiger","Asian Elephant","C","GK","india_gk","EASY"],
  ["'PM Fasal Bima Yojana' is primarily related to?","Crop insurance for farmers","Irrigation for farmlands","Subsidized seeds","Agricultural loans","A","GK","india_gk","EASY"],
  ["'Tansen Music Festival' is held in which MP city?","Bhopal","Indore","Gwalior","Ujjain","C","GK","mp_culture","EASY"],
  ["Who was the first woman President of India?","Sarojini Naidu","Indira Gandhi","Pratibha Patil","Vijay Lakshmi Pandit","C","GK","india_gk","EASY"],
  ["'Panchayati Raj System' was established through which amendment?","71st Amendment","73rd Amendment","74th Amendment","76th Amendment","B","GK","polity","EASY"],
  // English 21-35
  ["Meaning of 'To bite the bullet'?","To eat very fast","To endure a painful situation bravely","To make a risky decision","To shoot at someone","B","ENG","grammar","MEDIUM"],
  ["Fill in: She _____ to school every day.","go","goes","gone","going","B","ENG","grammar","EASY"],
  ["Passive voice: 'The manager signed the documents.'","The documents were signed by the manager.","The documents are signed by the manager.","The documents had been signed by the manager.","The documents was signed by the manager.","A","ENG","grammar","MEDIUM"],
  ["Correctly spelled word:","Accomodation","Accommodation","Accomadation","Acomodation","B","ENG","vocab","EASY"],
  ["Find error: 'Each of the students are expected to bring their notebook.'","Each of","are","expected","their notebook","B","ENG","grammar","MEDIUM"],
  ["Synonym of 'Arduous':","Easy","Strenuous","Calm","Gentle","B","ENG","vocab","MEDIUM"],
  ["Report speech: He said, 'I am feeling very tired today.'","He said that he is feeling very tired that day.","He said that he was feeling very tired that day.","He told that he was feeling very tired today.","He said that he had been feeling very tired today.","B","ENG","grammar","MEDIUM"],
  ["Antonym of 'Verbose':","Wordy","Loquacious","Concise","Elaborate","C","ENG","vocab","MEDIUM"],
  ["One who cannot be corrected is called?","Incorrigible","Invincible","Insolvent","Incredible","A","ENG","vocab","MEDIUM"],
  ["Fill preposition: The cat jumped _____ the wall.","in","on","over","from","C","ENG","grammar","EASY"],
  ["Part of speech of 'quickly' in: 'She quickly finished homework.'","Adjective","Verb","Adverb","Conjunction","C","ENG","grammar","EASY"],
  ["Passive: 'Who broke the window?'","By whom was the window broken?","The window was broken by whom?","Who was the window broken by?","By whom the window was broken?","A","ENG","grammar","MEDIUM"],
  ["Select correctly punctuated sentence about Ravi who is a friend:","Ravi who is my friend, lives in Bhopal.","Ravi, who is my friend lives in Bhopal.","Ravi, who is my friend, lives in Bhopal.","Ravi who is my friend lives in Bhopal.","C","ENG","grammar","MEDIUM"],
  ["Word closest in meaning to 'Magnanimous':","Stingy","Generous","Suspicious","Boastful","B","ENG","vocab","MEDIUM"],
  ["Figure of speech in 'Time is money':","Simile","Hyperbole","Metaphor","Personification","C","ENG","grammar","MEDIUM"],
  // Science 36-50
  ["Which vitamin is produced by human body in sunlight?","Vitamin A","Vitamin B12","Vitamin C","Vitamin D","D","SCI","bio","EASY"],
  ["Chemical formula of Sulfuric Acid?","HCl","H2SO4","HNO3","H3PO4","B","SCI","chem","EASY"],
  ["Which is a conductor of electricity?","Rubber","Plastic","Copper","Glass","C","SCI","physics","EASY"],
  ["Deficiency of which mineral causes Anemia?","Calcium","Iodine","Iron","Zinc","C","SCI","bio","EASY"],
  ["Newton's Second Law: force equals?","mass x velocity","mass x acceleration","mass / acceleration","weight x speed","B","SCI","physics","EASY"],
  ["Which plant part is responsible for Photosynthesis?","Root","Stem","Leaf","Flower","C","SCI","bio","EASY"],
  ["Unit of electric resistance?","Volt","Ampere","Ohm","Watt","C","SCI","physics","EASY"],
  ["Which gas is called 'Laughing Gas'?","Carbon dioxide","Nitrous oxide","Hydrogen","Nitrogen","B","SCI","chem","EASY"],
  ["Largest gland in human body?","Pancreas","Spleen","Liver","Kidney","C","SCI","bio","EASY"],
  ["Speed of light in vacuum?","3 x 10^6 m/s","3 x 10^8 m/s","3 x 10^10 m/s","3 x 10^4 m/s","B","SCI","physics","EASY"],
  ["Which mirror is used in rear-view mirrors of vehicles?","Plane mirror","Concave mirror","Convex mirror","Bifocal mirror","C","SCI","physics","EASY"],
  ["Chemical symbol 'Au' represents?","Silver","Gold","Aluminium","Argon","B","SCI","chem","EASY"],
  ["Malaria is caused by?","Bacteria","Virus","Protozoa","Fungus","C","SCI","bio","EASY"],
  ["Rainbow formation is due to?","Reflection","Refraction and Dispersion","Diffraction","Absorption","B","SCI","physics","EASY"],
  ["Conversion of water vapour to liquid water is called?","Evaporation","Sublimation","Condensation","Precipitation","C","SCI","physics","EASY"],
  // Maths 51-65
  ["Shopkeeper buys for Rs.800 sells for Rs.960. Profit %?","15%","18%","20%","25%","C","MATH","profit_loss","EASY"],
  ["Simple interest on Rs.5000 at 8% for 3 years?","Rs.1000","Rs.1200","Rs.1500","Rs.1800","B","MATH","si_ci","EASY"],
  ["40% of a number is 200. Find 60% of that number?","250","280","300","320","C","MATH","percent","EASY"],
  ["300m train crosses a pole in 15s. Speed in km/h?","60","72","80","90","B","MATH","speed","MEDIUM"],
  ["Ages A:B = 3:5, sum = 64 years. B's age?","24 years","36 years","40 years","48 years","C","MATH","ratio","MEDIUM"],
  ["Area of rectangle = 240 cm2, length = 20 cm. Breadth?","10 cm","12 cm","14 cm","16 cm","B","MATH","mensuration","EASY"],
  ["A finishes work in 12 days, B in 18 days. Together?","6.5 days","7 days","7.2 days","8 days","C","MATH","time_work","MEDIUM"],
  ["Compound interest on Rs.10000 at 10% for 2 years?","Rs.1000","Rs.1500","Rs.2000","Rs.2100","D","MATH","si_ci","MEDIUM"],
  ["LCM of 12, 18 and 24?","36","48","72","96","C","MATH","number","EASY"],
  ["Average of 5 numbers = 36. Remove one, average = 34. Removed number?","40","42","44","46","C","MATH","number","MEDIUM"],
  ["Money doubles at SI in 10 years. Rate per annum?","8%","9%","10%","12%","C","MATH","si_ci","MEDIUM"],
  ["60 students, 40% girls. How many boys?","24","30","36","40","C","MATH","percent","EASY"],
  ["Perimeter of square = 64 cm. Area?","196 cm2","225 cm2","256 cm2","289 cm2","C","MATH","mensuration","EASY"],
  ["CP of 10 apples = SP of 8 apples. Profit %?","20%","22%","25%","28%","C","MATH","profit_loss","MEDIUM"],
  ["Three numbers in ratio 2:3:4, sum = 108. Largest?","36","40","48","54","C","MATH","ratio","EASY"],
  // Hindi 66-80
  ["निम्न में 'तत्सम' शब्द कौन-सा है?","आग","पानी","अग्नि","नाक","C","HIN","vyakaran","EASY"],
  ["'प्रत्यक्ष' में कौन-सी संधि है?","दीर्घ संधि","यण् संधि","वृद्धि संधि","गुण संधि","B","HIN","sandhi","MEDIUM"],
  ["'मुँह में पानी आना' मुहावरे का अर्थ?","बीमार पड़ना","ललचाना / लालच होना","प्यास लगना","पानी पीना","B","HIN","muhavare","EASY"],
  ["शुद्ध वर्तनी वाला शब्द?","उपलक्ष","उपलक्ष्य","उपलक्षय","उपलक्षः","B","HIN","vyakaran","MEDIUM"],
  ["'राम ने सेब खाया' — 'ने' किस कारक का चिह्न है?","सम्प्रदान कारक","कर्ता कारक","कर्म कारक","करण कारक","B","HIN","vyakaran","EASY"],
  ["'जो पढ़ा-लिखा न हो' के लिए एक शब्द?","अज्ञानी","निरक्षर","मूर्ख","अशिक्षित","B","HIN","vyakaran","EASY"],
  ["'आकाश' का पर्यायवाची कौन-सा नहीं है?","नभ","गगन","अम्बर","धरा","D","HIN","vyakaran","EASY"],
  ["हिंदी वर्णमाला में कितने व्यंजन होते हैं?","33","35","36","41","A","HIN","vyakaran","EASY"],
  ["'सज्जन' का विलोम?","दुष्ट","कुजन","दुर्जन","नीच","C","HIN","vyakaran","EASY"],
  ["'विद्यार्थी' में कौन-सा समास है?","कर्मधारय","तत्पुरुष","द्विगु","बहुव्रीहि","B","HIN","sandhi","MEDIUM"],
  ["'वह लिखता है' — काल?","भूतकाल","भविष्यकाल","वर्तमानकाल","संदिग्ध भविष्यकाल","C","HIN","vyakaran","EASY"],
  ["'देशज' शब्द कौन-सा है?","स्कूल","कमरा","ठेठ","किताब","C","HIN","vyakaran","MEDIUM"],
  ["'मनुष्य' का स्त्रीलिंग?","मनुष्यी","मानवी","स्त्री","नारी","C","HIN","vyakaran","MEDIUM"],
  ["'जिसे भूलाया न जा सके' के लिए एक शब्द?","अविश्वसनीय","अविस्मरणीय","अनुभवी","अविनाशी","B","HIN","vyakaran","EASY"],
  ["'पुस्तक' में क्या जोड़ने पर 'पुस्तकों' बनता है?","एकवचन","बहुवचन","स्त्रीलिंग","संबंध कारक","B","HIN","vyakaran","EASY"],
  // Reasoning 81-90
  ["40 students, Ravi 15th from left. Position from right?","24","25","26","27","C","REASON","series","EASY"],
  ["Odd one out: 4, 9, 16, 25, 35, 49","4","25","35","49","C","REASON","series","EASY"],
  ["Next in series: 2, 6, 12, 20, 30, ?","40","42","44","48","B","REASON","series","MEDIUM"],
  ["If MANGO coded as OCPIQ, then APPLE coded as?","CRRNG","CRRNF","CRQNG","BSRNF","A","REASON","coding","MEDIUM"],
  ["Girl is daughter of only son of my grandfather. She is my?","Sister","Niece","Daughter","Cousin","A","REASON","blood","MEDIUM"],
  ["Next: 3, 7, 15, 31, 63, ?","95","112","127","135","C","REASON","series","MEDIUM"],
  ["Ravi walks 10 km North then 10 km East. Distance from start?","10 km","10√2 km","20 km","15 km","B","REASON","direction","MEDIUM"],
  ["Logical order: 1-Infant 2-Child 3-Adult 4-Adolescent 5-Old","1,2,3,4,5","1,2,4,3,5","1,4,2,3,5","2,1,4,3,5","B","REASON","logical","EASY"],
  ["If 5+3=28, 9+1=810, then 7+3=?","34","37","410","44","C","REASON","logical","HARD"],
  ["15 August 1947 was which day?","Thursday","Friday","Saturday","Sunday","B","REASON","calendar","MEDIUM"],
  // Computer 91-95
  ["Full form of CPU?","Central Processing Unit","Computer Programming Unit","Central Programmed Unit","Computer Processing Unit","A","COMP","basics","EASY"],
  ["Shortcut to Save document in MS Word?","Ctrl+P","Ctrl+X","Ctrl+S","Ctrl+Z","C","COMP","msoffice","EASY"],
  ["RAM stands for?","Random Access Memory","Read Access Memory","Rapid Access Memory","Remote Access Memory","A","COMP","basics","EASY"],
  ["Which is an input device?","Printer","Monitor","Scanner","Speaker","C","COMP","basics","EASY"],
  ["Extension of MS Excel file?",".doc",".ppt",".xlsx",".pdf","C","COMP","msoffice","EASY"],
  // Management 96-98
  ["First function of Management?","Organizing","Planning","Controlling","Directing","B","RURAL","mgmt","EASY"],
  ["MBO stands for?","Management By Objectives","Management By Organization","Methods By Objectives","Managing Business Operations","A","RURAL","mgmt","EASY"],
  ["'Span of Control' in management refers to?","Number of employees a manager can effectively supervise","Number of managers in organization","Total budget of department","Duration of a project","A","RURAL","mgmt","MEDIUM"],
  // Aptitude 99-100
  ["Marked 25% above CP, sold at 10% discount. Net profit %?","10% loss","12.5% profit","15% profit","10% profit","B","MATH","profit_loss","MEDIUM"],
  ["Pipe A fills tank in 4h, B in 6h. Both open together — time?","2.0 hours","2.2 hours","2.4 hours","2.5 hours","C","MATH","time_work","MEDIUM"],
]

const p2: RQ[] = [
  // GK 1-20
  ["Which Article provides 'Right to Freedom of Religion'?","Article 19","Article 21","Article 25","Article 30","C","GK","polity","EASY"],
  ["'Kanha National Park' in MP is famous for protecting?","Asiatic Lion","Bengal Tiger","One-horned Rhino","Snow Leopard","B","GK","mp_culture","EASY"],
  ["GDP stands for?","Gross Domestic Product","General Domestic Product","Gross Development Product","Government Domestic Policy","A","GK","india_gk","EASY"],
  ["Which battle established Mughal dominance over Delhi Sultanate in 1526?","Battle of Haldighati","Battle of Plassey","First Battle of Panipat","Battle of Talikota","C","GK","india_gk","EASY"],
  ["Who is known as the 'Iron Man of India'?","Jawaharlal Nehru","Mahatma Gandhi","Sardar Vallabhbhai Patel","Subhas Chandra Bose","C","GK","india_gk","EASY"],
  ["Which river is known as 'Lifeline of Madhya Pradesh'?","Chambal","Betwa","Narmada","Tapti","C","GK","mp_geo","EASY"],
  ["Directive Principles of State Policy are in which Part of Constitution?","Part II","Part III","Part IV","Part V","C","GK","polity","EASY"],
  ["'Blue Revolution' is associated with?","Milk Production","Fish Production","Wheat Production","Oilseed Production","B","GK","india_gk","EASY"],
  ["Khajuraho Temples in MP were built during which dynasty?","Gupta","Maurya","Chandela","Pala","C","GK","mp_history","EASY"],
  ["Currency of Japan is?","Won","Yuan","Yen","Dollar","C","GK","india_gk","EASY"],
  ["Which Indian state has the longest coastline?","Tamil Nadu","Gujarat","Andhra Pradesh","Maharashtra","B","GK","india_gk","EASY"],
  ["'Padma Shri' is awarded for outstanding contribution to?","Sports only","Politics only","Arts, Science, Public Service and more","Military services","C","GK","india_gk","EASY"],
  ["Which city is known as the 'Manchester of India'?","Mumbai","Surat","Ahmedabad","Ludhiana","C","GK","india_gk","EASY"],
  ["How many Schedules does the Indian Constitution currently have?","8","10","12","14","C","GK","polity","EASY"],
  ["'Mahakaleshwar Temple' is located in which MP city?","Bhopal","Indore","Ujjain","Jabalpur","C","GK","mp_culture","EASY"],
  ["First Five-Year Plan in India was launched in?","1947","1950","1951","1956","C","GK","india_gk","EASY"],
  ["'Mount K2' is located in which mountain range?","Himalayas","Karakoram","Hindu Kush","Vindhya","B","GK","india_gk","MEDIUM"],
  ["Indian National Congress was founded in which year?","1857","1877","1885","1905","C","GK","india_gk","EASY"],
  ["Which UN organ maintains international peace and security?","General Assembly","Security Council","International Court of Justice","Secretariat","B","GK","india_gk","EASY"],
  ["'Simhastha Kumbh Mela' is held at?","Bhopal","Chitrakoot","Ujjain","Omkareshwar","C","GK","mp_culture","EASY"],
  // English 21-35
  ["Meaning of 'To beat around the bush'?","To cut trees in a garden","To avoid speaking directly about a topic","To argue with someone violently","To defeat an opponent easily","B","ENG","grammar","MEDIUM"],
  ["Fill in: By 2030, scientists _____ a cure for the disease.","will discover","will have discovered","are discovering","discovered","B","ENG","grammar","MEDIUM"],
  ["Active voice: 'The poem was written by Kalidas.'","Kalidas wrote the poem.","Kalidas has written the poem.","Kalidas writes the poem.","Kalidas will write the poem.","A","ENG","grammar","MEDIUM"],
  ["Correctly spelled word:","Pronounciation","Pronunciation","Pronouncation","Prononciation","B","ENG","vocab","EASY"],
  ["Find error: 'Neither of the boys were present in the class.'","Neither of","were","present","in the class","B","ENG","grammar","MEDIUM"],
  ["Synonym of 'Obsolete':","Modern","Advanced","Outdated","Essential","C","ENG","vocab","MEDIUM"],
  ["Report speech: She said to him, 'Please help me with my luggage.'","She requested him to help her with her luggage.","She told him please help her with her luggage.","She said please to help him with his luggage.","She asked him to help with the luggage.","A","ENG","grammar","MEDIUM"],
  ["Antonym of 'Transparent':","Clear","Obvious","Opaque","Evident","C","ENG","vocab","EASY"],
  ["One unable to pay debts is called?","Miser","Insolvent","Philanthropist","Hermit","B","ENG","vocab","MEDIUM"],
  ["Fill preposition: She has been working here _____ 2018.","from","for","since","during","C","ENG","grammar","EASY"],
  ["Correct article: 'She wants to become _____ engineer.'","a","an","the","No article needed","B","ENG","grammar","EASY"],
  ["Correctly formed sentence?","He have been reading since morning.","He has been reading since morning.","He was reading since morning.","He is reading from morning.","B","ENG","grammar","EASY"],
  ["Synonym of 'Tenacious':","Weak","Persistent","Fragile","Indifferent","B","ENG","vocab","MEDIUM"],
  ["Figure of speech: 'The stars danced playfully in the moonlit sky.'","Simile","Metaphor","Personification","Hyperbole","C","ENG","grammar","MEDIUM"],
  ["Word closest to 'Frugal':","Wasteful","Generous","Economical","Careless","C","ENG","vocab","MEDIUM"],
  // Science 36-50
  ["Which vitamin is essential for blood clotting?","Vitamin A","Vitamin C","Vitamin K","Vitamin E","C","SCI","bio","EASY"],
  ["Chemical formula of Common Salt?","KCl","NaCl","MgCl2","CaCl2","B","SCI","chem","EASY"],
  ["Which gas is used in fire extinguishers?","Oxygen","Nitrogen","Carbon dioxide","Hydrogen","C","SCI","chem","EASY"],
  ["Night blindness is caused by deficiency of?","Vitamin B","Vitamin C","Vitamin D","Vitamin A","D","SCI","bio","EASY"],
  ["Who discovered the Law of Gravitation?","Albert Einstein","Isaac Newton","Galileo Galilei","Archimedes","B","SCI","physics","EASY"],
  ["Human Heart has how many chambers?","2","3","4","5","C","SCI","bio","EASY"],
  ["SI unit of work?","Newton","Joule","Watt","Pascal","B","SCI","physics","EASY"],
  ["Which element is most abundant in Earth's crust?","Iron","Silicon","Oxygen","Aluminium","C","SCI","chem","EASY"],
  ["Penicillin was discovered by?","Louis Pasteur","Edward Jenner","Alexander Fleming","Robert Koch","C","SCI","bio","EASY"],
  ["Process by which plants lose water through leaves?","Photosynthesis","Transpiration","Respiration","Pollination","B","SCI","bio","EASY"],
  ["Which lens corrects Myopia (short-sightedness)?","Convex","Concave","Bifocal","Plano-convex","B","SCI","physics","EASY"],
  ["Chemical formula of Water?","H2O2","HO","H2O","H3O","C","SCI","chem","EASY"],
  ["Typhoid fever is caused by?","Virus","Bacteria","Protozoa","Fungus","B","SCI","bio","EASY"],
  ["Which gas is responsible for the 'Greenhouse Effect'?","Oxygen","Nitrogen","Carbon dioxide","Argon","C","SCI","chem","EASY"],
  ["The process of gaining electrons is called?","Oxidation","Reduction","Combustion","Electrolysis","B","SCI","chem","MEDIUM"],
  // Maths 51-65
  ["Sold at Rs.660 gaining 10%. What was cost price?","Rs.580","Rs.600","Rs.620","Rs.640","B","MATH","profit_loss","EASY"],
  ["15% of number = 90. Find 25% of that number?","120","130","140","150","D","MATH","percent","EASY"],
  ["A goes 6 km North, B goes 8 km East from same point. Distance between them?","8 km","10 km","12 km","14 km","B","MATH","speed","MEDIUM"],
  ["Compound interest on Rs.4000 at 5% for 2 years?","Rs.400","Rs.405","Rs.410","Rs.420","C","MATH","si_ci","MEDIUM"],
  ["Still water speed 12 km/h, current 4 km/h. Upstream speed?","6 km/h","8 km/h","10 km/h","16 km/h","B","MATH","speed","EASY"],
  ["Sum of interior angles of a hexagon?","540°","640°","720°","800°","C","MATH","mensuration","EASY"],
  ["Value of sqrt(0.0625)?","0.025","0.25","2.5","25","B","MATH","number","EASY"],
  ["Tap fills tank in 8h, another empties in 12h. Both open — time to fill?","20 hours","22 hours","24 hours","26 hours","C","MATH","time_work","MEDIUM"],
  ["HCF of 36 and 54?","6","9","12","18","D","MATH","number","EASY"],
  ["Train at 72 km/h crosses 250m bridge in 25s. Length of train?","200 m","250 m","300 m","350 m","B","MATH","speed","MEDIUM"],
  ["Ratio of two numbers = 5:7, LCM = 140. Find HCF?","2","4","5","7","B","MATH","number","MEDIUM"],
  ["TV bought for Rs.15000, sold at 12% loss. Selling price?","Rs.12200","Rs.13000","Rs.13200","Rs.14000","C","MATH","profit_loss","EASY"],
  ["4 men complete work in 18 days. How many days for 6 men?","10 days","12 days","14 days","16 days","B","MATH","time_work","EASY"],
  ["Circumference of circle = 44 cm. Radius? (pi=22/7)","5 cm","6 cm","7 cm","8 cm","C","MATH","mensuration","EASY"],
  ["Average of 8 numbers = 18. Two are 14 and 26. Average of remaining 6?","16","17","18","20","B","MATH","number","MEDIUM"],
  // Hindi 66-80
  ["देवनागरी लिपि में हिंदी वर्णमाला में कितने स्वर होते हैं?","9","11","13","16","B","HIN","vyakaran","EASY"],
  ["'दो+अर्थी' में कौन-सी संधि है?","यण् संधि","दीर्घ संधि","अयादि संधि","वृद्धि संधि","B","HIN","sandhi","MEDIUM"],
  ["'नाक पर मक्खी न बैठने देना' मुहावरे का अर्थ?","बहुत बीमार होना","बहुत साफ-सुथरा रहना","अत्यधिक घमंडी होना","बहुत सतर्क रहना","C","HIN","muhavare","MEDIUM"],
  ["'विदेशज' (विदेशी मूल का) शब्द कौन-सा है?","पानी","घर","रेल","आग","C","HIN","vyakaran","MEDIUM"],
  ["'राजपुत्र' में कौन-सा समास है?","द्विगु","कर्मधारय","बहुव्रीहि","तत्पुरुष","D","HIN","sandhi","MEDIUM"],
  ["'जो इंद्रियों से परे हो' के लिए एक शब्द?","अलौकिक","अतिंद्रिय","असाधारण","अनश्वर","B","HIN","vyakaran","MEDIUM"],
  ["'रात' का पर्यायवाची नहीं है?","निशा","रजनी","यामिनी","तमसा","D","HIN","vyakaran","EASY"],
  ["'श्वेत' का विलोम शब्द?","काला","कृष्ण","श्याम","इनमें से कोई भी","B","HIN","vyakaran","EASY"],
  ["'वे खिलाड़ी जीत गए' — वचन?","एकवचन","बहुवचन","उभयवचन","कोई नहीं","B","HIN","vyakaran","EASY"],
  ["'महाविद्यालय' में कौन-सा उपसर्ग है?","वि","मह","महा","महाविद्या","C","HIN","vyakaran","MEDIUM"],
  ["'हमें पुस्तक पढ़नी चाहिए' — किस प्रकार की क्रिया?","सकर्मक क्रिया","अकर्मक क्रिया","द्विकर्मक क्रिया","प्रेरणार्थक क्रिया","A","HIN","vyakaran","MEDIUM"],
  ["'चाँद' का तत्सम रूप 'चन्द्र' — तत्सम का अर्थ?","संस्कृत से लिया गया","बिगड़ा हुआ संस्कृत","विदेशी मूल","नया हिंदी शब्द","A","HIN","vyakaran","EASY"],
  ["'गंगाजल' में कौन-सा समास है?","तत्पुरुष","द्विगु","अव्ययीभाव","कर्मधारय","A","HIN","sandhi","MEDIUM"],
  ["शुद्ध वाक्य कौन-सा है?","मैंने दूध पीया।","मैंने दूध पिया।","मुझे दूध पीना है।","B और C दोनों शुद्ध हैं।","D","HIN","vyakaran","MEDIUM"],
  ["'परोपकार' शब्द में कौन-सी संधि है?","दीर्घ संधि","यण् संधि","गुण संधि","वृद्धि संधि","C","HIN","sandhi","MEDIUM"],
  // Reasoning 81-90
  ["30 students, Seema 8th from left, Ritu 6th from right. Students between them?","14","15","16","17","C","REASON","series","MEDIUM"],
  ["Odd one out: 17, 19, 23, 27, 29, 31","17","23","27","29","C","REASON","series","MEDIUM"],
  ["Next: 1, 4, 9, 16, 25, ?","30","35","36","49","C","REASON","series","EASY"],
  ["If TIGER coded as VJIGT, ZEBRA coded as?","BFECT","BGECT","BGEBT","BGECU","A","REASON","coding","MEDIUM"],
  ["A is mother of B. B is sister of C. C is son of D. A is related to D as?","Sister","Mother-in-law","Wife","Daughter","C","REASON","blood","HARD"],
  ["Next: 6, 11, 21, 41, 81, ?","141","151","161","171","C","REASON","series","MEDIUM"],
  ["If SUNDAY coded as YADNUS, MONDAY coded as?","YADNOM","YANDMO","YAANDM","YANDMO","A","REASON","coding","MEDIUM"],
  ["Suresh walks 5 km North then 12 km East. Distance from start?","10 km","12 km","13 km","17 km","C","REASON","direction","EASY"],
  ["Mirror image of 'MASTER'?","RETSAM","MASTER reversed","RETMAS","MAESTR","A","REASON","logical","MEDIUM"],
  ["If 12x9=987, 15x6=654, then 18x3=?","321","312","213","231","A","REASON","logical","HARD"],
  // Computer 91-95
  ["Full form of URL?","Uniform Resource Locator","Universal Resource Linker","Uniform Routing Language","Universal Reference Link","A","COMP","internet","EASY"],
  ["In MS Word, shortcut for line break within same paragraph?","Ctrl+Enter","Shift+Enter","Alt+Enter","Tab+Enter","B","COMP","msoffice","EASY"],
  ["'Phishing' refers to?","A programming technique","An online fraud to steal personal information","A type of antivirus","A data storage method","B","COMP","internet","EASY"],
  ["Which is an Operating System?","MS Word","Google Chrome","Ubuntu","Photoshop","C","COMP","os","EASY"],
  ["1 GB = how many MB?","100 MB","512 MB","1000 MB","1024 MB","D","COMP","basics","EASY"],
  // Management 96-98
  ["'Motivation' in management best means?","Assigning tasks to employees","Driving employees to achieve goals willingly","Monitoring employee performance","Allocating budget","B","RURAL","mgmt","EASY"],
  ["'Henri Fayol' is associated with?","Scientific Management","14 Principles of Management","Motivation Theory","Theory X and Y","B","RURAL","mgmt","MEDIUM"],
  ["'Unity of Command' principle means?","Only one person in the organization","Employee receives orders from only one superior","All decisions must be centralized","One task per employee at a time","B","RURAL","mgmt","EASY"],
  // Aptitude 99-100
  ["Partners invest in ratio 2:3:5, profit = Rs.60000. Largest partner's share?","Rs.24000","Rs.28000","Rs.30000","Rs.32000","C","MATH","ratio","MEDIUM"],
  ["Goods marked 40% above CP, 20% discount given. Net profit %?","10% profit","12% profit","10% loss","8% profit","B","MATH","profit_loss","MEDIUM"],
]

const p3: RQ[] = [
  // GK 1-20
  ["Which Article allows President to proclaim a National Emergency?","Article 352","Article 356","Article 360","Article 370","A","GK","polity","MEDIUM"],
  ["Which dam is built on Narmada River in MP?","Bhakra Nangal Dam","Hirakud Dam","Indira Sagar Dam","Nagarjuna Sagar Dam","C","GK","mp_geo","EASY"],
  ["Which country is the largest producer of tea in the world?","India","Sri Lanka","Kenya","China","D","GK","india_gk","EASY"],
  ["Who was the last Viceroy of British India?","Lord Canning","Lord Mountbatten","Lord Wavell","Lord Curzon","B","GK","india_gk","EASY"],
  ["'Panna Tiger Reserve' is in which district of MP?","Bhopal","Gwalior","Panna","Rewa","C","GK","mp_geo","EASY"],
  ["Which among the following is a Direct Tax?","GST","Customs Duty","Excise Duty","Income Tax","D","GK","india_gk","EASY"],
  ["Fundamental Duties of Indian Citizens are in which Article?","Article 48A","Article 51A","Article 52","Article 44","B","GK","polity","EASY"],
  ["'Sardar Sarovar Dam' is built on which river?","Ganga","Godavari","Narmada","Mahanadi","C","GK","india_gk","EASY"],
  ["'Gwalior Fort' was built by which ruler?","Akbar","Raja Man Singh Tomar","Scindia","Aurangzeb","B","GK","mp_history","MEDIUM"],
  ["2024 Paris Olympics were held in which country?","USA","Japan","France","UK","C","GK","current_affairs","EASY"],
  ["Who wrote the Indian National Anthem 'Jana Gana Mana'?","Bankim Chandra Chattopadhyay","Subramanya Bharati","Rabindranath Tagore","Sarojini Naidu","C","GK","india_gk","EASY"],
  ["'Deen Dayal Antyodaya Yojana' is associated with?","Rural livelihood and urban poverty alleviation","Farm loan waiver","Free electricity to BPL families","Housing for all","A","GK","india_gk","EASY"],
  ["'Vindhyachal Mountain Range' separates which two regions?","North and South India","East and West India","Deccan Plateau and North India","Indo-Gangetic Plain and Rajasthan","C","GK","india_gk","MEDIUM"],
  ["Comptroller and Auditor General (CAG) is mentioned in which Article?","Article 124","Article 148","Article 165","Article 171","B","GK","polity","MEDIUM"],
  ["Highest civilian honour in India?","Padma Vibhushan","Padma Shri","Bharat Ratna","Padma Bhushan","C","GK","india_gk","EASY"],
  ["Madhya Pradesh was established as a state on?","15 August 1947","26 January 1950","1 November 1956","1 November 2000","C","GK","mp_history","EASY"],
  ["'Davis Cup' is associated with which sport?","Cricket","Tennis","Badminton","Football","B","GK","current_affairs","EASY"],
  ["Who was the first Prime Minister of India?","Sardar Vallabhbhai Patel","Rajendra Prasad","Jawaharlal Nehru","Lal Bahadur Shastri","C","GK","india_gk","EASY"],
  ["WTO was established in?","1947","1991","1995","2000","C","GK","india_gk","EASY"],
  ["Which crop is known as the 'Golden Fibre'?","Cotton","Jute","Silk","Hemp","B","GK","india_gk","EASY"],
  // English 21-35
  ["Meaning of 'To add fuel to the fire'?","To resolve a conflict peacefully","To worsen an already bad situation","To start a new problem","To help someone in need","B","ENG","grammar","MEDIUM"],
  ["Fill in: The committee _____ decided to postpone the meeting.","have","has","are","were","B","ENG","grammar","EASY"],
  ["Active: 'Letters are delivered by the postman every morning.'","The postman delivers letters every morning.","The postman delivered letters every morning.","The postman is delivering letters every morning.","Letters were delivered by the postman every morning.","A","ENG","grammar","MEDIUM"],
  ["Correctly spelled word:","Grammer","Grammar","Gramar","Gramer","B","ENG","vocab","EASY"],
  ["Find error: 'The news are very shocking.'","The news","are","very","shocking","B","ENG","grammar","MEDIUM"],
  ["Synonym of 'Benevolent':","Harsh","Generous","Selfish","Rigid","B","ENG","vocab","EASY"],
  ["Report speech: 'Don't make noise,' the teacher said to the students.","The teacher told the students to don't make noise.","The teacher asked the students not to make noise.","The teacher said the students should not make noise.","The teacher told not to make noise.","B","ENG","grammar","MEDIUM"],
  ["Antonym of 'Ancient':","Old","Historical","Modern","Classic","C","ENG","vocab","EASY"],
  ["One who lives alone avoiding company of others?","Nomad","Recluse","Vagrant","Hermaphrodite","B","ENG","vocab","MEDIUM"],
  ["Fill in correct tense: By the time he arrived, she _____ the letter.","wrote","has written","had written","was writing","C","ENG","grammar","MEDIUM"],
  ["Correct plural form of 'Criterion':","Criterions","Criteria","Criterias","Criteriums","B","ENG","vocab","MEDIUM"],
  ["Part of speech: 'He ran fast to catch the bus.'","Adjective","Noun","Preposition","Adverb","D","ENG","grammar","EASY"],
  ["Opposite of 'Indolent':","Lazy","Careless","Diligent","Passive","C","ENG","vocab","MEDIUM"],
  ["Correct form: 'If I _____ you, I would apologize.'","am","was","were","had been","C","ENG","grammar","MEDIUM"],
  ["Figure of speech: 'He is as brave as a lion.'","Metaphor","Simile","Personification","Oxymoron","B","ENG","grammar","EASY"],
  // Science 36-50
  ["Device used to measure atmospheric pressure?","Thermometer","Barometer","Hygrometer","Anemometer","B","SCI","physics","EASY"],
  ["Atomic number of Carbon?","4","6","8","12","B","SCI","chem","EASY"],
  ["Which radiation has highest penetrating power?","Alpha radiation","Beta radiation","Gamma radiation","X-rays","C","SCI","physics","MEDIUM"],
  ["Deficiency of which vitamin causes 'Scurvy'?","Vitamin A","Vitamin B","Vitamin C","Vitamin D","C","SCI","bio","EASY"],
  ["'Archimedes Principle' is related to?","Motion of planets","Buoyancy of objects in fluid","Refraction of light","Electric current","B","SCI","physics","EASY"],
  ["Function of White Blood Cells (WBCs)?","Carry oxygen","Help in clotting of blood","Fight infections","Produce hormones","C","SCI","bio","EASY"],
  ["Which is a Renewable Source of Energy?","Coal","Natural Gas","Petroleum","Solar Energy","D","SCI","physics","EASY"],
  ["Nuclear fission releases?","Chemical energy","Electrical energy","Nuclear energy","Mechanical energy","C","SCI","physics","MEDIUM"],
  ["Unit of measurement of 'Sound Intensity'?","Hertz","Decibel","Newton","Tesla","B","SCI","physics","EASY"],
  ["Which gas forms majority of Earth's atmosphere?","Oxygen","Carbon dioxide","Argon","Nitrogen","D","SCI","chem","EASY"],
  ["Study of Fungi is called?","Mycology","Virology","Botany","Entomology","A","SCI","bio","EASY"],
  ["Rusting of Iron is a?","Physical change","Chemical change","Nuclear change","Biological change","B","SCI","chem","EASY"],
  ["Hardest natural substance?","Iron","Graphite","Diamond","Gold","C","SCI","chem","EASY"],
  ["Insulin is secreted by which gland?","Thyroid","Pancreas","Adrenal","Pituitary","B","SCI","bio","EASY"],
  ["SI unit of temperature?","Celsius","Fahrenheit","Kelvin","Rankine","C","SCI","physics","EASY"],
  // Maths 51-65
  ["Milk:Water = 5:2. Mixture has 35L milk. How much water?","10 litres","12 litres","14 litres","16 litres","C","MATH","ratio","EASY"],
  ["Man earns Rs.24000/month, spends 60%. Savings?","Rs.8000","Rs.9600","Rs.10000","Rs.12000","B","MATH","percent","EASY"],
  ["SI on Rs.8000 at 6% for 2.5 years?","Rs.1000","Rs.1200","Rs.1500","Rs.1800","B","MATH","si_ci","EASY"],
  ["Number increased 30% then decreased 30%. Net change?","No change","9% decrease","6% decrease","9% increase","B","MATH","percent","MEDIUM"],
  ["Boys:Girls = 7:5, total 600 students. How many girls?","200","220","240","250","D","MATH","ratio","EASY"],
  ["Area of triangle: base 14 cm, height 10 cm?","60 cm2","65 cm2","70 cm2","75 cm2","C","MATH","mensuration","EASY"],
  ["Value of 0.3 x 0.3 + 0.4 x 0.4?","0.05","0.25","0.35","0.49","B","MATH","number","EASY"],
  ["P finishes work in 20 days, Q in 30 days. Together 6 days, Q leaves. P finishes remaining in?","7 days","8 days","9 days","10 days","B","MATH","time_work","HARD"],
  ["LCM = 180, HCF = 12, one number = 36. Other number?","48","54","60","72","C","MATH","number","MEDIUM"],
  ["Merchant sells at 20% profit. CP = Rs.1500. SP?","Rs.1700","Rs.1750","Rs.1800","Rs.1850","C","MATH","profit_loss","EASY"],
  ["Volume of cube with side 5 cm?","100 cm3","115 cm3","125 cm3","150 cm3","C","MATH","mensuration","EASY"],
  ["Two numbers ratio 3:4, sum = 84. Smaller number?","28","32","36","42","C","MATH","ratio","EASY"],
  ["Pipe fills tank in 6h. With leak takes 8h. Leak empties full tank in?","20 hours","22 hours","24 hours","26 hours","C","MATH","time_work","MEDIUM"],
  ["Circle diameter = 14 cm. Area? (pi=22/7)","144 cm2","154 cm2","176 cm2","196 cm2","B","MATH","mensuration","EASY"],
  ["Average of first 10 multiples of 5?","25","27.5","30","32.5","B","MATH","number","MEDIUM"],
  // Hindi 66-80
  ["'सूर्य' का तत्सम शब्द?","सूरज","सूर्य","रवि","दिनकर","B","HIN","vyakaran","EASY"],
  ["'देश+अटन' = 'देशाटन' — इसमें कौन-सी संधि है?","यण् संधि","दीर्घ संधि","वृद्धि संधि","गुण संधि","B","HIN","sandhi","MEDIUM"],
  ["'खून पसीना एक करना' मुहावरे का सही अर्थ?","चोट लगना","बहुत परिश्रम करना","घायल होना","रोना-धोना करना","B","HIN","muhavare","EASY"],
  ["'नेत्र' का तद्भव रूप?","आँख","नयन","लोचन","अक्षि","A","HIN","vyakaran","EASY"],
  ["'पीताम्बर' में कौन-सा समास है?","तत्पुरुष","द्विगु","बहुव्रीहि","कर्मधारय","C","HIN","sandhi","MEDIUM"],
  ["'जिसे जाना न जा सके' के लिए एक शब्द?","अज्ञात","अगम्य","अनुभवहीन","अज्ञानी","B","HIN","vyakaran","MEDIUM"],
  ["'समुद्र' का पर्यायवाची नहीं है?","सागर","रत्नाकर","जलधि","नदी","D","HIN","vyakaran","EASY"],
  ["'जीत' का विलोम?","पराजय","हार","A और B दोनों","इनमें से कोई नहीं","C","HIN","vyakaran","EASY"],
  ["'वह बाज़ार गया' — 'बाज़ार' किस कारक में है?","कर्ता कारक","कर्म कारक","अधिकरण कारक","क्रियाविशेषण","D","HIN","vyakaran","MEDIUM"],
  ["'प्रति' उपसर्ग से बना शब्द?","प्रतीक्षा","प्रताप","प्रेम","प्रतिध्वनि","D","HIN","vyakaran","EASY"],
  ["'चिड़ियाघर' में कौन-सा समास है?","तत्पुरुष","बहुव्रीहि","द्विगु","कर्मधारय","A","HIN","sandhi","MEDIUM"],
  ["'वह काम करता है' — किस काल का उदाहरण?","भूतकाल","भविष्यकाल","सामान्य वर्तमान काल","अपूर्ण भूतकाल","C","HIN","vyakaran","EASY"],
  ["निम्न में पुल्लिंग शब्द?","सुंदरता","लड़की","राजा","कुर्सी","C","HIN","vyakaran","EASY"],
  ["'अनुचित' का विलोम?","उचित","सही","A और B दोनों","उपयुक्त","C","HIN","vyakaran","EASY"],
  ["'सप्त+ऋषि = सप्तर्षि' — कौन-सी संधि?","दीर्घ संधि","गुण संधि","यण् संधि","वृद्धि संधि","B","HIN","sandhi","MEDIUM"],
  // Reasoning 81-90
  ["Anita 10th from top, 23rd from bottom. Total students?","30","31","32","33","C","REASON","series","EASY"],
  ["Odd one out: Table, Chair, Desk, Bench, Carpet","Table","Chair","Carpet","Bench","C","REASON","logical","EASY"],
  ["Next: 5, 10, 20, 40, 80, ?","120","140","160","180","C","REASON","series","EASY"],
  ["If WATER coded as YCVGT, EARTH coded as?","GCTVJ","GCVTJ","GCTJV","GCJVT","A","REASON","coding","MEDIUM"],
  ["A is B's father. C is A's sister. D is C's mother. D is related to B as?","Grandmother","Aunt","Mother","Great-grandmother","A","REASON","blood","MEDIUM"],
  ["If North-East becomes North, South-West becomes?","South","West","North-West","South-East","A","REASON","direction","HARD"],
  ["Next: 4, 8, 24, 96, ?","192","288","384","480","D","REASON","series","MEDIUM"],
  ["Arun walked 20m East, turned left 15m, turned left 20m. Distance from start?","10 m","15 m","20 m","0 m","B","REASON","direction","MEDIUM"],
  ["All teachers are students. Some students are intelligent. Conclusion: I-Some teachers are intelligent. II-All students are teachers.","Only I follows","Only II follows","Both follow","Neither follows","D","REASON","logical","HARD"],
  ["3rd March 2020 was Tuesday. 3rd March 2021 was?","Wednesday","Thursday","Friday","Saturday","B","REASON","calendar","MEDIUM"],
  // Computer 91-95
  ["Shortcut to 'Open' a file in Windows?","Ctrl+N","Ctrl+O","Ctrl+P","Ctrl+F","B","COMP","basics","EASY"],
  ["'Firewall' in computer networks is used to?","Speed up the internet","Prevent unauthorized access","Increase RAM","Store data","B","COMP","internet","EASY"],
  ["Which of the following is NOT a web browser?","Mozilla Firefox","Google Chrome","Microsoft Excel","Safari","C","COMP","internet","EASY"],
  ["'BIOS' stands for?","Basic Input Output System","Binary Input Output Software","Basic Internal Operating System","Byte Input Output System","A","COMP","os","EASY"],
  ["Which computer generation used Integrated Circuits (ICs)?","First Generation","Second Generation","Third Generation","Fourth Generation","C","COMP","basics","MEDIUM"],
  // Management 96-98
  ["'Division of Labour' in management means?","Giving equal work to all","Dividing workers into groups","Specialization of work for efficiency","Reducing number of employees","C","RURAL","mgmt","EASY"],
  ["'Frederick Winslow Taylor' is known as father of?","Modern Management","Scientific Management","Human Relations Theory","Classical Management","B","RURAL","mgmt","EASY"],
  ["Which is NOT one of the '4 P's of Marketing'?","Product","Price","Profit","Promotion","C","RURAL","mgmt","EASY"],
  // Aptitude 99-100
  ["Dishonest dealer claims CP price but uses 900g instead of 1kg. Profit %?","9%","10%","11.11%","12.5%","C","MATH","profit_loss","MEDIUM"],
  ["Winner got 60% votes, won by 800 votes. Total votes?","3200","4000","4800","5000","B","MATH","number","MEDIUM"],
]

async function main() {
  console.log('📚 Adding 3 MPESB Mock Papers to database...')

  // Fetch existing subjects
  const { data: existingSubs } = await supabase.from('subjects').select('*')
  const S: Record<string, any> = {}
  existingSubs!.forEach(s => { S[s.code] = s })

  // Add Science subject if not exists
  let sci = S['SCI']
  if (!sci) {
    const { data } = await supabase.from('subjects').insert({
      name: 'General Science', name_hi: 'सामान्य विज्ञान', code: 'SCI',
      sort_order: 8, color: '#f97316'
    }).select().single()
    sci = data
    console.log('✓ Added Science subject')
  }

  // Fetch existing topics
  const { data: existingTopics } = await supabase.from('topics').select('*')
  const T: Record<string, any> = {}
  existingTopics!.forEach(t => { T[t.name_hi] = t })

  // Add new topics if not present
  const newTopics = [
    { name: 'Physics', name_hi: 'भौतिकी', subject_id: sci.id },
    { name: 'Chemistry', name_hi: 'रसायन विज्ञान', subject_id: sci.id },
    { name: 'Biology', name_hi: 'जीव विज्ञान', subject_id: sci.id },
    { name: 'Management', name_hi: 'प्रबंधन', subject_id: S['RURAL']?.id },
  ]
  for (const t of newTopics) {
    if (t.subject_id && !T[t.name_hi]) {
      const { data } = await supabase.from('topics').insert(t).select().single()
      T[t.name_hi] = data
    }
  }

  console.log('✓ Topics ready')

  // Topic key → topic name_hi
  const topicMap: Record<string, string> = {
    polity: 'भारतीय राजव्यवस्था',
    india_gk: 'भारतीय सामान्य ज्ञान',
    mp_culture: 'मध्यप्रदेश संस्कृति एवं कला',
    mp_history: 'मध्यप्रदेश का इतिहास',
    mp_geo: 'मध्यप्रदेश भूगोल',
    mp_economy: 'मध्यप्रदेश अर्थव्यवस्था',
    mp_schemes: 'मध्यप्रदेश शासन योजनाएं',
    current_affairs: 'करंट अफेयर्स',
    grammar: 'Grammar',
    vocab: 'Vocabulary',
    bio: 'जीव विज्ञान',
    chem: 'रसायन विज्ञान',
    physics: 'भौतिकी',
    profit_loss: 'प्रतिशत, लाभ-हानि',
    si_ci: 'साधारण एवं चक्रवृद्धि ब्याज',
    speed: 'समय, गति, दूरी',
    mensuration: 'क्षेत्रमिति',
    number: 'संख्या प्रणाली',
    ratio: 'अनुपात-समानुपात',
    percent: 'प्रतिशत, लाभ-हानि',
    average: 'संख्या प्रणाली',
    time_work: 'समय, गति, दूरी',
    algebra: 'बीजगणित',
    sandhi: 'संधि-समास',
    vyakaran: 'हिन्दी व्याकरण',
    muhavare: 'मुहावरे एवं लोकोक्तियाँ',
    ras: 'रस-छंद-अलंकार',
    sahitya: 'हिंदी साहित्य',
    series: 'श्रृंखला एवं सादृश्यता',
    coding: 'कोडिंग-डिकोडिंग',
    blood: 'रक्त संबंध',
    direction: 'दिशा ज्ञान',
    logical: 'तार्किक अनुमान',
    calendar: 'तार्किक अनुमान',
    basics: 'कंप्यूटर की मूल बातें',
    msoffice: 'MS Office',
    internet: 'इंटरनेट एवं नेटवर्किंग',
    os: 'ऑपरेटिंग सिस्टम',
    mgmt: 'प्रबंधन',
    panchayat: 'पंचायती राज व्यवस्था',
  }

  // Build questions for DB insertion
  const opts: Record<string,'A'|'B'|'C'|'D'> = {} // just for type
  const buildQs = (rqs: RQ[]) => rqs.map(([text, a, b, c, d, ans, sub, tkey, diff]) => {
    const optMap: Record<string, string> = { A: a, B: b, C: c, D: d }
    return {
      text_hi: text,
      option_a: a, option_b: b, option_c: c, option_d: d,
      correct: ans,
      explanation: optMap[ans],
      subject_id: sub === 'SCI' ? sci.id : S[sub]?.id,
      topic_id: T[topicMap[tkey]]?.id ?? null,
      difficulty: diff,
      source: 'MPESB PYQ Mock 2026',
    }
  })

  // Insert in batches of 25 to avoid request size limits
  const insertBatch = async (rows: any[]) => {
    const results: any[] = []
    for (let i = 0; i < rows.length; i += 25) {
      const { data, error } = await supabase.from('questions').insert(rows.slice(i, i + 25)).select()
      if (error) { console.error('Insert error batch', i, ':', error.message); continue }
      results.push(...(data ?? []))
    }
    return results
  }

  const q1 = await insertBatch(buildQs(p1))
  console.log(`✓ Paper 1: ${q1.length} questions inserted`)

  const q2 = await insertBatch(buildQs(p2))
  console.log(`✓ Paper 2: ${q2.length} questions inserted`)

  const q3 = await insertBatch(buildQs(p3))
  console.log(`✓ Paper 3: ${q3.length} questions inserted`)

  // Create 3 mock tests and link questions
  const papers = [
    { qs: q1, n: 1 }, { qs: q2, n: 2 }, { qs: q3, n: 3 }
  ]

  for (const { qs, n } of papers) {
    const { data: test } = await supabase.from('mock_tests').insert({
      title: `MPESB Patwari PYQ Mock Paper ${n}`,
      title_hi: `MP Patwari PYQ मॉक पेपर ${n}`,
      description: `PYQ पैटर्न पर आधारित 100 प्रश्नों का पूर्ण मॉक टेस्ट। सभी 9 विषय सम्मिलित।`,
      type: 'FULL',
      total_questions: 100,
      total_marks: 100,
      duration: 120,
      negative_marks: 0.25,
      is_published: true,
      sort_order: n + 20,
    }).select().single()

    const tqs = (qs ?? []).map((q: any, i: number) => ({
      test_id: test!.id, question_id: q.id, sort_order: i + 1
    }))
    await supabase.from('test_questions').insert(tqs)
    console.log(`✓ Mock Test ${n} created and published`)
  }

  // Restore original Full Mock Test 1 (uses existing 65 seed questions)
  const { data: allOrigQs } = await supabase.from('questions')
    .select('id').eq('source', 'MPESB Previous Pattern').limit(65)
  if (allOrigQs && allOrigQs.length > 0) {
    const { data: fullTest } = await supabase.from('mock_tests').insert({
      title: 'MP Patwari Full Mock Test 1',
      title_hi: 'MP Patwari 2026 — फुल मॉक टेस्ट 1',
      description: 'MPESB पैटर्न पर आधारित पूर्ण मॉक टेस्ट। 100 प्रश्न, 100 अंक, 120 मिनट।',
      type: 'FULL', total_questions: allOrigQs.length, total_marks: allOrigQs.length,
      duration: 120, negative_marks: 0, is_published: true, sort_order: 1,
    }).select().single()
    const tqs = allOrigQs.map((q: any, i: number) => ({ test_id: fullTest!.id, question_id: q.id, sort_order: i + 1 }))
    await supabase.from('test_questions').insert(tqs)
    console.log(`✓ Restored Full Mock Test 1 with ${allOrigQs.length} questions`)
  }

  console.log('\n🎉 All 3 mock papers added successfully!')
  console.log('Visit https://test-papers-mp.vercel.app/tests to see them.')
}

main().catch(console.error)
