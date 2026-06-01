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

// ─── Political Landscape Section ───
export interface StateData {
  id: string;
  name: string;
  seats: number;
  ndaSeats: number;
  indiaSeats: number;
  otherSeats: number;
}

export interface PlatformStat {
  icon: string;
  value: string;
  label: string;
}

export interface PoliticalLandscapeData {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  backgroundVideo: string;
  backgroundPoster: string;
  overallStats: PlatformStat[];
  states: StateData[];
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
  politicalLandscape: PoliticalLandscapeData;
  sections: SectionData[];
}

export interface GlobalData {
  nav: NavData;
  sideBadges: SideBadge[];
}
