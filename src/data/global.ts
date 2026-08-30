import type { GlobalData } from "@/types";

export const globalData: GlobalData = {
  nav: {
    logo: "/logo/mainlogofinal.gif",
    // Every href here must resolve to a route in app/. "News" used to point at
    // /news, which has never existed — the editorial archive lives at /blog.
    //
    // Grouped rather than flat: the new modules would have taken the row to
    // fifteen items, and it was already tight enough at nine that the padding
    // had to be trimmed to fit 1280px. Three groups bring the top level DOWN to
    // eight while making every module reachable.
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      // Only routes that exist in app/ are listed. Entries are added here as
      // each module lands, so the nav can never point at a 404 — still to come:
      // /political-parties (Data), /live-coverage + /media-coverage + /sankalp
      // (Media), and /community-forum as its own top-level "Forum".
      {
        label: "Data",
        href: "/political-analysis",
        children: [
          {
            label: "Political Analysis",
            href: "/political-analysis",
            blurb: "India extruded — every state by seats, turnout or alliance share",
          },
          {
            label: "Election Database",
            href: "/election-database",
            blurb: "All 543 seats of the House, and the constituency record",
          },
        ],
      },
      {
        label: "Heritage",
        href: "/hindu-for-justice",
        children: [
          { label: "Hindu For Justice", href: "/hindu-for-justice", blurb: "The editorial record, chapter by chapter" },
          { label: "RSS 100", href: "/rss", blurb: "A century, year by year" },
          { label: "Museum", href: "/rss-museum", blurb: "The centenary exhibit" },
        ],
      },
      {
        label: "Media",
        href: "/blog",
        children: [
          { label: "Editorial", href: "/blog", blurb: "Long-form writing and analysis" },
          { label: "Live Coverage", href: "/live-coverage", blurb: "The live session and the speech library" },
          { label: "Media Coverage", href: "/media-coverage", blurb: "Broadcast clips and press marks" },
          { label: "कलम का संकल्प", href: "/sankalp", blurb: "The founder's column" },
        ],
      },
      { label: "Forum", href: "/community-forum" },
      { label: "Contact", href: "/contact" },
    ],
  },
  sideBadges: [
    {
      id: "hfj",
      label: "Hindu for Justice",
      image: "/logo/HFJ-logo-final-new.gif",
      href: "/hindu-for-justice",
      expandedHeight: 260,
    },
    {
      id: "rss",
      label: "Rashtriya Swayamsevak Sangh",
      image: "/logo/rss.gif",
      href: "/rss",
      expandedHeight: 120,
    },
  ],
};
