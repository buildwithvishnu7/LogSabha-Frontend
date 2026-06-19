import type { GlobalData } from "@/types";

export const globalData: GlobalData = {
  nav: {
    logo: "/logo/mainlogofinal.gif",
    links: [
      { label: "Home", href: "/" },
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
      expandedHeight: 260,
    },
    {
      id: "rss",
      label: "Rashtriya Swayamsevak Sangh",
      image: "/logo/rss.gif",
      href: "#",
      expandedHeight: 120,
    },
  ],
};
