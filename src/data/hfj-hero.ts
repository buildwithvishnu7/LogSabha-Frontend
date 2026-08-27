// Hand-written, unlike hfj-chapters.ts which is generated — keeping it separate
// means regenerating the chapters never clobbers the hero.
//
// Lifted from the previous src/data/hindu-for-justice.ts before that file was
// removed. The only change is the hero image: .png → .jpg, matching the rest of
// the page's photographs, which moved to JPEG when the PNG set turned out to be
// 29MB against the same images' 4.9MB.

export const hfjHero = {
  title: "Timeline of Key Events in the Persecution of Hindus",
  subtitle:
    "Tracing centuries of invasion, resistance and endurance — one of history's most overlooked narratives.",
  image: "/images/hfj/hero-scroll.jpg",
  imageAlt: "Historical scroll",
  chips: [
    { era: "11th Century", text: "Mahmud of Ghazni raids Hindu temples." },
    { era: "16th–17th Century", text: "Aurangzeb's reign persecutes Hindus." },
  ],
};
