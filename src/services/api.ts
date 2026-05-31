import type { SiteData } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function getHomeData(): Promise<SiteData> {
  const res = await fetch(`${BASE_URL}/home`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
