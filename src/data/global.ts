import type { GlobalData } from "@/types";

export const globalData: GlobalData = {
  nav: {
    logo: "/logo/Logfinalsabha.gif",
    links: [
      { label: "Political Analysis", href: "/political-analysis" },
      { label: "Hindu For Justice", href: "/hindu-for-justice" },
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "News", href: "/news" },
      { label: "Blog", href: "/blog" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  sideBadges: [
    {
      id: "hfj",
      label: "Hindu for Justice",
      image: "/logo/HFJ-logo-final-new.gif",
      href: "/hindu-for-justice",
      expandedHeight: 250,
    },
    {
      id: "rss",
      label: "RSS",
      image: "/logo/rss.gif",
      href: "#",
      expandedHeight: 160,
    },
  ],
};
