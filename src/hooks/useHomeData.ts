import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/services";
import { homeData } from "@/data/home";

export function useHomeData() {
  return useQuery({
    queryKey: ["home"],
    queryFn: getHomeData,
    // Static-first: render bundled content immediately (also server-rendered
    // for SEO); the API fetch then replaces it when/if it succeeds.
    placeholderData: homeData,
  });
}
