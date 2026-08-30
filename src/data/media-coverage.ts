// GENERATED from reference/new_ref/assets/media-data.js — do not hand-edit.
//
// Every title, channel name and asset path was read out of the approved
// frontend's live DOM — nothing paraphrased or invented. All ten assets
// (six channel marks, one still, three reels) are present in public/.
//
// SOURCE: Approved Next.js frontend (log-sabha-frontend, buildwithvishnu7) — live DOM read, 24 Aug 2026

export type Channel = { name: string; file: string };

export type Clip = {
  id: string;
  /** headline as it runs on the card */
  t: string;
  /** the strap under it */
  sub: string;
  kind: "image" | "video";
  src: string;
};

export const mediaHero = {
  "kicker": "Media Coverage",
  "title": "Featured across India’s leading news networks",
  "lede": "Every clip and channel mark here is read from the approved LogSabha site, not written to fit the page — the placeholders below say so wherever the file itself is not part of this build."
} as const;

/** Order matches the marquee on the live frontend, left to right. */
export const channels: Channel[] = [
  {
    "name": "News18",
    "file": "/images/news-channels/news18.svg"
  },
  {
    "name": "Times Now",
    "file": "/images/Timesnow.jpg"
  },
  {
    "name": "NavBharat",
    "file": "/images/news-channels/navbharat.svg"
  },
  {
    "name": "TV9",
    "file": "/images/news-channels/tv9.svg"
  },
  {
    "name": "News18 Hindi",
    "file": "/images/news-channels/news18-hindi.svg"
  },
  {
    "name": "Republic",
    "file": "/images/news-channels/republic.svg"
  }
];

/** Order matches the four cards on the live frontend. */
export const clips: Clip[] = [
  {
    "id": "clip-0",
    "t": "Nation’s Pride",
    "sub": "The Great Hindu Revival",
    "kind": "image",
    "src": "/images/RAM-INDIA-TODAY.jpg"
  },
  {
    "id": "clip-1",
    "t": "NDA Sweeps",
    "sub": "Political Analysis",
    "kind": "video",
    "src": "/videos/speech1.mp4"
  },
  {
    "id": "clip-2",
    "t": "Jai Shri Ram",
    "sub": "Cultural Renaissance",
    "kind": "video",
    "src": "/videos/ramji.mp4"
  },
  {
    "id": "clip-3",
    "t": "The Saffron Grip",
    "sub": "Rising Bharat",
    "kind": "video",
    "src": "/videos/saffron-grip.mp4"
  }
];

export const mediaSource = "Approved Next.js frontend (log-sabha-frontend, buildwithvishnu7) — live DOM read, 24 Aug 2026";
