import { homeData } from "@/data/home";
import type { SiteData } from "@/types";

export async function getHomeData(): Promise<SiteData> {
  return homeData;
}
