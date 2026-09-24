/* Site search over the bundled content.
 *
 * There is no search API yet, so this answers from what already ships in the
 * bundle: the nav pages, every party, every loaded constituency, every blog
 * post and every service. A few hundred entries — cheap to scan on each
 * keystroke, no index to keep warm. Results deep-link where a route exists
 * (blog posts have slugs); otherwise they open the section page that holds
 * the record, which is still one click closer than a cleared search box.
 * (UX feedback #21: the box used to accept text and then do nothing.)
 */
import { globalData } from "@/data/global";
import { homeData } from "@/data/home";
import { parties } from "@/data/parties";
import { constituencies } from "@/data/constituencies";
import { blogPosts } from "@/data/blog";

export type SearchHit = {
  kind: "Page" | "Party" | "Constituency" | "Article" | "Service";
  title: string;
  sub?: string;
  href: string;
};

type Entry = SearchHit & { hay: string; alias?: string };
type Link = (typeof globalData)["nav"]["links"][number];

// Tie-break within a score band: a record beats an article that mentions it.
const KIND_RANK: Record<SearchHit["kind"], number> = { Page: 0, Party: 1, Constituency: 2, Service: 3, Article: 4 };

let INDEX: Entry[] | null = null;

function build(): Entry[] {
  const out: Entry[] = [];
  const add = (e: SearchHit, alias?: string) =>
    out.push({ ...e, alias: alias?.toLowerCase(), hay: `${e.title} ${e.sub ?? ""}`.toLowerCase() });

  const walk = (links: readonly Link[]) => {
    for (const l of links) {
      add({ kind: "Page", title: l.label, sub: (l as { blurb?: string }).blurb, href: l.href });
      if (l.children) walk(l.children as Link[]);
    }
  };
  walk(globalData.nav.links);

  for (const p of parties) {
    // the short code is what people actually type ("bjp", "inc")
    add({ kind: "Party", title: p.full, sub: `${p.k} · est. ${p.founded}`, href: "/political-parties" }, p.k);
  }
  for (const c of constituencies) {
    add({ kind: "Constituency", title: c.c, sub: `${c.s} · ${c.w} (${c.p})`, href: "/election-database" });
  }
  for (const b of blogPosts) {
    add({ kind: "Article", title: b.en, sub: b.hi, href: `/blog/${b.slug}` });
  }
  for (const s of homeData.services.services) {
    add({ kind: "Service", title: s.title, sub: s.description, href: "/services" });
  }
  return out;
}

/** Ranked matches for a query. Empty below two characters, so a single
 *  keystroke never flashes a "no results" panel. */
export function searchSite(query: string, limit = 8): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  INDEX ??= build();

  const terms = q.split(/\s+/);
  const scored: Array<[number, Entry]> = [];
  for (const e of INDEX) {
    if (!terms.every((t) => e.hay.includes(t) || e.alias?.includes(t))) continue;
    const title = e.title.toLowerCase();
    // exact title or alias, then prefix, then anywhere in the title, then
    // only in the subtitle — so "bjp" lists the party itself first, not an
    // article that happens to mention it
    const score =
      title === q || e.alias === q ? 0
      : title.startsWith(q) || e.alias?.startsWith(q) ? 1
      : title.includes(q) ? 2
      : 3;
    scored.push([score, e]);
  }
  scored.sort((a, b) => a[0] - b[0] || KIND_RANK[a[1].kind] - KIND_RANK[b[1].kind]);
  return scored.slice(0, limit).map(([, e]) => ({ kind: e.kind, title: e.title, sub: e.sub, href: e.href }));
}
