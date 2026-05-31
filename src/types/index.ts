export interface SiteData {
  hero: HeroData;
  sections: SectionData[];
}

export interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  videoSrc?: string;
  posterSrc?: string;
}

export interface SectionData {
  id: string;
  title: string;
  description: string;
  content?: unknown;
}
