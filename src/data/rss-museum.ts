// Static content for /rss-museum, from the designer reference (RSS Museum.dc.html).
//
// The museum is a second view over the SAME hundred years as /rss — it reuses
// rssEras / rssYears rather than duplicating them. What differs is the
// presentation: /rss is a vertical timeline, this is a wall of framed
// photographs paged one era at a time.

export const museumData = {
  hero: {
    kicker: "MUSEUM OF HISTORY · 1925—2025",
    titleTop: "स्मृतियों का",
    titleMain: "संग्रहालय",
    subtitle:
      "राष्ट्रीय स्वयंसेवक संघ की सौ वर्ष की यात्रा — 1925 से 2025 तक — दीवार पर टँगे चित्रों की तरह। प्रत्येक वर्ष एक फ़्रेम, एक घटना, एक स्मृति।",
    /** three tilted preview frames pinned above the title */
    previews: [
      { year: 1925, image: "/images/rss/y1925.jpg", rotate: -4.5, drift: 9, delay: 0 },
      { year: 1963, image: "/images/rss/y1963.jpg", rotate: 3.2, drift: 11, delay: 0.8 },
      { year: 2025, image: "/images/rss/y2025.jpg", rotate: -2.4, drift: 10, delay: 1.6 },
    ],
    timelineLink: { label: "मूल समयरेखा", href: "/rss" },
  },

  gallery: {
    prev: "पिछला कालखंड",
    next: "अगला कालखंड",
    top: "ऊपर लौटें",
    countSuffix: "चित्र",
  },
};

/* Museum palette — deliberately its own, not the /rss saffron-and-navy:
   aged paper #F2E9DB · mat #FDF8EE · ink #3B2F26 · muted #7A6247 / #A08A6C
   rule #D6BC8C · seal maroon #7C1D1D · antique gold #B8892F */
export const MUSEUM = {
  paper: "#F2E9DB",
  mat: "#FDF8EE",
  ink: "#3B2F26",
  muted: "#7A6247",
  faint: "#A08A6C",
  rule: "rgba(214,188,140,0.6)",
  seal: "#7C1D1D",
  gold: "#B8892F",
} as const;
