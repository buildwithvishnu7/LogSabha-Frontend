// AUTO-GENERATED from reference/blog-posts.js — do not hand-edit.
// Regenerate with scratchpad/extract-blog.js if the reference changes.
//
// Posts are bilingual: every entry carries a Hindi (hi) and English (en)
// headline. Only some carry a full article body, and in this reference the
// long-form pieces are published in Hindi — the reader-facing language toggle
// falls back per field rather than per post.

export type BlogKind = "editorial" | "news" | "blog";

export type BlogPost = {
  slug: string;
  kind: BlogKind;
  hi: string;
  en: string;
  noteHi?: string;
  noteEn?: string;
  date?: string;
  time?: string;
  author?: string;
  img?: string;
  /** intrinsic pixels — used to cap display width and reserve the box */
  imgW?: number;
  imgH?: number;
  alt?: string;
  cap?: string;
  capHi?: string;
  kicker?: string;
  kickerHi?: string;
  topic?: string;
  topicHi?: string;
  bodyHi?: string[];
  bodyEn?: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "bhandasar-jain-temple",
    kind: "editorial",
    hi: "जब रेगिस्तान में पड़ा सूखा, तो पानी की जगह 40 हज़ार किलो ‘घी’ डाल कर रख दी मंदिर की नींव, भारत की वास्तुकला और धर्म के लिए समर्पण का जीता-जागता चमत्कार बीकानेर का ‘भंडासर जैन मंदिर’",
    en: "When drought struck the desert, the temple’s foundation was laid with 40,000 kilos of ghee instead of water — Bikaner’s ‘Bhandasar Jain Temple’, a living miracle of Indian architecture and devotion",
    noteHi: "बीकानेर का भंडासर जैन मंदिर — जिसकी नींव में पानी की एक बूंद नहीं, 40 हज़ार किलो शुद्ध देसी घी है, और जो 500 साल बाद आज भी गर्मियों में दीवारों से रिसता है।",
    noteEn: "The full report is published in Hindi. Bikaner’s Bhandasar Jain Temple was founded not on water but on 40,000 kilos of pure ghee — which still seeps from its walls five centuries later.",
    date: "August 5, 2026",
    time: "4:10 pm",
    author: "Logsabha Team",
    img: "/images/blog/bhandasar-temple.png",
    imgW: 1280,
    imgH: 681,
    alt: "Bhandasar Jain Temple, Bikaner — temple shikhara and the pouring of ghee",
    cap: "Bhandasar Jain Temple, Bikaner — temple shikhara and the pouring of ghee",
    capHi: "भंडासर जैन मंदिर, बीकानेर — मंदिर शिखर और घी की धार",
    kicker: "Bhandasar Temple",
    kickerHi: "भंडासर मंदिर",
    topic: "HERITAGE",
    topicHi: "धरोहर",
    bodyHi: ["आज मैं आपको भारत भूमि के एक ऐसे अजूबे के बारे में बताने जा रहा हूँ, जिसकी कहानी सुनकर आप हैरान रह जायेंगे और अपनी संस्कृति पर आपको सौ गुना ज्यादा गर्व होने लगेगा!", "[object Object]", "दोस्तों ये कोई मामूली ईंट-पत्थर का मंदिर नहीं है। जब पूरी दुनिया मिट्टी और पानी से इमारतें खड़ी कर रही थी, तब हमारे पूर्वजों ने इस भव्य तीन मंजिला मंदिर की नींव में पानी की एक बूंद तक नहीं डाली!", "[object Object]", "सोच कर ही दिमाग सुन्न हो जाता है ना? चलिए आज इस इतिहास के पन्नों को पलटते हैं और जानते हैं की आखिर वो क्या वजह थी जिसने रेगिस्तान के बीचों-बीच घी की नदियां बहा दीं।", "[object Object]", "अक्सर हम लोग इटली के ‘पीसा की झुकी मीनार’ (Leaning Tower of Pisa) को देखकर बड़ा दांतों तले उंगली दबाते हैं।", "सच कहूं तो वो इंजीनियरिंग का फेलियर है, जो अपनी ही नींव पर सीधी खड़ी नहीं रह पाई! अगर असली और अचूक इंजीनियरिंग देखनी है, तो बीकानेर के इस भंडासर जैन मंदिर को आकर देखो।", "मुगलों के बनाए मकबरों पर तो वामपंथी इतिहासकार सैकड़ों किताबें लिख मारते हैं, लेकिन इस मंदिर के चमत्कार को उन्होंने हमेशा दबा कर रखा।", "कल्पना कीजिए उस दौर की, जब ना तो आज की तरह बड़ी-बड़ी क्रेनें थीं, ना सीमेंट था और ना ही 3D मैपिंग वाली कोई टेक्नोलॉजी।", "उस दौर में लाल बलुआ पत्थर (Red Sandstone) और संगमरमर को तराश कर इतनी गगनचुंबी और मजबूत इमारत खड़ी कर देना अपने आप में एक चमत्कार है।", "लेकिन इस चमत्कार की सबसे बड़ी खूबी इसका ढांचा नहीं, बल्कि इसके ज़मीन के नीचे दबी वो नींव है, जो पानी या सीमेंट से नहीं, बल्कि शुद्ध देसी घी से सींची गई है।", "आप किसी भी मॉडर्न इंजीनियर से पूछ कर देख लो की क्या घी और चूने को मिलाकर कोई इतनी मजबूत नींव बन सकती है जो 500 साल तक टस से मस न हो?", "वो आपको पागल समझेगा! विज्ञान के सारे फॉर्मूले यहां आकर फेल हो जाते हैं। लेकिन जो काम विज्ञान नहीं कर पाता, वो हमारे देश में आस्था और धर्म के प्रति समर्पण कर दिखाता है।", "इस मंदिर की नींव में पानी की जगह डाला गया वो 40 हजार किलो घी आज भी हमारी उस गौरवशाली वास्तुकला का सबूत है, जिसे कोई विदेशी आक्रांता या इतिहासकार मिटा नहीं पाया।", "[object Object]", "अब सवाल ये उठता है की आखिर ऐसा क्या हो गया था की मंदिर की नींव में पानी की जगह घी डालना पड़ गया? इसके पीछे का इतिहास इतना इमोशनल और त्याग से भरा है की सुनकर किसी की भी आँखें भर आएं।", "इस मंदिर के निर्माण की शुरुआत 15वीं सदी में यानी 1468 ईस्वी में हुई थी। बीकानेर में एक बहुत ही रईस और धर्मपरायण जैन व्यापारी हुआ करते थे, जिनका नाम था ‘सेठ भांडाशाह ओसवाल’।", "वो जितने बड़े करोड़पति थे, उतने ही ज़मीन से जुड़े हुए इंसान। धर्म-कर्म और भगवान के प्रति उनकी आस्था का कोई ठिकाना नहीं था।", "उन्होंने ही जैन धर्म के 5वें तीर्थंकर भगवान सुमतिनाथ (Lord Sumatinatha) के लिए एक भव्य मंदिर बनवाने का संकल्प लिया था।", "काम ज़ोर-शोर से शुरू हुआ। पत्थरों की कटाई होने लगी, नींव खोदी जाने लगी। लेकिन तभी कुदरत ने एक भयंकर इम्तिहान ले लिया।", "उस दौर में बीकानेर और आस-पास के पूरे मारवाड़ इलाके में एक खौफनाक अकाल (सूखा) पड़ गया। यार, रेगिस्तान में सूखा पड़ने का मतलब समझते हो आप?", "मीलों-मीलों दूर तक पीने के लिए एक बूंद पानी नहीं मिलता। इंसानों से लेकर जानवरों तक के हलक सूख गए थे। पानी की कीमत सचमुच सोने-चांदी से भी ज्यादा हो गई थी।", "ऐसे में मंदिर के कारीगरों और मजदूरों ने सेठ भांडाशाह के सामने हाथ जोड़ लिए। बोले की “सेठ जी, पीने के लिए तो पानी है नहीं, तो फिर चूने और गारे (मसाले) में मिलाने के लिए पानी कहाँ से लाएं? काम रोकना पड़ेगा।”", "कोई और आम इंसान होता तो शायद हालात से समझौता कर लेता और कहता की चलो यार, जब बारिश होगी तब मंदिर-वंदिर बनवा लेंगे।", "लेकिन सेठ भांडाशाह किसी और ही मिट्टी के बने थे! उनका भगवान के प्रति जो समर्पण था, वो किसी सूखे या अकाल से डरने वाला नहीं था।", "उन्होंने वो फैसला लिया जिसे सुनकर उस ज़माने में बड़े-बड़े राजा-महाराजाओं के भी होश उड़ गए। सेठ जी ने फरमान जारी कर दिया की-", "[object Object]", "[object Object]", "वैसे, देसी घी के इस्तेमाल के पीछे बीकानेर में एक बहुत ही मशहूर और दिल छू लेने वाली लोककथा भी गूंजती है। कहते हैं की सेठ भांडाशाह ओसवाल के पास अथाह दौलत थी, लेकिन वो अन्न और ईश्वर के प्रसाद का एक कण भी बर्बाद नहीं होने देते थे।", "कहानी कुछ यूँ हैं की एक दिन जब मंदिर का काम चल रहा था, तब सेठ जी वहां मुआयना करने पहुंचे। वहां किसी बर्तन से शुद्ध घी की एक बूंद ज़मीन पर गिर गई।", "सेठ जी ने बिना किसी की परवाह किए उस मिट्टी में गिरी घी की बूंद को अपनी उंगली से उठाया और चाट लिया, ताकि अन्न और भगवान की दी हुई इस चीज़ का अपमान न हो।", "अब वहां पास में ही खड़ा एक कारीगर ये सब देख रहा था। उसे लगा की इतना बड़ा करोड़पति सेठ है और एक बूंद घी के लिए ऐसी हरकत कर रहा है!", "उसने तंज़ कसते हुए सेठ जी को ताना मार दिया की “क्या सेठ जी! इतने बड़े आदमी हो, लाखों का कारोबार है, और एक बूंद घी के लिए इतनी कंजूसी और लालच? ऐसे कैसे बनेगा इतना बड़ा मंदिर?”", "दोस्त, ये ताना सीधा सेठ जी के दिल पर जाकर लगा। लेकिन उन्होंने उस कारीगर पर कोई गुस्सा नहीं किया, उसे नौकरी से नहीं निकाला।", "उन्होंने बस ये ठान लिया की आज इस दुनिया को ये दिखाना ही पड़ेगा की मैं कंजूस नहीं हूँ, बल्कि मेरा लालच सिर्फ मेरे भगवान के चरणों की धूल पाने का है।", "सेठ जी ने उसी वक्त अपना पूरा खजाना खोल दिया। उन्होंने साबित कर दिया की वो धर्म के लिए अपनी जान और अपनी पाई-पाई तक लुटा सकते हैं।", "उन्होंने शहर भर का घी खरीद लिया और देखते ही देखते 40,000 किलो शुद्ध देसी घी मंदिर की उस गहरी नींव में उड़ेल दिया गया। उस कारीगर का सिर भी शर्म और सेठ जी की भक्ति देखकर झुक गया।", "[object Object]", "अब आप सोच रहे होंगे की चलो यार, इतिहास में कभी किसी ने घी डाल भी दिया होगा, तो आज 500 साल बाद उसका क्या? मिट्टी ने सोख लिया होगा!", "बस यहीं आकर तो दुनिया का बड़े से बड़ा विज्ञान हमारे सनातन और जैन धर्म के आगे घुटने टेक देता है।", "आज 2026 आ चुका है, पीढ़ियां की पीढ़ियां गुजर गईं, मुगलों से लेकर अंग्रेजों तक के राज खत्म हो गए, लेकिन उस धर्मनिष्ठ सेठ भांडाशाह का वो 40 हज़ार किलो देसी घी आज भी ज़िंदा है!", "ज़रा आज के समय का चमत्कार सुनिए। जब मई-जून के महीने में बीकानेर में भयंकर झुलसा देने वाली गर्मी पड़ती है और पारा 45 से 50 डिग्री के बीच पहुंच जाता है, तब इस मंदिर के फर्श और लाल पत्थरों की दीवारों से सचमुच घी रिसने लगता है!", "जी हाँ, 5 सदियों से ज़मीन के नीचे दबा वो शुद्ध देसी घी गर्मी पाकर आज भी बाहर आने लगता है।", "गर्मियों के दिनों में आप इस मंदिर में जाएं, तो फर्श इतना चिकना हो जाता है की पुजारियों और श्रद्धालुओं को फिसलने से बचने के लिए बहुत संभल-संभल कर चलना पड़ता है।", "मंदिर के गर्भगृह में कदम रखते ही आपको किसी परफ्यूम या अगरबत्ती की नहीं, बल्कि शुद्ध देसी घी की सौंधी महक आएगी।", "गोरे लोग अपने महंगे-महंगे कैमरे और टेस्टिंग किट लेकर यहाँ आते हैं, दीवारों का मुआयना करते हैं, सैंपल लेते हैं, लेकिन आज तक कोई भी साइंस ये डिकोड नहीं कर पाया की आखिर 5 सदियों बाद भी पत्थरों के बीच से वो घी वापस रिस कर बाहर कैसे आ रहा है!", "[object Object]", "सेठ भांडाशाह तो अपना सारा खजाना लुटाकर इस दुनिया से चले गए, लेकिन 1514 ईस्वी में उनकी बेटी ने इस भव्य मंदिर का निर्माण पूरा करवाया।", "यह मंदिर जैन धर्म के 5वें तीर्थंकर भगवान सुमतिनाथ जी का दरबार है। और भाईसाहब, इस मंदिर की कारीगरी के आगे दुनिया का हर महल और हर मकबरा आपको एकदम फीका लगने लगेगा।", "अगर आप इसके आर्किटेक्चर को करीब से देखें, तो ये तीन मंजिला इमारत लाल बलुआ पत्थर (Red Sandstone) और सफेद संगमरमर का एक ऐसा बेजोड़ संगम है जिसे देखकर आँखें फटी की फटी रह जाती हैं।", "मंदिर के अंदर की दीवारों और खंभों पर जो नक्काशी की गई है, उसे बीकानेर की मशहूर ‘उस्ता कला’ (Usta Art) कहा जाता है।", "कारीगरों ने 24 कैरेट असली सोने की पत्तियों (Gold leaf paintings) से भगवान की लीलाओं और जैन तीर्थंकरों की कहानियों को उकेरा है। रंग आज भी इतने ताजे लगते हैं जैसे कल ही किसी ने ब्रश चलाया हो।", "और शीशे (Mirror work) का वो बारीक काम… यार क्या गजब की कलाकारी है! जब मंदिर के गर्भगृह में दीपक जलाया जाता है, तो उसकी एक लौ हजारों शीशों से टकराकर पूरे दरबार को ऐसे जगमगा देती है की लगता है साक्षात देवता स्वर्ग से उतर आए हों।", "आप मंदिर की तीसरी मंज़िल यानी उसके शिखर पर चले जाइए, वहां से पूरे बीकानेर शहर का जो नज़ारा दिखता है, वो आपकी आत्मा को एक अजीब सा सुकून दे जाएगा।", "आज ये मंदिर भारतीय पुरातत्व सर्वेक्षण (ASI) द्वारा संरक्षित एक राष्ट्रीय स्मारक है, लेकिन दुख इस बात का है की हमारे ही देश के करोड़ों लोग इसके वजूद तक से अनजान हैं।", "मेरी तो बस एक ही गुजारिश है। छुट्टियों में अपने बच्चों को Disneyland या यूरोप ले जाने के बजाय, कभी उन्हें अपने राजस्थान के बीकानेर ले जाइए।", "उन्हें वो दीवारों से रिसता हुआ घी दिखाइए ताकि उन्हें पता चले की हमारी वास्तुकला के आगे दुनिया का हर विज्ञान बच्चा है।"],
  },
  {
    slug: "it-act-section-79",
    kind: "news",
    hi: "देश में हमेशा के लिए खत्म होने जा रही सोशल मीडिया कंपनियों की दादागिरी, ‘IT एक्ट धारा 79’ में बदलाव करके इनसे ‘लीगल प्रोटेक्शन’ छीनने जा रही भारत सरकार",
    en: "The bullying of social media companies is set to end for good — the Government of India moves to amend Section 79 of the IT Act and strip them of their ‘legal protection’",
    noteHi: "मध्यस्थ संरक्षण की परिभाषा बदलने वाला यह संशोधन तय करेगा कि भारत में कोई मंच किस हद तक अपने ऊपर लगे आरोपों से बच सकता है।",
    noteEn: "The amendment redefines intermediary protection — and with it, how far a platform in India can stand behind the content it carries.",
    date: "August 5, 2026",
    time: "2:36 pm",
    img: "/images/blog/tech-hand.png",
    imgW: 745,
    imgH: 742,
    alt: "Hand reaching towards a lit digital interface",
    kicker: "Section 79",
    kickerHi: "धारा 79",
    topic: "LAW & PLATFORMS",
    topicHi: "कानून एवं मंच",
  },
  {
    slug: "adinath-temple-bengal",
    kind: "news",
    hi: "जिसे ‘अदीना मस्जिद’ बताकर ढीट शांतिदूत पढ़ते रहे नमाज़, वो निकला भगवान शिव का ‘आदिनाथ मंदिर’, बंगाल में इस्लामी लूटेरों के 650 साल पुराने ‘कलंक’ को उखाड़ फेंकने को सनातनियों ने भरी हुंकार",
    en: "Long presented as the ‘Adina Masjid’, the site turns out to be Lord Shiva’s ‘Adinath Temple’ — Sanatanis in Bengal raise their voice to uproot a 650-year-old stain",
    date: "August 4, 2026",
    time: "7:44 pm",
    img: "/images/blog/mughal-temple-bw.png",
    imgW: 795,
    imgH: 440,
    alt: "Ruined temple architecture, archival tone",
    kicker: "Adinath Temple",
    kickerHi: "आदिनाथ मंदिर",
    topic: "HERITAGE",
    topicHi: "धरोहर",
  },
  {
    slug: "bankipur-revolt",
    kind: "news",
    hi: "“ये तो हमारी जेब की सीट है” वाला बीजेपी नेताओं का घमंड युवाओं ने कर दिया चकनाचूर, थोपे गए उम्मीदवारों के खिलाफ ‘बांकीपुर’ से उठी बगावत ने कर दिया ‘BJP’ का सूपड़ा साफ़",
    en: "“This seat is in our pocket” — young voters shatter the arrogance of BJP leaders as the revolt from Bankipur against imposed candidates wipes the party out",
    date: "August 4, 2026",
    time: "5:41 pm",
    kicker: "Bankipur",
    kickerHi: "बांकीपुर",
    topic: "ELECTIONS",
    topicHi: "चुनाव",
  },
  {
    slug: "telegram-surveillance-law",
    kind: "editorial",
    hi: "जिहादी ‘कट्टरपंथ’ और ‘साइबर ठगी’ से लेकर ‘आतंकवाद’ तक, सारे ‘काले कारनामों’ का अड्डा बना ‘Telegram’, जल्द ही नहीं लाया गया कोई सख्त ‘निगरानी कानून’ तो देश में किसी बड़ी अनहोनी को दे सकता ये अंजाम",
    en: "From jihadi radicalism and cyber fraud to terrorism, ‘Telegram’ has become the den of every dark deed — without a strict surveillance law it could end in a national catastrophe",
    date: "August 4, 2026",
    time: "12:40 pm",
    kicker: "Telegram",
    kickerHi: "टेलीग्राम",
    topic: "CYBER CRIME",
    topicHi: "साइबर अपराध",
  },
  {
    slug: "kanwar-yatra",
    kind: "blog",
    hi: "ना कोई अमीर, ना कोई गरीब, पैरों में छाले और कंधों पर भारी गंगाजल, शरीर दर्द से चीखता लेकिन जुबान पर होता सिर्फ ‘बम-बम भोले’, हिंदू आस्था का सबसे बड़ा सैलाब है ‘कांवर यात्रा’",
    en: "Neither rich nor poor — blistered feet, Ganga water on aching shoulders, and only ‘Bam-Bam Bhole’ on every tongue: the Kanwar Yatra is the greatest flood of Hindu faith",
    date: "August 3, 2026",
    time: "6:41 pm",
    kicker: "Kanwar Yatra",
    kickerHi: "कांवर यात्रा",
    topic: "FAITH",
    topicHi: "आस्था",
  },
  {
    slug: "kulgam-massacre",
    kind: "news",
    hi: "क्या कश्मीर में हिंदू होना ही बन गया सब से बड़ा गुनाह? पहलगाम के बाद अब कुलगाम में सनातनियों का नरसंहार, बार-बार हिंदुओं का नाम पूछकर ही ये जिहादी क्यों करते कत्लेआम",
    en: "Has being Hindu in Kashmir become the greatest crime? After Pahalgam, a massacre of Sanatanis in Kulgam — why do these jihadis ask for Hindu names before they kill",
    date: "August 3, 2026",
    time: "4:16 pm",
    kicker: "Kulgam",
    kickerHi: "कुलगाम",
    topic: "KASHMIR",
    topicHi: "कश्मीर",
  },
  {
    slug: "chandragupta-maurya",
    kind: "blog",
    hi: "सम्राट चंद्रगुप्त मौर्य: जिसने अखंड साम्राज्य की नींव रखी",
    en: "Emperor Chandragupta Maurya: the man who laid the foundation of an undivided empire",
    date: "August 3, 2026",
    time: "2:54 pm",
    kicker: "Chandragupta Maurya",
    kickerHi: "चंद्रगुप्त मौर्य",
    topic: "HISTORY",
    topicHi: "इतिहास",
  },
  {
    slug: "pappu-yadav-saints",
    kind: "editorial",
    hi: "खुद का इतिहास गुंडागर्दी का और हमारे साधुओं को बता रहा चोर! चंदा चोरी के झूठे नाटक में भगवे का सरेआम मज़ाक उड़ाने वाले पप्पू यादव को सनातन समाज कभी नहीं करेगा माफ",
    en: "A record of thuggery of his own, yet he calls our saints thieves — Sanatan society will never forgive Pappu Yadav for publicly mocking the saffron over a fake donation-theft drama",
    date: "August 1, 2026",
    time: "9:36 pm",
    img: "/images/blog/rally-flag.png",
    imgW: 490,
    imgH: 490,
    alt: "Saffron flags raised at a rally",
    kicker: "Pappu Yadav",
    kickerHi: "पप्पू यादव",
    topic: "DHARMA",
    topicHi: "धर्म",
  },
  {
    slug: "ankit-sharma-justice",
    kind: "editorial",
    hi: "सवर्ण हिंदू अफसर अंकित शर्मा को 51 बार चाकुओं से गोदने वाले ‘ताहिर हुसैन’ को फांसी से बचाया और NEET प्रोटेस्ट में पुलिस को सड़क पर पीटने वाले गुंडों को सरकार ने किया माफ़, आखिर देश सेवा करने वालों की जान इतनी सस्ती क्यों",
    en: "‘Tahir Hussain’, who stabbed officer Ankit Sharma 51 times, was spared the gallows, and goons who beat police on the street during the NEET protest were pardoned — why is the life of those who serve the nation so cheap",
    date: "August 1, 2026",
    time: "7:52 pm",
    kicker: "Ankit Sharma",
    kickerHi: "अंकित शर्मा",
    topic: "JUSTICE",
    topicHi: "न्याय",
  }
];

export const blogKinds: { id: BlogKind | "all"; label: string; labelHi: string }[] = [
  { id: "all", label: "All", labelHi: "सभी" },
  { id: "editorial", label: "Editorial", labelHi: "संपादकीय" },
  { id: "news", label: "News", labelHi: "समाचार" },
  { id: "blog", label: "Blog", labelHi: "ब्लॉग" },
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
