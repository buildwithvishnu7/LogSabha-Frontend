import { homeData } from "@/data/home";
import { globalData } from "@/data/global";
import type {
  HomePageData,
  GlobalData,
  ServiceItem,
  PoliticalParty,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Small typed GET against the Public API. Throws on non-2xx so callers can
// decide whether to fall back.
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1${path}`);
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// Fetch, but never explode: on failure log and return null so the page can fall
// back to bundled static content (a CMS blip must not white-screen the site).
async function safe<T>(path: string): Promise<T | null> {
  try {
    return await get<T>(path);
  } catch (e) {
    console.warn(`[api] ${path} unavailable, using fallback:`, e);
    return null;
  }
}

function apiToServiceItem(s: any): ServiceItem {
  return {
    id: s.slug,
    icon: s.icon,
    title: s.title,
    description: s.description,
    image: s.image ?? "",
    stats: s.stats ?? [],
    bulletPoints: s.bulletPoints ?? [],
    learnMoreLink: s.learnMoreLink ?? "",
  };
}

function apiToParty(p: any): PoliticalParty {
  return {
    id: p.slug,
    shortName: p.shortName ?? "",
    fullName: p.name,
    established: p.foundedYear ?? 0,
    logo: p.logo ?? "",
    backgroundImage: p.backgroundImage ?? "",
    themeColor: p.colors?.primary ?? "#ff9933",
    themeColorRgb: p.colors?.primaryRgb ?? "245, 158, 11",
    description: p.description ?? "",
    lokSabhaSeats: p.lokSabhaSeats ?? 0,
    statesRuled: p.statesRuled ?? 0,
    president: p.president ?? "",
  };
}

export async function getHomeData(): Promise<HomePageData> {
  const [hero, servicesHeader, services, landscape, states] = await Promise.all([
    safe<any>("/hero"),
    safe<any>("/services-section"),
    safe<any[]>("/services"),
    safe<any>("/political-landscape"),
    safe<any[]>("/states"),
  ]);

  const fallbackLandscape = homeData.politicalLandscape;

  return {
    // API hero has no `stats` (we removed the price banner) → keep static stats.
    hero: hero ? { ...homeData.hero, ...hero } : homeData.hero,
    politicalLandscape: {
      ...fallbackLandscape,
      ...(landscape ?? {}),
      // states come from their own collection; each maps slug → id.
      states: states?.length
        ? states.map((s: any) => ({ ...s, id: s.slug }))
        : fallbackLandscape.states,
    },
    services: {
      title: servicesHeader?.title ?? homeData.services.title,
      titleHighlight:
        servicesHeader?.titleHighlight ?? homeData.services.titleHighlight,
      subtitle: servicesHeader?.subtitle ?? homeData.services.subtitle,
      services: services?.length
        ? services.map(apiToServiceItem)
        : homeData.services.services,
    },
    sections: [],
  };
}

export async function getGlobalData(): Promise<GlobalData> {
  const g = await safe<any>("/global");
  if (!g) return globalData;
  return {
    nav: {
      logo: g.navLogo || globalData.nav.logo,
      links: g.navLinks?.length ? g.navLinks : globalData.nav.links,
    },
    sideBadges: g.sideBadges?.length ? g.sideBadges : globalData.sideBadges,
  };
}

// Parties are consumed directly by the section (not threaded through HomeData).
// Throws on failure so React Query surfaces it and the section uses its fallback.
export async function getParties(): Promise<PoliticalParty[]> {
  const list = await get<any[]>("/parties");
  return list.map(apiToParty);
}

// Standalone singleton sections (each consumed by its own section component,
// with a bundled fallback so the section never renders empty).
export async function getLogSabhaStory(): Promise<any | null> {
  return safe<any>("/logsabha-story");
}

export async function getFounderEditorial(): Promise<any | null> {
  return safe<any>("/founder-editorial");
}

export async function getHinduForJustice(): Promise<any | null> {
  return safe<any>("/hindu-for-justice");
}

export async function getContact(): Promise<any | null> {
  return safe<any>("/contact");
}
export async function getLiveCoverage(): Promise<any | null> {
  return safe<any>("/live-coverage");
}
export async function getCommunity(): Promise<any | null> {
  return safe<any>("/community");
}
export async function getSocialPresence(): Promise<any | null> {
  return safe<any>("/social-presence");
}
export async function getNewsTicker(): Promise<any | null> {
  return safe<any>("/news-ticker");
}
export async function getRss(): Promise<any | null> {
  return safe<any>("/rss");
}
export async function getEditorialInsights(): Promise<any | null> {
  return safe<any>("/editorial-insights");
}
export async function getMediaCoverage(): Promise<any | null> {
  return safe<any>("/media-coverage");
}
export async function getDataInsights(): Promise<any | null> {
  return safe<any>("/data-insights");
}
