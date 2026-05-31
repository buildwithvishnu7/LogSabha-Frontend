import { homeData } from "@/data/home";
import { globalData } from "@/data/global";
import type { HomePageData, GlobalData } from "@/types";

export async function getHomeData(): Promise<HomePageData> {
  return homeData;
}

export async function getGlobalData(): Promise<GlobalData> {
  return globalData;
}
