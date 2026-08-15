import type { GlobalData } from "@/types";

export const globalData: GlobalData = {
  nav: {
    logo: "/logo/mainlogofinal.gif",
    // Every href here must resolve to a route in app/. "News" used to point at
    // /news, which has never existed — the editorial archive lives at /blog.
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Political Analysis", href: "/political-analysis" },
      { label: "Hindu For Justice", href: "/hindu-for-justice" },
      { label: "RSS 100", href: "/rss" },
      { label: "Museum", href: "/rss-museum" },
      { label: "Editorial", href: "/blog" },
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
