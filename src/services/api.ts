import type { HomePageData, GlobalData } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function getHomeData(): Promise<HomePageData> {
  const res = await fetch(`${BASE_URL}/home`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getGlobalData(): Promise<GlobalData> {
  const res = await fetch(`${BASE_URL}/global`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
