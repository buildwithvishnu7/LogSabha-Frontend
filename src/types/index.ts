// ─── Hero ───
export interface HeroStat {
  label: string;
  value: string;
  unit: string;
}

export interface HeroData {
  title: string;
  titleHighlight: string;
  subtitle: string;
  videoSrc: string;
  posterSrc: string;
  watermarkLogo: string;
  stats: HeroStat[];
}

// ─── Side Badges (global sticky) ───
export interface SideBadge {
  id: string;
  label: string;
  image: string;
  href: string;
  expandedHeight: number;
}

// ─── Nav ───
export interface NavLink {
  label: string;
  href: string;
}

export interface NavData {
  links: NavLink[];
  logo: string;
}

// ─── Generic Section ───
export interface SectionData {
  id: string;
  title: string;
  description: string;
  content?: unknown;
}

// ─── Full Page Data ───
export interface HomePageData {
  hero: HeroData;
  sections: SectionData[];
}

export interface GlobalData {
  nav: NavData;
  sideBadges: SideBadge[];
}
