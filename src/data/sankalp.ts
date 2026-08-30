// GENERATED from reference/new_ref/assets/sankalp-data.js — do not hand-edit.
//
// कलम का संकल्प (Kalam Ka Sankalp), the founder's column.
//
// ⚠ THIS INDEX IS INCOMPLETE, AND DELIBERATELY SO.
// The column runs to 4 pages on the live site; only page 1
// was ever captured by the Internet Archive. The 9 entries below are every
// article that can be verified. The rest exist — they are simply not
// recoverable from here. They are NOT guessed at, and the page says so on
// screen rather than quietly showing 9 and implying that is all of them.
//
// SOURCE: logsabha.com/kalam-ka-sankalp/ — Internet Archive, 16 November 2025

export type SankalpArticle = {
  /** the Devanagari monogram the plate carries */
  mono: string;
  /** title, in Hindi as published */
  t: string;
  /** the piece on logsabha.com */
  u: string;
  /** ISO date */
  d: string;
  /** published time, as the source printed it */
  tm: string;
  img: string | null;
};

export const sankalpHero = {
  "kicker": "कलम का संकल्प",
  "title": "कलम का संकल्प",
  "author": "संदीप (शिवा)",
  "role": "संस्थापक – लोगसभा",
  "tagline": "ना झुके, ना रुके – धर्म, राष्ट्र और संस्कृति के लिए समर्पित संकल्प।",
  "category": "Sankalp"
} as const;

export const sankalpArticles: SankalpArticle[] = [
  {
    "mono": "नं",
    "t": "अटूट श्रद्धा: युगों-युगों से नंदी की निश्चल पहरेदारी",
    "u": "https://logsabha.com/unblinking-devotion-nandis-vigil-through-the-ages/",
    "d": "2025-11-14",
    "tm": "5:01 pm",
    "img": null
  },
  {
    "mono": "पा",
    "t": "पारसी: प्राचीन फ़ारस से भारत तक आस्था और पहचान का महान सफ़र",
    "u": "https://logsabha.com/the-parsis-from-the-sacred-fires-of-persia-to-the-shores-of-india/",
    "d": "2025-11-13",
    "tm": "5:08 pm",
    "img": null
  },
  {
    "mono": "चो",
    "t": "राजराज चोल प्रथम और चोल साम्राज्य की विरासत: आस्था, शक्ति और वैश्विक प्रभाव",
    "u": "https://logsabha.com/rajaraja-chola-i-and-the-legacy-of-the-chola-empire-devotion-power-and-global-influence/",
    "d": "2025-11-12",
    "tm": "4:53 pm",
    "img": null
  },
  {
    "mono": "बा",
    "t": "तीर्थ की ज्योति: बागेश्वर बाबा और भारत का आध्यात्मिक जागरण",
    "u": "https://logsabha.com/the-pilgrims-light-bageshwar-baba-and-indias-spiritual-awakening/",
    "d": "2025-11-11",
    "tm": "3:26 pm",
    "img": null
  },
  {
    "mono": "पु",
    "t": "व्लादिमीर पुतिन: केजीबी अधिकारी से रूस के अजेय शासक तक",
    "u": "https://logsabha.com/vladimir-putin-from-kgb-officer-to-russias-indomitable-ruler/",
    "d": "2025-11-09",
    "tm": "4:11 pm",
    "img": null
  },
  {
    "mono": "प",
    "t": "सरदार वल्लभभाई पटेल: भारत की एकता के लौह पुरुष",
    "u": "https://logsabha.com/sardar-vallabhbhai-patel-the-iron-architect-of-indias-unity/",
    "d": "2025-11-08",
    "tm": "5:22 pm",
    "img": null
  },
  {
    "mono": "सो",
    "t": "सोमनाथ मंदिर: आस्था, विनाश और अनंत पुनर्जन्म का इतिहास",
    "u": "https://logsabha.com/the-somnath-temple-a-chronicle-of-faith-destruction-and-eternal-rebirth/",
    "d": "2025-11-07",
    "tm": "5:59 pm",
    "img": null
  },
  {
    "mono": "वि",
    "t": "लुप्त हुई आबादी: कैसे विभाजन ने पाकिस्तान से हिंदुओं को मिटा दिया",
    "u": "https://logsabha.com/the-vanished-millions-how-partition-erased-the-hindus-of-pakistan/",
    "d": "2025-11-06",
    "tm": "3:23 pm",
    "img": null
  },
  {
    "mono": "ल",
    "t": "ललितादित्य मुक्तापीड: वह भुला दिया गया सम्राट जिसने कश्मीर को एशिया का केंद्र बनाया",
    "u": "https://logsabha.com/lalitaditya-muktapida-the-forgotten-emperor-who-made-kashmir-the-heart-of-asia/",
    "d": "2025-11-05",
    "tm": "4:50 pm",
    "img": null
  }
];

/** How much of the column this index actually covers. Rendered on the page.  */
export const sankalpCoverage = {
  articles: 9,
  pagesCaptured: 1,
  pagesTotal: 4,
  source: "logsabha.com/kalam-ka-sankalp/ — Internet Archive, 16 November 2025",
} as const;

const MONTHS = ["जनवरी","फ़रवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितम्बर","अक्टूबर","नवम्बर","दिसम्बर"];

/** 2025-11-14 → 14 नवम्बर 2025. The column is written in Hindi; an English
 *  date under a Hindi headline reads as a machine's footnote. */
export function hindiDate(iso: string): string {
  const p = iso.split('-');
  return `${parseInt(p[2], 10)} ${MONTHS[parseInt(p[1], 10) - 1]} ${p[0]}`;
}
